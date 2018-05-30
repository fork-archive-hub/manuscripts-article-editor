import React from 'react'
import { Contributor } from '../../types/components'
import { Author, AuthorAffiliation } from './Author'
import { EditButton } from './Buttons'

interface Props {
  authors: Contributor[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  startEditing: () => void
}

const Authors: React.SFC<Props> = ({
  authors,
  authorAffiliations,
  startEditing,
}) => (
  <div>
    {authors.map((author, index) => (
      <React.Fragment key={author.id}>
        {!!index && ', '}
        <Author
          author={author}
          affiliations={authorAffiliations.get(author.id)}
        />
      </React.Fragment>
    ))}

    <EditButton onClick={startEditing}>EDIT</EditButton>
  </div>
)

export default Authors