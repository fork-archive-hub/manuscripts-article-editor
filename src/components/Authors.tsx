import * as React from 'react'
import { styled } from '../theme'
import { Person } from '../types/person'

export const AuthorsContainer = styled('div')``

export const AuthorContainer = styled('div')`
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.primary};
  }
`

const AuthorImage = styled('img')`
  display: inline-block;
  border-radius: 50%;
  margin-right: 10px;
  width: 40px;
  height: 40px;
  padding: 4px;
`

const AuthorNameParts = styled('div')`
  flex: 1;
  font-size: 20px;
  line-height: 22px;
`
const AuthorName = styled('span')``

const AuthorSurname = styled('span')`
  font-weight: 600;
`

export interface AuthorsProps {
  authors: Person[]
}

export const Author: React.SFC<Person> = ({ id, name, surname, image }) => (
  <AuthorContainer>
    <AuthorImage src={image} />
    <AuthorNameParts>
      <AuthorName>{name.substring(0, 1)}.</AuthorName>{' '}
      <AuthorSurname>{surname}</AuthorSurname>
    </AuthorNameParts>
  </AuthorContainer>
)

export const Authors: React.SFC<AuthorsProps> = ({ authors }) => (
  <AuthorsContainer>
    {authors.map(author => (
      <Author
        key={author.id}
        id={author.id}
        name={author.name}
        surname={author.surname}
        image={author.image}
        affiliations={author.affiliations}
      />
    ))}
  </AuthorsContainer>
)
