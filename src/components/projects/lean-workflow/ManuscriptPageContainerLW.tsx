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

import '@manuscripts/manuscript-editor/styles/Editor.css'
import '@manuscripts/manuscript-editor/styles/popper.css'
import '@reach/tabs/styles.css'

import {
  findParentElement,
  findParentNodeWithIdValue,
  findParentSection,
  ManuscriptsEditor,
  ManuscriptToolbar,
  PopperManager,
  RequirementsProvider,
  useEditor,
} from '@manuscripts/manuscript-editor'
import {
  ContainedModel,
  isManuscriptModel,
  ManuscriptNode,
  ManuscriptSchema,
} from '@manuscripts/manuscript-transform'
import { Model, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { Commit } from '@manuscripts/track-changes'
import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { RouteComponentProps } from 'react-router'

import config from '../../../config'
import { useBiblio } from '../../../hooks/use-biblio'
import { useCommits } from '../../../hooks/use-commits'
import { createUseLoadable } from '../../../hooks/use-loadable'
import { useManuscriptModels } from '../../../hooks/use-manuscript-models'
import { bootstrap } from '../../../lib/bootstrap-manuscript'
import { ContainerIDs } from '../../../sync/Collection'
import { IntlProps, withIntl } from '../../IntlProvider'
import CitationEditor from '../../library/CitationEditor'
import { CitationViewer } from '../../library/CitationViewer'
import MetadataContainer from '../../metadata/MetadataContainer'
import { ModalProps, withModal } from '../../ModalProvider'
import { Main } from '../../Page'
import Panel from '../../Panel'
import { ManuscriptPlaceholder } from '../../Placeholders'
import { RequirementsInspector } from '../../requirements/RequirementsInspector'
import { ResizingInspectorButton } from '../../ResizerButtons'
import { Corrections } from '../../track/Corrections'
import {
  EditorBody,
  EditorContainer,
  EditorContainerInner,
  EditorHeader,
} from '../EditorContainer'
import { EditorStyles } from '../EditorStyles'
import { Inspector } from '../InspectorLW'
import { ManuscriptPageContainerProps } from '../ManuscriptPageContainer'
import ManuscriptSidebar from '../ManuscriptSidebar'
import { ReloadDialog } from '../ReloadDialog'
import {
  ApplicationMenuContainer,
  ApplicationMenusLW as ApplicationMenus,
} from './ApplicationMenusLW'
import { CommentsTab } from './CommentsTab'
import { ContentTab } from './ContentTab'

interface RouteParams {
  projectID: string
  manuscriptID: string
}

type CombinedProps = ManuscriptPageContainerProps &
  RouteComponentProps<RouteParams> &
  IntlProps &
  ModalProps

const useLoadManuscript = createUseLoadable(bootstrap)

const ManuscriptPageContainer: React.FC<CombinedProps> = (props) => {
  const { project, match } = props

  const { data, isLoading, error } = useLoadManuscript({
    projectID: project._id,
    manuscriptID: match.params.manuscriptID,
  })

  const [commentTarget, setCommentTarget] = useState<string | undefined>()

  if (isLoading) {
    return <ManuscriptPlaceholder />
  } else if (error || !data) {
    return (
      <ReloadDialog
        message={error ? error.message : 'Unable to laod Manuscript'}
      />
    )
  }

  return (
    <ManuscriptPageView
      {...data}
      {...props}
      commentTarget={commentTarget}
      setCommentTarget={setCommentTarget}
    />
  )
}

export interface ManuscriptPageViewProps extends CombinedProps {
  commitAtLoad?: Commit | null
  commits: Commit[]
  doc: ManuscriptNode
  ancestorDoc: ManuscriptNode
  snapshotID: string | null
  modelMap: Map<string, Model>
  setCommentTarget: (commentTarget?: string) => void
  commentTarget?: string
}

const ManuscriptPageView: React.FC<ManuscriptPageViewProps> = (props) => {
  const {
    manuscript,
    project,
    user,
    history,
    doc,
    modelMap,
    snapshotID,
    comments,
    notes,
    setCommentTarget,
    commentTarget,
    tags,
  } = props

  const popper = useRef<PopperManager>(new PopperManager())
  const {
    getModel,
    saveModel,
    saveManuscript,
    deleteModel,
    collection,
    bundle,
  } = useManuscriptModels(modelMap, project._id, manuscript._id)

  const biblio = useBiblio({
    bundle,
    library: props.library,
    collection,
    lang: props.manuscript.primaryLanguageCode || 'en-GB',
  })

  const retrySync = (componentIDs: string[]) => {
    componentIDs.forEach((id) => {
      const model = getModel(id)
      if (!model) {
        return
      }
      saveModel(model)
    })
    return Promise.resolve()
  }

  const editorProps = {
    doc,

    locale: manuscript.primaryLanguageCode || 'en-GB',
    permissions: { write: true },
    environment: config.environment,
    history,
    popper: popper.current,
    projectID: project._id,

    // refactor the library stuff to a hook-ish type thingy
    ...biblio,

    // model and attachment retrieval:
    modelMap,
    getManuscript: () => manuscript,
    getCurrentUser: () => user,
    getModel,
    saveModel,
    deleteModel,
    putAttachment: () => {
      console.log('put attachment')
      return Promise.resolve('attachment id')
    },
    setCommentTarget,
    retrySync,

    renderReactComponent: ReactDOM.render,
    unmountReactComponent: ReactDOM.unmountComponentAtNode,
    components: {
      CitationEditor,
      CitationViewer,
    },
    commit: props.commitAtLoad || null,
  }

  const editor = useEditor<ManuscriptSchema>(
    ManuscriptsEditor.createState(editorProps),
    ManuscriptsEditor.createView(editorProps)
  )
  const { state, onRender, dispatch, view } = editor

  const selected = findParentNodeWithIdValue(state.selection)

  const modelIds = modelMap ? Array.from(modelMap?.keys()) : []

  const listCollaborators = (): UserProfile[] =>
    Array.from(props.collaborators.values())

  const bulkUpdate = async (items: Array<ContainedModel>): Promise<void> => {
    for (const value of items) {
      const containerIDs: ContainerIDs = { containerID: manuscript.containerID }

      if (isManuscriptModel(value)) {
        containerIDs.manuscriptID = manuscript._id
      }

      await collection.save(value, containerIDs, true)
    }
  }

  const { commits, corrections, freeze, accept, reject } = useCommits({
    modelMap,
    initialCommits: props.commits,
    editor,
    containerID: project._id,
    manuscriptID: manuscript._id,
    userProfileID: props.user._id,
    // TODO: we have to have a snapshotID
    snapshotID: snapshotID || '',
    ancestorDoc: props.ancestorDoc,
  })

  return (
    <RequirementsProvider modelMap={modelMap}>
      <ManuscriptSidebar
        project={project}
        manuscript={manuscript}
        view={view}
        doc={doc}
        permissions={editorProps.permissions}
        manuscripts={props.manuscripts}
        user={user}
        tokenActions={props.tokenActions}
        saveModel={saveModel}
        selected={selected || null}
      />
      <Main>
        <EditorContainer>
          <EditorContainerInner>
            <EditorHeader>
              <ApplicationMenuContainer>
                <ApplicationMenus
                  history={props.history}
                  editor={editor}
                  addModal={props.addModal}
                  manuscriptID={manuscript._id}
                  modelMap={modelMap}
                  project={project}
                  collection={collection}
                />
              </ApplicationMenuContainer>
              <ManuscriptToolbar view={view} />
            </EditorHeader>
            <EditorBody>
              <MetadataContainer
                manuscript={manuscript}
                saveManuscript={saveManuscript}
                handleTitleStateChange={() => '' /*FIX THIS*/}
                saveModel={saveModel}
                deleteModel={deleteModel}
                permissions={editorProps.permissions}
                tokenActions={props.tokenActions}
                getAttachment={collection.getAttachmentAsBlob}
                putAttachment={collection.putAttachment}
              />
              <EditorStyles modelMap={modelMap}>
                <div id="editor" ref={onRender}></div>
              </EditorStyles>
            </EditorBody>
          </EditorContainerInner>
        </EditorContainer>
      </Main>
      <Panel
        name={'inspector'}
        minSize={400}
        direction={'row'}
        side={'start'}
        hideWhen={'max-width: 900px'}
        forceOpen={commentTarget !== undefined}
        resizerButton={ResizingInspectorButton}
      >
        <Inspector
          tabs={['Content', 'Comments', 'Quality', 'Changes']}
          commentTarget={commentTarget}
        >
          <ContentTab
            selected={selected}
            selectedElement={findParentElement(state.selection, modelIds)}
            selectedSection={findParentSection(state.selection)}
            getModel={getModel}
            modelMap={modelMap}
            manuscript={manuscript}
            state={state}
            dispatch={dispatch}
            hasFocus={view?.hasFocus()}
            doc={doc}
            saveModel={saveModel}
            deleteModel={deleteModel}
            saveManuscript={saveManuscript}
            listCollaborators={listCollaborators}
            project={project}
            tags={tags}
          />
          <CommentsTab
            comments={comments}
            notes={notes}
            state={state}
            dispatch={dispatch}
            doc={doc}
            user={props.user}
            collaborators={props.collaborators}
            collaboratorsById={props.collaboratorsById}
            keywords={props.keywords}
            saveModel={saveModel}
            deleteModel={deleteModel}
            selected={selected}
            setCommentTarget={setCommentTarget}
            commentTarget={commentTarget}
          />
          <RequirementsInspector
            modelMap={modelMap}
            prototypeId={manuscript.prototype}
            manuscriptID={manuscript._id}
            bulkUpdate={bulkUpdate}
          />
          {snapshotID ? (
            <Corrections
              editor={editor}
              corrections={corrections}
              commits={commits}
              collaborators={props.collaboratorsById}
              freeze={freeze}
              accept={accept}
              reject={reject}
            />
          ) : (
            <h3>Tracking is off - create a Snapshot to get started</h3>
          )}
        </Inspector>
      </Panel>
    </RequirementsProvider>
  )
}

export default withModal(withIntl(ManuscriptPageContainer))