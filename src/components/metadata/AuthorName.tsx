import { BibliographicName } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { initials } from '../../lib/name'
import { styled } from '../../theme'

interface Props {
  name: BibliographicName
}

interface NamePartsProps {
  color?: string
}

const NameParts = styled.span`
  line-height: 35px;
  font-size: 18px;
  letter-spacing: -0.3px;
  color: ${(props: NamePartsProps) => props.color || '#353535'};
`

const buildNameLiteral = (name: BibliographicName) =>
  [initials(name), name.family, name.suffix].filter(part => part).join(' ')

export const AuthorName: React.FunctionComponent<Props> = ({ name }) =>
  !name.given && !name.family ? (
    <NameParts color={'#949494'}>Unknown Author</NameParts>
  ) : (
    <NameParts>{buildNameLiteral(name)}</NameParts>
  )