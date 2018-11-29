import SearchIcon from '@manuscripts/assets/react/SearchIcon'
import {
  Build,
  buildBibliographyItem,
  crossref,
} from '@manuscripts/manuscript-editor'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme'
import { Button, PrimaryButton } from '../Button'
import { CitationSearchSection } from './CitationSearchSection'

const Search = styled.input`
  margin: 4px;
  padding: 8px;
  flex: 1;
  font-size: 1em;
  border: none;
  width: 500px;
  -webkit-appearance: none;
  outline: none;
`

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
`

const Results = styled.div`
  max-height: 400px;
  overflow-y: auto;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
`

const Container = styled.div`
  font-family: ${props => props.theme.fontFamily};
`

export interface SearchValues {
  query: string
}

interface Props {
  filterLibraryItems: (query: string | null) => BibliographyItem[]
  handleCite: (
    items: Array<BibliographyItem | Build<BibliographyItem>>,
    query?: string
  ) => Promise<void>
  query: string
  handleCancel: () => void
  scheduleUpdate: () => void
}

interface State {
  selectedSource: string | null
  query: string
  selected: Map<string, Build<BibliographyItem>>
}

export class CitationSearch extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      selectedSource: null,
      query: props.query || '',
      selected: new Map(),
    }
  }

  public render() {
    const { query, selected, selectedSource } = this.state

    const sources = this.buildSources()

    return (
      <Container>
        <SearchContainer>
          <SearchIcon />

          <Search
            autoComplete={'off'}
            autoFocus={true}
            onChange={this.handleQuery}
            placeholder={'Search'}
            type={'search'}
            value={query || ''}
          />
        </SearchContainer>

        <Results>
          {sources.filter(source => source.always || query).map(source => (
            <CitationSearchSection
              key={source.id}
              source={source}
              addToSelection={this.addToSelection}
              selectSource={() => this.setState({ selectedSource: source.id })}
              selected={selected}
              query={query}
              rows={selectedSource === source.id ? 25 : 3}
            />
          ))}
        </Results>

        <Actions>
          <Button onClick={this.props.handleCancel}>Cancel</Button>
          <PrimaryButton
            onClick={this.handleCite}
            disabled={selected.size === 0}
          >
            Cite
          </PrimaryButton>
        </Actions>
      </Container>
    )
  }

  private buildSources = () => {
    return [
      {
        id: 'library',
        title: 'Library',
        search: this.filterLibraryItems,
        always: true,
      },
      {
        id: 'crossref',
        title: 'External sources',
        search: async (
          query: string | null,
          params: { rows: number; sort?: string }
        ) =>
          query
            ? crossref.search(query, params.rows)
            : {
                items: [],
                total: 0,
              },
      },
      // {
      //   id: 'datacite',
      //   title: 'DataCite',
      //   search: async (
      //     query: string | null,
      //     params: { rows: number; sort?: string }
      //   ) =>
      //     query
      //       ? datacite.search(query, params.rows)
      //       : {
      //           items: [],
      //           total: 0,
      //         },
      // },
    ]
  }

  private addToSelection = (id: string, data: Build<BibliographyItem>) => {
    const { selected } = this.state

    if (selected.has(id)) {
      selected.delete(id)
    } else {
      // TODO: move this to Crossref handler?
      // TODO: pick the exact fields

      if (Array.isArray(data.title)) {
        data.title = data.title[0]
      }

      selected.set(id, data._id ? data : buildBibliographyItem(data))
    }

    this.setState({ selected })
  }

  private handleCite = async () => {
    const items = Array.from(this.state.selected.values())
    await this.props.handleCite(items)
  }

  private handleQuery: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const query = event.target.value

    this.setState({ query }, this.props.scheduleUpdate)
  }

  private filterLibraryItems = async (
    query: string | null,
    params: { rows: number; sort?: string }
  ) => {
    const items = this.props.filterLibraryItems(query)

    return {
      items: items.slice(0, params.rows - 1),
      total: items.length,
    }
  }
}