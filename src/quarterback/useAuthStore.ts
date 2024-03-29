/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2022 Atypon Systems LLC. All Rights Reserved.
 */
import { Jwt } from '@manuscripts/quarterback-types'
import randomColor from 'randomcolor'
import create from 'zustand'
import { combine, persist } from 'zustand/middleware'

import * as authApi from './api/auth'

const ANONYMOUS_TRACK_USER: TrackUser = {
  id: 'anon',
  name: 'Anonymous',
  color: '#897172',
}
type TrackUser = {
  id: string
  name: string
  color: string
}
interface AuthState {
  user: TrackUser
  jwt?: Jwt
}

export const useAuthStore = create(
  persist(
    combine(
      {
        user: ANONYMOUS_TRACK_USER,
        jwt: undefined,
      } as AuthState,
      (set, get) => ({
        setUser(id?: string, name?: string) {
          set({
            user: {
              id: id || ANONYMOUS_TRACK_USER.id,
              name: name || ANONYMOUS_TRACK_USER.name,
              color: randomColor({
                luminosity: 'dark',
              }),
            },
            jwt: undefined,
          })
          console.log(`set user ${name} with id ${id}`)
        },
        async authenticate() {
          const { user, jwt } = get()
          if (!user) {
            return false
          } else if (jwt) {
            // @TODO check expiration
            return true
          }
          const resp = await authApi.authenticate({
            user, // UserProfile from manuscripts api
            token: 'a', // Should be a token retrieved from manuscripts-api
          })
          if ('data' in resp) {
            set({ jwt: resp.data.jwt })
          }
          return 'data' in resp
        },
        logout() {
          set({ user: ANONYMOUS_TRACK_USER, jwt: undefined })
        },
      })
    ),
    {
      name: 'quarterback-auth-store',
    }
  )
)
