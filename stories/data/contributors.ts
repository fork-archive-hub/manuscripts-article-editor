import { Contributor, UserProfile } from '../../src/types/components'

import imageFile from '../assets/melnitz.jpg'

export const affiliations = new Map([
  [
    'affiliation-1',
    {
      id: 'affiliation-1',
      objectType: 'MPAffiliation',
      name: 'Firehouse, Hook & Ladder Company 8',
      address:
        '14 North Moore Street, Tribeca, Manhattan, New York City, New York, USA',
    },
  ],
  [
    'affiliation-2',
    {
      id: 'affiliation-2',
      objectType: 'MPAffiliation',
      name: 'Firehouse, Hook & Ladder Company 9',
      address:
        '15 North Moore Street, Tribeca, Manhattan, New York City, New York, USA',
    },
  ],
])

export const authors: Contributor[] = [
  {
    id: 'example-1',
    objectType: 'MPContributor',
    priority: 1,
    role: 'author',
    bibliographicName: {
      id: 'name-1',
      objectType: 'MPBibliographicName',
      given: 'Janine',
      family: 'Melnitz',
    },
    email: 'janine.melnitz@example.com',
    phoneNumber: '+1 800 555-2368',
    image: imageFile,
    affiliations: ['affiliation-1'],
  },
  {
    id: 'example-2',
    objectType: 'MPContributor',
    priority: 2,
    role: 'author',
    bibliographicName: {
      id: 'name-2',
      objectType: 'MPBibliographicName',
      given: 'Peter',
      family: 'Venkman',
    },
    email: 'peter.venkman@example.com',
    phoneNumber: '+1 800 555-2368',
    image: imageFile,
    affiliations: ['affiliation-1', 'affiliation-2'],
  },
  {
    id: 'example-3',
    objectType: 'MPContributor',
    priority: 3,
    role: 'author',
    bibliographicName: {
      id: 'name-3',
      objectType: 'MPBibliographicName',
      given: 'Dana',
      family: 'Barrett',
    },
    email: 'dana.barrett@example.com',
    phoneNumber: '+1 800 555-2368',
    image: imageFile,
    affiliations: ['affiliation-1'],
  },
]

export const user: UserProfile = {
  id: 'user-1',
  objectType: 'MPUserProfile',
  bibliographicName: {
    id: 'name-1',
    objectType: 'MPBibliographicName',
    given: 'Janine',
    family: 'Melnitz',
  },
  email: 'janine.melnitz@example.com',
  phoneNumber: '+1 800 555-2368',
  image: imageFile,
  affiliations: ['affiliation-1'],
}