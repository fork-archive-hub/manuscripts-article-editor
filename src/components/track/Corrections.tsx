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

import { EditorHookValue } from '@manuscripts/manuscript-editor'
import {
  ManuscriptSchema,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-transform'
import { Correction as CorrectionT } from '@manuscripts/manuscripts-json-schema'
import {
  commands,
  Commit,
  getTrackPluginState,
} from '@manuscripts/track-changes'
import React, { useCallback } from 'react'
import styled from 'styled-components'

import { Correction } from './Correction'

interface Props {
  corrections: CorrectionT[]
  commits: Commit[]
  editor: EditorHookValue<ManuscriptSchema>
  collaborators: Map<string, UserProfileWithAvatar>
  freeze: () => void
  accept: (correctionID: string) => void
  reject: (correctionID: string) => void
}

export const Corrections: React.FC<Props> = ({
  corrections,
  commits,
  editor,
  freeze,
  collaborators,
  accept,
  reject,
}) => {
  const { commit: currentCommit, focusedCommit } = getTrackPluginState(
    editor.state
  )

  const getCommitFromCorrectionId = useCallback(
    (correctionId: string) => {
      const correction = corrections.find((corr) => corr._id === correctionId)
      if (!correction) {
        return null
      }
      const commit = commits.find(
        (commit) => commit.changeID === correction.commitChangeID
      )
      return commit || null
    },
    [commits, corrections]
  )

  const getCollaboratorById = useCallback(
    (id: string) => collaborators.get(id),
    [collaborators]
  )

  const focusCorrection = (correctionId: string) => {
    const commit = getCommitFromCorrectionId(correctionId)
    if (!commit) {
      return
    }
    editor.doCommand(commands.focusCommit(commit.changeID))
  }

  return (
    <React.Fragment>
      <h3>Information</h3>
      <p>
        <strong>Current Top-Level Commit:</strong> {currentCommit._id}
      </p>

      <button type="button" onClick={freeze}>
        Save
      </button>

      <CorrectionList>
        {corrections.map((corr) => (
          <Correction
            correction={corr}
            isFocused={corr.commitChangeID === focusedCommit}
            getCollaboratorById={getCollaboratorById}
            handleFocus={focusCorrection}
            handleAccept={accept}
            handleReject={reject}
            key={corr._id}
          />
        ))}
      </CorrectionList>
    </React.Fragment>
  )
}

const CorrectionList = styled.ul`
  padding: 0 32px;
  margin: 0;
`