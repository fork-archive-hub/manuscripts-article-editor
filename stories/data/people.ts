import { UserProfile } from '../../src/types/components'

import imageFile from '../assets/melnitz.jpg'

export const people: UserProfile[] = [
  {
    id: 'user-1',
    userID: 'user_1',
    objectType: 'MPUserProfile',
    bibliographicName: {
      _id: 'name-1',
      objectType: 'MPBibliographicName',
      given: 'Janine',
      family: 'Melnitz',
    },
    email: 'janine.melnitz@example.com',
    image: imageFile,
  },
  {
    id: 'user-2',
    userID: 'user_2',
    objectType: 'MPUserProfile',
    bibliographicName: {
      _id: 'name-2',
      objectType: 'MPBibliographicName',
      given: 'Peter',
      family: 'Venkman',
    },
    email: 'peter.venkman@example.com',
    image: null,
  },
  {
    id: 'user-3',
    userID: 'user_3',
    objectType: 'MPUserProfile',
    bibliographicName: {
      _id: 'name-3',
      objectType: 'MPBibliographicName',
      given: 'Egon',
      family: 'Spengler',
    },
    email: 'egon.spengler@example.com',
    image: null,
  },
]