/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'

const hasFilter = (filters: Set<string>, keywordIDs?: string[]) => {
  if (!keywordIDs) {
    return false
  }

  for (const keywordID of keywordIDs) {
    if (filters.has(keywordID)) {
      return true
    }
  }

  return false
}

const titleMatches = (match: string, title?: string) =>
  title && title.toLowerCase().indexOf(match) !== -1

const itemMatches = (
  item: BibliographyItem,
  match?: string,
  filters?: Set<string>
) => {
  if (filters && !hasFilter(filters, item.keywordIDs)) {
    return false
  }

  if (!match) {
    return true
  }

  return titleMatches(match, item.title)
}

const newestFirst = (a: BibliographyItem, b: BibliographyItem) => {
  if (a.createdAt === b.createdAt) {
    return 0
  }

  if (!a.createdAt) {
    return -1
  }

  if (!b.createdAt) {
    return 1
  }

  return b.createdAt - a.createdAt
}

export const filterLibrary = (
  library?: Map<string, BibliographyItem>,
  query?: string,
  filters?: Set<string>
): BibliographyItem[] => {
  if (!library) {
    return []
  }

  if (!query && !filters) {
    const items = Array.from(library.values())
    items.sort(newestFirst)
    return items
  }

  const match = query ? query.toLowerCase() : undefined

  const output: BibliographyItem[] = []

  for (const item of library.values()) {
    if (itemMatches(item, match, filters)) {
      output.push(item)
    }
  }

  output.sort(newestFirst)

  return output
}

export const issuedYear = (item: Partial<BibliographyItem>): string | null => {
  if (
    !item.issued ||
    !item.issued['date-parts'] ||
    !item.issued['date-parts'][0] ||
    !item.issued['date-parts'][0][0]
  ) {
    return null
  }

  const [[year]] = item.issued['date-parts']

  return `(${year}) `
}

const firstAuthorName = (
  item: Partial<BibliographyItem>
): string | null | undefined => {
  if (!item) return null
  if (!item.author) return null
  if (!item.author.length) return null

  const author = item.author[0]

  return author.family || author.literal || author.given
}

const generateItemIdentifier = (item: Partial<BibliographyItem>) =>
  JSON.stringify({
    title: item.title,
    author: firstAuthorName(item),
    year: issuedYear(item),
  })

export const estimateID = (item: Partial<BibliographyItem>): string => {
  if (item.DOI) {
    return item.DOI.toUpperCase()
  }

  return generateItemIdentifier(item)
}

export const shortAuthorsString = (item: Partial<BibliographyItem>) => {
  const authors = (item.author || []).map(
    author => author.family || author.literal || author.given
  )

  if (authors.length > 1) {
    if (authors.length > 3) {
      authors.splice(2, authors.length - 3)
    }

    const lastAuthors = authors.splice(-2)
    authors.push(lastAuthors.join(' & '))
  }

  return authors.join(', ')
}

export const fullAuthorsString = (item: Partial<BibliographyItem>) => {
  const authors = (item.author || []).map(author =>
    [author.given, author.family].join(' ').trim()
  )

  return authors.join(', ')
}
