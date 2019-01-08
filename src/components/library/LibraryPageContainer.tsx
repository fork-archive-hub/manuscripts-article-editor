import { buildBibliographyItem } from '@manuscripts/manuscript-editor'
import { BibliographyItem, Project } from '@manuscripts/manuscripts-json-schema'
import qs from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { RxDocument } from 'rxdb'
import { sources } from '../../lib/sources'
import { ModelsProps, withModels } from '../../store/ModelsProvider'

import { Page } from '../Page'
import LibraryContainer from './LibraryContainer'
import LibrarySidebar from './LibrarySidebar'
import LibrarySourceContainer from './LibrarySourceContainer'

interface State {
  item: BibliographyItem | null
  items: BibliographyItem[] | null
  query: string | null
  source: string
}

interface Props {
  library: Map<string, BibliographyItem>
  project: Project
}

type CombinedProps = Props &
  RouteComponentProps<{
    projectID: string
  }> &
  ModelsProps

class LibraryPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    item: null,
    items: null,
    query: null,
    source: 'library',
  }

  public componentDidMount() {
    this.setSource(this.props)
  }

  public componentWillReceiveProps(nextProps: CombinedProps) {
    this.setSource(nextProps)
  }

  public render() {
    const { source } = this.state
    const { library, project } = this.props

    if (!source || !project) return null

    const librarySource = sources.find(item => item.id === source)

    if (!librarySource) return null

    return (
      <Page project={project}>
        <LibrarySidebar projectID={project._id} sources={sources} />

        {source === 'library' ? (
          <LibraryContainer
            library={library}
            handleSave={this.handleSave}
            handleDelete={this.handleDelete}
            projectID={project._id}
          />
        ) : (
          <LibrarySourceContainer
            source={librarySource}
            handleAdd={this.handleAdd}
            hasItem={this.hasItem}
          />
        )}
      </Page>
    )
  }

  private setSource(props: CombinedProps) {
    const location = props.location
    const query = qs.parse(location.search.substr(1))
    this.setState({
      source: query.source || 'library',
    })
  }

  private handleAdd = async (data: Partial<BibliographyItem>) => {
    const { projectID } = this.props.match.params

    const item = buildBibliographyItem(data)

    await this.props.models.saveModel<BibliographyItem>(item, {
      projectID,
    })
  }

  private handleSave = (item: BibliographyItem) => {
    const { projectID } = this.props.match.params

    return this.props.models.saveModel<BibliographyItem>(item, {
      projectID,
    })
  }

  private handleDelete = async (item: BibliographyItem): Promise<string> => {
    await this.props.models.deleteModel(item._id)

    this.setState({
      item: null,
    })

    return item._id
  }

  // TODO: move this to source definition
  private hasItem = (item: BibliographyItem): boolean => {
    const items = Array.from(this.props.library.values())

    return items.some(
      (libraryItem: RxDocument<BibliographyItem>) =>
        libraryItem.DOI === item.DOI
    )
  }
}

export default withModels<Props>(LibraryPageContainer)
