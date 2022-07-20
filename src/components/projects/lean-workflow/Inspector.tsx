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

import {
  findParentElement,
  findParentNodeWithIdValue,
  findParentSection,
} from '@manuscripts/manuscript-editor'
import { FileManager, usePermissions } from '@manuscripts/style-guide'
import React from 'react'

import { useCreateEditor } from '../../../hooks/use-create-editor'
import { useRequirementsValidation } from '../../../hooks/use-requirements-validation'
import { useStore } from '../../../store'
import Panel from '../../Panel'
import { RequirementsInspectorView } from '../../requirements/RequirementsInspector'
import { ResizingInspectorButton } from '../../ResizerButtons'
import { TrackChangesPanel } from '../../track-changes/TrackChangesPanel'
import { Inspector as InspectorLW } from '../InspectorLW'
import { ContentTab } from './ContentTab'

interface Props {
  tabs: string[]
  editor: ReturnType<typeof useCreateEditor>
}
const Inspector: React.FC<Props> = ({ tabs, editor }) => {
  const [{ saveModel, modelMap, fileManagement, submissionId }] = useStore(
    (store) => ({
      snapshots: store.snapshots,
      saveModel: store.saveModel,
      modelMap: store.modelMap,
      manuscript: store.manuscript,
      user: store.user,
      project: store.project,
      submissionId: store.submissionID,
      submission: store.submission,
      snapshotID: store.snapshotID,
      commitsSortBy: store.commitsSortBy as string,
      comments: store.comments || [],
      fileManagement: store.fileManagement,
    })
  )

  const { state, dispatch, view } = editor

  const validation = useRequirementsValidation({
    state,
  })
  const selected = findParentNodeWithIdValue(state.selection)
  const can = usePermissions()

  const modelIds = modelMap ? Array.from(modelMap?.keys()) : []

  return (
    <>
      <Panel
        name={'inspector'}
        minSize={400}
        direction={'row'}
        side={'start'}
        hideWhen={'max-width: 900px'}
        resizerButton={ResizingInspectorButton}
        forceOpen={undefined}
      >
        <InspectorLW tabs={tabs} commentTarget={undefined}>
          {tabs.map((label) => {
            switch (label) {
              case 'Content': {
                return (
                  <>
                    <ContentTab
                      selected={selected}
                      selectedElement={findParentElement(
                        state.selection,
                        modelIds
                      )}
                      selectedSection={findParentSection(state.selection)}
                      state={state}
                      dispatch={dispatch}
                      hasFocus={view?.hasFocus()}
                      key="content"
                    />
                  </>
                )
              }

              case 'Quality': {
                return (
                  <RequirementsInspectorView
                    key="quality"
                    result={validation.result}
                    error={validation.error}
                    isBuilding={validation.isBuilding}
                  />
                )
              }

              case 'Track changes': {
                return <TrackChangesPanel key="track-changes" />
              }

              case 'Files': {
                return submissionId ? (
                  <FileManager
                    can={can}
                    enableDragAndDrop={true}
                    modelMap={modelMap}
                    saveModel={saveModel}
                    fileManagement={fileManagement}
                  />
                ) : null
              }
            }
          })}
        </InspectorLW>
      </Panel>
    </>
  )
}

export default Inspector
