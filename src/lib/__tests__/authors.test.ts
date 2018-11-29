import {
  AFFILIATION,
  CONTRIBUTOR,
  DEFAULT_BUNDLE,
  MANUSCRIPT,
} from '@manuscripts/manuscript-editor'
import {
  Affiliation,
  Contributor,
  Manuscript,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import {
  buildAffiliationIDs,
  buildAffiliationsMap,
  buildAuthorAffiliations,
  buildAuthorPriority,
  buildAuthorsAndAffiliations,
  buildSortedAuthors,
  isJointFirstAuthor,
} from '../authors'

const modelMap = (models: Model[]): Map<string, Model> => {
  const map = new Map<string, Model>()
  models.forEach(x => map.set(x._id, x))
  return map
}

const affiliation: Affiliation = {
  _id: 'MPAffiliation:X',
  objectType: AFFILIATION,
  institution: 'University of Toronto',
  manuscriptID: 'MPManuscript:X',
  containerID: 'MPProject:1',
  priority: 0,
  sessionID: 'test',
  createdAt: 0,
  updatedAt: 0,
}

const affiliations = [affiliation]

const contribs: Contributor[] = [
  {
    _id: 'MPContributor:x',
    objectType: CONTRIBUTOR,
    priority: 1,
    bibliographicName: {
      _id: 'MPBibliographicName:x-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'MPManuscript:A',
    containerID: 'MPProject:1',
    role: 'author',
    affiliations: affiliations.map(a => a._id),
    sessionID: 'test',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPContributor:y',
    objectType: CONTRIBUTOR,
    priority: 0,
    bibliographicName: {
      _id: 'MPBibliographicName:y-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'manuscript-A',
    containerID: 'MPProject:1',
    isJointContributor: true,
    role: 'author',
    sessionID: 'test',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPContributor:z',
    objectType: CONTRIBUTOR,
    priority: 2,
    bibliographicName: {
      _id: 'MPBibliographicName:z-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'manuscript-A',
    containerID: 'MPProject:1',
    role: 'author',
    sessionID: 'test',
    createdAt: 0,
    updatedAt: 0,
  },
]

const manuscripts: Manuscript[] = [
  {
    _id: 'MPManuscript:x',
    objectType: MANUSCRIPT,
    containerID: 'MPProject:1',
    title: 'Manuscript X',
    bundle: DEFAULT_BUNDLE,
    sessionID: 'test',
    createdAt: 0,
    updatedAt: 0,
  },
]

const objs: Model[] = manuscripts
  // tslint:disable-next-line:no-any
  .concat(contribs as any)
  // tslint:disable-next-line:no-any
  .concat(affiliations as any)

describe('author and affiliation helpers', () => {
  it('buildSortedAuthors', () => {
    // FIXME: buildSortedAuthors should not ignore silently encountering contributors with no "role" or "priority" fields present.
    // tslint:disable-line:no-any
    expect(buildSortedAuthors(modelMap(objs)).map(x => x._id)).toEqual([
      'MPContributor:y',
      'MPContributor:x',
      'MPContributor:z',
    ])
  })

  it('is joint first author', () => {
    // FIXME: isFirstAuthor should not ignore silently encountering unexpected priority values (they should be the very least monotonously growing)

    const authors: Contributor[] = [
      {
        _id: 'MPContributor:author-1',
        objectType: CONTRIBUTOR,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-1',
          objectType: 'MPBibliographicName',
        },
        isJointContributor: true,
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        _id: 'MPContributor:author-2',
        objectType: CONTRIBUTOR,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-2',
          objectType: 'MPBibliographicName',
        },
        isJointContributor: false,
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        _id: 'MPContributor:author-3',
        objectType: CONTRIBUTOR,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-3',
          objectType: 'MPBibliographicName',
        },
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
    ]

    expect(isJointFirstAuthor(authors, 0)).toBe(true)
    expect(isJointFirstAuthor(authors, 1)).toBe(true)
    expect(isJointFirstAuthor(authors, 2)).toBe(false)
  })

  it('is not joint first author', () => {
    const authors: Contributor[] = [
      {
        _id: 'MPContributor:author-1',
        objectType: CONTRIBUTOR,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-1',
          objectType: 'MPBibliographicName',
        },
        isJointContributor: false,
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        _id: 'MPContributor:author-2',
        objectType: CONTRIBUTOR,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-2',
          objectType: 'MPBibliographicName',
        },
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        _id: 'MPContributor:author-3',
        objectType: CONTRIBUTOR,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-3',
          objectType: 'MPBibliographicName',
        },
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
    ]

    expect(isJointFirstAuthor(authors, 0)).toBe(false)
    expect(isJointFirstAuthor(authors, 1)).toBe(false)
    expect(isJointFirstAuthor(authors, 2)).toBe(false)
  })

  it('buildAffiliationsMap', () => {
    const affMap = buildAffiliationsMap(
      affiliations.map(x => x._id),
      modelMap(objs)
    )
    expect(Array.from(affMap)).toEqual([['MPAffiliation:X', affiliations[0]]])
  })

  it('buildAuthorAffiliations', () => {
    const affMap = buildAffiliationsMap(
      affiliations.map(x => x._id),
      modelMap(objs)
    )
    const authorAffMap = buildAuthorAffiliations(
      contribs,
      affMap,
      Array.from(affMap.keys())
    )

    expect(authorAffMap).toEqual(
      new Map(
        Object.entries({
          'MPContributor:x': [{ data: affiliation, ordinal: 1 }],
          'MPContributor:y': [],
          'MPContributor:z': [],
        })
      )
    )
  })

  it('buildAuthorsAndAffiliations', () => {
    const comps = modelMap(objs)
    const map = buildAuthorsAndAffiliations(comps)
    expect(map).toEqual({
      affiliations: new Map(Object.entries({ 'MPAffiliation:X': affiliation })),
      authorAffiliations: new Map(
        Object.entries({
          'MPContributor:y': [],
          'MPContributor:x': [{ data: affiliation, ordinal: 1 }],
          'MPContributor:z': [],
        })
      ),
      authors: buildSortedAuthors(comps),
    })
  })

  it('buildAuthorPriority', () => {
    const authors: Contributor[] = [
      {
        _id: 'MPContributor:author-1',
        objectType: CONTRIBUTOR,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-1',
          objectType: 'MPBibliographicName',
        },
        isJointContributor: false,
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
        priority: 0,
      },
      {
        _id: 'MPContributor:author-2',
        objectType: CONTRIBUTOR,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-2',
          objectType: 'MPBibliographicName',
        },
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
        priority: 1,
      },
    ]

    expect(buildAuthorPriority(authors)).toBe(2)
  })

  it('buildAffiliationIDs', () => {
    expect(buildAffiliationIDs(contribs)).toEqual(['MPAffiliation:X'])
  })
})