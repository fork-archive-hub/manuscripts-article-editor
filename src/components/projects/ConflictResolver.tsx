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

import { Model } from '@manuscripts/manuscripts-json-schema'
import {
  ConflictManager,
  constructConflictingTrees,
  getTreeConflicts,
  LocalConflicts,
} from '@manuscripts/sync-client'
import React, { useCallback, useMemo } from 'react'
import SectionConflictModal from './SectionConflictModal'

interface Props {
  conflicts: LocalConflicts | null
  modelMap: Map<string, Model>
  manuscriptTitle?: string
  conflictManager: ConflictManager
  manuscriptID: string
}

const ConflictResolver: React.FC<Props> = ({
  conflicts,
  modelMap,
  manuscriptTitle,
  conflictManager,
  manuscriptID,
}) => {
  if (!conflicts) return null

  const { local, remote } = useMemo(
    () =>
      getTreeConflicts(conflicts).length
        ? constructConflictingTrees(modelMap, conflicts)
        : { local: null, remote: null },
    [conflicts]
  )

  const resolveToRemoteTree = useCallback(() => {
    // it is appropriate to fire-and-forget since failure to remove the local
    // conflicts will just bring up the same modal again.
    /* tslint:disable-next-line:no-floating-promises */
    conflictManager.resolveToRemoteTree(manuscriptID)
  }, [conflictManager, manuscriptID])

  const resolveToLocalTree = useCallback(() => {
    conflictManager
      .resolveToLocalTree(manuscriptID)
      /* tslint:disable-next-line:no-console */
      .catch(console.error)
  }, [conflictManager, manuscriptID])

  if (!local || !remote) return null

  return (
    <SectionConflictModal
      localTree={local}
      remoteTree={remote}
      manuscriptTitle={manuscriptTitle || ''}
      resolveToLocal={resolveToLocalTree}
      resolveToRemote={resolveToRemoteTree}
    />
  )
}

export default ConflictResolver