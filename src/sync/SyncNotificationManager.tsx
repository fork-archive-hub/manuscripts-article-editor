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

import { LocationDescriptor } from 'history'
import React, { useCallback, useEffect, useReducer } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import useOnlineState, { OnlineState } from '../hooks/use-online-state'
import CollectionManager from './CollectionManager'
import syncErrors, {
  isPullSyncError,
  isPushSyncError,
  isSyncTimeoutError,
  isUnauthorized,
} from './syncErrors'
import SyncNotification from './SyncNotification'
import { CollectionEvent } from './types'

interface LocationState {
  from: LocationDescriptor
}

interface Props {
  removeNotification: () => void
}

const SyncNotificationManager: React.FC<RouteComponentProps & Props> = ({
  history,
  location,
}) => {
  const [onlineState, setOfflineAcknowledged] = useOnlineState()

  // detect sync errors
  const [state, dispatch] = useReducer(syncErrors, [])
  useEffect(() => {
    CollectionManager.subscribe((event: CollectionEvent) => {
      dispatch({ type: 'event', event })
    })
  }, [])

  // actions:
  const handleLogin = useCallback(() => {
    window.localStorage.removeItem('token')

    const locationDescriptor: LocationDescriptor<LocationState> = {
      pathname: '/login',
      state: {
        from: location,
      },
    }

    history.push(locationDescriptor)
  }, [history, location])

  const handleRetry = useCallback(() => {
    dispatch({ type: 'reset' })
    /* tslint:disable-next-line:no-floating-promises */
    CollectionManager.restartAll()
  }, [])

  // render:
  if (onlineState === OnlineState.Offline) {
    return (
      <SyncNotification
        title="Seems like your network connection just dropped."
        info="Not to worry, you can still keep working on your documents."
        buttonText="Got it"
        buttonAction={setOfflineAcknowledged}
      />
    )
  }

  if (state.find(isUnauthorized)) {
    return (
      <SyncNotification
        title="Please sign in again to sync your changes"
        buttonText="Sign in"
        buttonAction={handleLogin}
      />
    )
  }

  if (onlineState === OnlineState.Acknowledged) return null

  if (state.find(isSyncTimeoutError)) {
    return (
      <SyncNotification
        title="Unable to connect to sync server"
        buttonText="Retry"
        buttonAction={handleRetry}
      />
    )
  }

  if (state.find(isPushSyncError)) {
    return (
      <SyncNotification
        title="Syncing your changes failed"
        buttonText="Retry"
        buttonAction={handleRetry}
      />
    )
  }

  if (state.find(isPullSyncError)) {
    return (
      <SyncNotification
        title="Unable to pull the latest changes"
        buttonText="Retry"
        buttonAction={handleRetry}
      />
    )
  }

  return null
}

export default withRouter(SyncNotificationManager)