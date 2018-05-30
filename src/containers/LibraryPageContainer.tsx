import { Location } from 'history'
import qs from 'qs'
import React from 'react'
import { RouteProps } from 'react-router'
import { Page } from '../components/Page'
import * as crossref from '../editor/lib/crossref'
import * as datacite from '../editor/lib/datacite'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { generateID } from '../transformer/id'
import { BIBLIOGRAPHY_ITEM } from '../transformer/object-types'
import { BibliographyItem, ComponentCollection } from '../types/components'
import { LibraryDocument, LibrarySource } from '../types/library'
import LibraryContainer from './LibraryContainer'
import LibrarySidebar from './LibrarySidebar'
import LibrarySourceContainer from './LibrarySourceContainer'

const sources: LibrarySource[] = [
  {
    id: 'library',
    name: 'Library',
  },
  {
    id: 'crossref',
    name: 'Crossref',
    search: crossref.search,
    fetch: crossref.fetch,
  },
  {
    id: 'datacite',
    name: 'DataCite',
    search: datacite.search,
    fetch: datacite.fetch,
  },
]

interface State {
  item: BibliographyItem | null
  items: BibliographyItem[] | null
  library: LibraryDocument[]
  query: string | null
  source: string
}

type Props = RouteProps & ComponentsProps

class LibraryPageContainer extends React.Component<Props, State> {
  public state = {
    item: null,
    items: null,
    library: [],
    query: null,
    source: 'library',
  }

  public componentDidMount() {
    this.setSource(this.props)

    this.getCollection()
      .find({
        objectType: BIBLIOGRAPHY_ITEM,
      })
      .sort({
        updatedAt: 'desc',
      })
      .$.subscribe((library: LibraryDocument[]) => {
        this.setState({ library })
      })
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setSource(nextProps)
  }

  public render() {
    const { library, source } = this.state

    if (!source) return null

    const librarySource = sources.find(item => item.id === source)

    if (!librarySource) return null

    return (
      <Page>
        <LibrarySidebar sources={sources} />

        {source === 'library' ? (
          <LibraryContainer
            library={library}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
          />
        ) : (
          <LibrarySourceContainer
            library={library}
            source={librarySource}
            handleAdd={this.handleAdd}
            hasItem={this.hasItem}
          />
        )}
      </Page>
    )
  }

  private getCollection() {
    return this.props.components.collection as ComponentCollection
  }

  private setSource(props: Props) {
    const location = props.location as Location
    const query = qs.parse(location.search.substr(1))
    this.setState({
      source: query.source || 'library',
    })
  }

  private handleAdd = async (item: BibliographyItem) => {
    await this.props.components.saveComponent('', {
      id: generateID('bibliography_item') as string,
      objectType: BIBLIOGRAPHY_ITEM,
      ...item,
    })
  }

  private handleSave = (item: BibliographyItem) =>
    this.props.components.saveComponent('', item)

  private handleDelete = async (item: BibliographyItem) => {
    await this.props.components.deleteComponent(item.id)

    this.setState({
      item: null,
    })

    return item.id
  }

  // TODO: move this to source definition
  private hasItem = (item: BibliographyItem): boolean => {
    return this.state.library.some(
      (libraryItem: LibraryDocument) => libraryItem.get('DOI') === item.DOI
    )
  }
}

export default withComponents(LibraryPageContainer)