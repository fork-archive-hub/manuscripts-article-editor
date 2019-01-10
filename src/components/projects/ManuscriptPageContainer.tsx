import {
  ApplicationMenu,
  applyLocalStep,
  applyRemoteStep,
  Build,
  buildContributor,
  buildKeyword,
  buildManuscript,
  buildModelMap,
  ChangeReceiver,
  CitationManager,
  CommentAnnotation,
  Conflict,
  conflictsKey,
  ContainedModel,
  ContainedProps,
  createMerge,
  Decoder,
  DEFAULT_BUNDLE,
  documentObjectTypes,
  Editor,
  elementObjects,
  encode,
  findParentNodeWithIdValue,
  generateID,
  getImageAttachment,
  getRevNumber,
  hydrateConflictNodes,
  isFigure,
  isManuscriptModel,
  isUserProfile,
  iterateConflicts,
  LocalConflicts,
  ManuscriptEditorState,
  ManuscriptEditorView,
  ManuscriptModel,
  ManuscriptNode,
  menus,
  ModelAttachment,
  PopperManager,
  removeConflictLocally,
  Selected,
  SYNC_ERROR_LOCAL_DOC_ID,
  SyncErrors,
  syncErrorsKey,
  Toolbar,
  toolbar,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-editor'
import '@manuscripts/manuscript-editor/styles/Editor.css'
import '@manuscripts/manuscript-editor/styles/popper.css'
import {
  BibliographyItem,
  Keyword,
  Manuscript,
  Model,
  ObjectTypes,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import debounce from 'lodash-es/debounce'
import React from 'react'
import ReactDOM from 'react-dom'
import { Prompt, RouteComponentProps } from 'react-router'
import { RxCollection } from 'rxdb'
import { Subscription } from 'rxjs/Subscription'
import config from '../../config'
import Spinner from '../../icons/spinner'
import { filterLibrary } from '../../lib/library'
import { ContributorRole } from '../../lib/roles'
import sessionID from '../../lib/sessionID'
// import { newestFirst, oldestFirst } from '../../lib/sort'
import { ModelObject } from '../../store/DataProvider'
import IntlProvider, { IntlProps, withIntl } from '../../store/IntlProvider'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { ThemeProvider } from '../../theme'
import { DebouncedInspector } from '../Inspector'
import CitationEditor from '../library/CitationEditor'
import MetadataContainer from '../metadata/MetadataContainer'
import { ModalProps, withModal } from '../ModalProvider'
import { Main, Page } from '../Page'
import Panel from '../Panel'
import { TemplateSelector } from '../templates/TemplateSelector'
import { CommentList } from './CommentList'
import { EditorBody, EditorContainer, EditorHeader } from './EditorContainer'
import { Exporter } from './Exporter'
import { Importer } from './Importer'
import ManuscriptSidebar from './ManuscriptSidebar'
import { ReloadDialog } from './ReloadDialog'
import RenameProject from './RenameProject'

interface State {
  modelIds: {
    [key: string]: Set<string>
  }
  modelMap: Map<string, Model>
  conflicts: LocalConflicts | null
  dirty: boolean
  doc: ManuscriptNode | null
  error: string | null
  manuscript: Manuscript
  popper: PopperManager
  selected: Selected | null
  view: ManuscriptEditorView | null
  processor: Citeproc.Processor | null
}

interface Props {
  comments: CommentAnnotation[]
  keywords: Map<string, Keyword>
  library: Map<string, BibliographyItem>
  manuscripts: Manuscript[]
  manuscript: Manuscript
  project: Project
  user: UserProfileWithAvatar
  users: Map<string, UserProfileWithAvatar>
}

interface RouteParams {
  projectID: string
  manuscriptID: string
}

type CombinedProps = Props &
  ModelsProps &
  RouteComponentProps<RouteParams> &
  IntlProps &
  ModalProps

class ManuscriptPageContainer extends React.Component<CombinedProps, State> {
  private readonly initialState: Readonly<State>

  private subs: Subscription[] = []

  private readonly debouncedSaveModels: (state: ManuscriptEditorState) => void

  public constructor(props: CombinedProps) {
    super(props)

    this.state = {
      manuscript: props.manuscript,
      modelIds: {
        document: new Set(),
        data: new Set(),
      },
      modelMap: new Map(),
      conflicts: null,
      dirty: false,
      doc: null,
      error: null,
      popper: new PopperManager(),
      view: null,
      processor: null,
      selected: null,
    }

    this.initialState = this.state

    this.debouncedSaveModels = debounce(this.saveModels, 1000, {
      maxWait: 5000,
    })
  }

  public async componentDidMount() {
    const { params } = this.props.match

    window.addEventListener('beforeunload', this.unloadListener)

    await this.prepare(params.projectID, params.manuscriptID)
  }

  public componentWillReceiveProps(nextProps: CombinedProps) {
    const { params } = this.props.match
    const { params: nextParams } = nextProps.match

    if (
      params.projectID !== nextParams.projectID ||
      params.manuscriptID !== nextParams.manuscriptID
    ) {
      this.setState(this.initialState, async () => {
        await this.prepare(nextParams.projectID, nextParams.manuscriptID)
      })
    }
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.state.popper.destroy()
    window.removeEventListener('beforeunload', this.unloadListener)
  }

  // tslint:disable:cyclomatic-complexity
  public render() {
    const { projectID } = this.props.match.params

    const {
      dirty,
      modelMap,
      doc,

      popper,
      selected,
      view,
      error,
    } = this.state

    const { comments, manuscripts, manuscript, models, project } = this.props

    if (error) {
      return <ReloadDialog message={error} />
    }

    if (!doc || !manuscript || !project || !comments) {
      return <Spinner />
    }

    const locale = this.getLocale(manuscript)

    const attributes = {
      class: 'manuscript-editor',
      dir: locale === 'ar' ? 'rtl' : 'ltr', // TODO: remove hard-coded locale
      lang: locale,
      spellcheck: 'true',
      tabindex: '2',
    }

    const collection = models.collection as RxCollection<Model>

    return (
      <Page project={project}>
        <ManuscriptSidebar
          openTemplateSelector={this.openTemplateSelector}
          manuscript={manuscript}
          manuscripts={manuscripts}
          project={project}
          doc={doc}
          view={view}
          saveProject={this.saveProject}
          selected={selected}
        />

        <Main>
          <EditorContainer>
            {view &&
              !config.native && (
                <EditorHeader>
                  <ApplicationMenu
                    menus={menus({
                      manuscript,
                      project,
                      addManuscript: this.addManuscript,
                      openTemplateSelector: this.openTemplateSelector,
                      deleteManuscript: this.deleteManuscript,
                      deleteModel: this.deleteModel,
                      history: this.props.history,
                      openExporter: this.openExporter,
                      openImporter: this.openImporter,
                      openRenameProject: this.openRenameProject,
                    })}
                    view={view}
                  />

                  <Toolbar toolbar={toolbar} view={view} />
                </EditorHeader>
              )}

            <EditorBody>
              <MetadataContainer
                modelMap={modelMap}
                saveManuscript={this.saveManuscript}
                manuscript={manuscript}
                saveModel={this.saveModel}
                deleteModel={this.deleteModel}
                handleSectionChange={this.handleSectionChange}
              />

              <Editor
                autoFocus={!!manuscript.title}
                getCitationProcessor={this.getCitationProcessor}
                doc={doc}
                editable={true}
                getModel={this.getModel}
                saveModel={this.saveModel}
                deleteModel={this.deleteModel}
                applyLocalStep={applyLocalStep(collection)}
                applyRemoteStep={applyRemoteStep(collection)}
                addLibraryItem={this.addLibraryItem}
                getLibraryItem={this.getLibraryItem}
                filterLibraryItems={this.filterLibraryItems}
                getManuscript={this.getManuscript}
                saveManuscript={this.saveManuscript}
                deleteManuscript={this.deleteManuscript}
                getCurrentUser={this.getCurrentUser}
                history={this.props.history}
                locale={locale}
                manuscript={manuscript}
                onChange={this.handleChange}
                modelMap={modelMap}
                popper={popper}
                projectID={projectID}
                subscribe={this.handleSubscribe}
                setView={this.setView}
                attributes={attributes}
                handleSectionChange={this.handleSectionChange}
                retrySync={this.retrySync}
                renderReactComponent={this.renderReactComponent}
                CitationEditor={CitationEditor}
              />
            </EditorBody>
          </EditorContainer>

          <Prompt when={dirty} message={() => false} />
        </Main>

        <Panel
          name={'inspector'}
          minSize={200}
          direction={'row'}
          side={'start'}
        >
          {this.state.view &&
            comments && (
              <DebouncedInspector>
                <CommentList
                  comments={comments}
                  doc={doc}
                  getCurrentUser={this.getCurrentUser}
                  selected={selected}
                  createKeyword={this.createKeyword}
                  deleteComment={this.deleteModel}
                  getCollaborator={this.getCollaborator}
                  getKeyword={this.getKeyword}
                  listCollaborators={this.listCollaborators}
                  listKeywords={this.listKeywords}
                  saveComment={this.saveModel}
                />
              </DebouncedInspector>
            )}
        </Panel>
      </Page>
    )
  }

  private prepare = async (projectID: string, manuscriptID: string) => {
    try {
      try {
        await this.createCitationProcessor(this.props.manuscript)
      } catch (error) {
        console.error(error) // tslint:disable-line:no-console
        throw new Error(
          'Failed to open project for editing due to the citation processor failing to start.'
        )
      }

      const models = await this.loadModels(projectID, manuscriptID)

      // console.log(models.map(doc => [doc.objectType, doc.toJSON()]))

      if (!models.length) {
        throw new Error(
          'Failed to open project for editing due to missing data.'
        )
      }

      const modelMap = await buildModelMap(models)

      const decoder = new Decoder(modelMap)

      try {
        const doc = decoder.createArticleNode()
        doc.check()

        // encode again here to get doc model ids for comparison
        const encodedModelMap = encode(doc)
        const modelIds = this.buildManuscriptModelIds(encodedModelMap)

        this.setState({ modelIds, modelMap })

        this.setState({ doc })
      } catch (error) {
        console.error(error) // tslint:disable-line:no-console
        throw new Error(
          'Failed to open project for editing due to an error during data preparation.'
        )
      }
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
      this.setState({
        error: error.message,
      })
    }
  }

  private setView = (view: ManuscriptEditorView) => {
    this.setState({ view })

    this.subscribeToConflicts().catch(err => {
      throw err
    })

    this.subscribeToSyncErrors().catch(err => {
      throw err
    })
  }

  private getOrInsertLocalDocument = async (id: string) => {
    const collection = this.props.models.collection as RxCollection<Model>

    let localDoc = await collection.getLocal(id)

    if (!localDoc) {
      localDoc = await collection.insertLocal(id, {})
    }

    return localDoc
  }

  private subscribeToSyncErrors = async () => {
    const localDoc = await this.getOrInsertLocalDocument(
      SYNC_ERROR_LOCAL_DOC_ID
    )

    localDoc.$.subscribe((syncErrors: SyncErrors) => {
      const { view } = this.state

      if (!view) {
        throw new Error('View not initialized')
      }

      const tr = view.state.tr.setMeta(syncErrorsKey, syncErrors)

      view.dispatch(tr)
    })
  }

  private retrySync = async (componentIDs: string[]) => {
    for (const componentID of componentIDs) {
      const model = this.getModel(componentID)
      if (!model) {
        throw new Error('Unable to find model for retry')
      }
      // TODO: saveModel doesn't run encode, so fixes to encoders won't work
      // TODO: ideally we wouldn't have to "update" the doc to trigger sync
      await this.saveModel(model)
    }
  }

  private subscribeToConflicts = async () => {
    const { manuscriptID } = this.props.match.params

    let loaded = false

    const localDoc = await this.getOrInsertLocalDocument(manuscriptID)

    localDoc.$.subscribe((conflicts: LocalConflicts) => {
      this.setState({ conflicts })

      // when the editor is loaded for the first time, we should check if we
      // have any conflicts to resolve/decorations to create
      if (!loaded) {
        loaded = true

        this.handleConflicts(conflicts).catch(err => {
          throw err
        })
      } else {
        const { view } = this.state

        if (!view) {
          throw new Error('View not initialized')
        }

        const tr = view.state.tr.setMeta(conflictsKey, conflicts)

        view.dispatch(tr)
      }
    })
  }

  private getLocale = (manuscript: Manuscript) =>
    manuscript.primaryLanguageCode || this.props.intl.locale || 'en-GB'

  // FIXME: this shouldn't need a project ID
  private saveProject = async (project: Project) => {
    await this.props.models.saveModel(project, {
      projectID: project._id,
    })
  }

  private getManuscript = () => this.state.manuscript

  private saveManuscript = async (data: Partial<Manuscript>) => {
    const previousManuscript = this.state.manuscript

    const manuscript = {
      ...previousManuscript,
      ...data,
    }

    this.setState({ manuscript })

    await this.saveModel(manuscript)

    if (this.shouldUpdateCitationProcessor(manuscript, previousManuscript)) {
      await this.createCitationProcessor(manuscript)

      this.dispatchUpdate()
    }
  }

  private deleteManuscript = async (id: string) => {
    const { manuscripts, project } = this.props
    const index = manuscripts.findIndex(item => item._id === id)

    const prevManuscript: Manuscript = manuscripts[index === 0 ? 1 : index - 1]

    await this.deleteModel(id)

    if (prevManuscript) {
      this.props.history.push(
        `/projects/${project._id}/manuscripts/${prevManuscript._id}`
      )
    }

    this.props.history.push(`/projects/${project._id}`)
  }

  private shouldUpdateCitationProcessor = (
    manuscript: Manuscript,
    previousManuscript: Manuscript
  ) => {
    return (
      previousManuscript.bundle !== manuscript.bundle ||
      previousManuscript.primaryLanguageCode !== manuscript.primaryLanguageCode
    )
  }

  private dispatchUpdate = () => {
    const { view } = this.state

    if (view) {
      view.dispatch(view.state.tr.setMeta('update', true))
    }
  }

  private addManuscript = async () => {
    const { user } = this.props
    const { projectID } = this.props.match.params

    const manuscript = buildManuscript()
    const manuscriptID = manuscript._id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.models.saveModel(contributor, {
      projectID,
      manuscriptID,
    })

    await this.props.models.saveModel(manuscript, {
      projectID,
      manuscriptID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private openTemplateSelector = () => {
    const { addModal, history, match, models, user } = this.props

    addModal('template-selector', ({ handleClose }) => (
      <TemplateSelector
        history={history}
        projectID={match.params.projectID}
        saveModel={models.saveModel}
        user={user}
        handleComplete={handleClose}
      />
    ))
  }

  private openRenameProject = (project: Project) => {
    const { addModal } = this.props

    addModal('open rename project', ({ handleClose }) => (
      <RenameProject project={project} handleComplete={handleClose} />
    ))
  }

  private openExporter = (format: string) => {
    const { addModal, match } = this.props

    addModal('exporter', ({ handleClose }) => (
      <Exporter
        format={format}
        handleComplete={handleClose}
        modelMap={this.state.modelMap}
        manuscriptID={match.params.manuscriptID}
      />
    ))
  }

  private openImporter = () => {
    const { addModal } = this.props

    addModal('importer', ({ handleClose }) => (
      <Importer
        handleComplete={handleClose}
        importManuscript={this.importManuscript}
      />
    ))
  }

  private importManuscript = async (models: Model[]) => {
    const { projectID } = this.props.match.params

    const manuscriptID = generateID(ObjectTypes.Manuscript)

    for (const model of models) {
      if (model.objectType === ObjectTypes.Manuscript) {
        model._id = manuscriptID
      }

      const { attachment, ...data } = model as Model & ModelAttachment

      const result = await this.props.models.saveModel(data, {
        projectID,
        manuscriptID,
      })

      if (attachment) {
        await this.props.models.putAttachment(result._id, attachment)
      }
    }

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private createCitationProcessor = async (manuscript: Manuscript) => {
    const citationManager = new CitationManager(config.data.url)

    // TODO: move defaults into method?
    const processor = await citationManager.createProcessor(
      manuscript.bundle || DEFAULT_BUNDLE,
      manuscript.primaryLanguageCode || 'en-GB',
      this.getLibraryItem
    )

    this.setState({ processor })
  }

  private getCitationProcessor = () => {
    return this.state.processor as Citeproc.Processor
  }

  private loadModels = (projectID: string, manuscriptID: string) => {
    const collection = this.props.models.collection as RxCollection<
      ContainedModel | ManuscriptModel
    >

    return collection
      .find({
        $and: [
          {
            containerID: projectID,
          },
          {
            $or: [
              {
                manuscriptID,
              },
              {
                manuscriptID: {
                  $exists: false,
                },
              },
            ],
          },
        ],
      })
      .exec()
  }

  private addLibraryItem = (item: BibliographyItem) =>
    this.props.library.set(item._id, item) // TODO: move this to the provider?

  private getLibraryItem = (id: string) => this.props.library.get(id)

  private filterLibraryItems = (query: string) =>
    filterLibrary(this.props.library, query)

  private getModel = <T extends Model>(id: string): T | undefined =>
    this.state.modelMap.get(id) as T | undefined

  private saveModel = async <T extends Model>(model: Build<T>): Promise<T> => {
    const { manuscriptID, projectID } = this.props.match.params
    const { saveModel, putAttachment } = this.props.models

    // TODO: encode?

    if (!model._id) {
      throw new Error('Model ID required')
    }

    const containedModel = model as T & ContainedProps

    // TODO: remove this?
    containedModel.containerID = projectID

    if (containedModel.objectType && isManuscriptModel(containedModel)) {
      containedModel.manuscriptID = manuscriptID
    }

    // NOTE: can't set a partial here
    this.setState({
      modelMap: this.state.modelMap.set(containedModel._id, containedModel),
    })

    const {
      src: _src,
      attachment,
      ...data
    } = containedModel as ContainedModel & ModelAttachment

    // TODO: data.contents = serialized DOM wrapper for bibliography

    const result = await saveModel(data, {
      manuscriptID,
      projectID,
    })

    if (attachment) {
      await putAttachment(result._id, attachment)
    }

    return result as T
  }

  private deleteModel = (id: string) => {
    const { modelMap } = this.state

    modelMap.delete(id)

    this.setState({ modelMap })

    return this.props.models.deleteModel(id)
  }

  // NOTE: can only _return_ the boolean value when using "onbeforeunload"!
  private unloadListener: EventListener = (event: Event) => {
    if (this.state.dirty) {
      event.returnValue = true // can only be set to a boolean
    }
  }

  private isRelevantUpdate = (
    v: Model,
    projectID: string,
    manuscriptID: string,
    sessionID: string
  ) => {
    // ignore changes to local documents
    if (v._id.startsWith('_local/')) {
      return false
    }

    // ignore changes to other projects
    if ((v as ContainedModel).containerID !== projectID) {
      return false
    }

    // ignore changes to other manuscripts
    if (
      (v as ManuscriptModel).manuscriptID &&
      (v as ManuscriptModel).manuscriptID !== manuscriptID
    ) {
      return false
    }

    // only use updates from other sessions
    return v.sessionID !== sessionID
  }

  private conflictForComponent = (componentId: string) => {
    const { conflicts } = this.state

    // If this update is a component which has conflicts
    if (conflicts && componentId in conflicts) {
      const conflictsForNode = Object.values(conflicts[componentId])
      if (conflictsForNode.length > 1) {
        // TODO: what do we do here
        throw new Error('Multiple conflicts for same element')
      }
      return conflictsForNode[0]
    }

    return null
  }

  private handleSubscribe = (receive: ChangeReceiver) => {
    const { projectID, manuscriptID } = this.props.match.params

    const collection = this.props.models.collection as RxCollection<
      ContainedModel | ManuscriptModel
    >

    const sub = collection.$.subscribe(async changeEvent => {
      const op = changeEvent.data.op
      const doc = changeEvent.data.doc
      const v = changeEvent.data.v as Model

      if (!(v && doc && op)) {
        throw new Error('Unexpected change event data')
      }

      console.log({ op, doc, v }) // tslint:disable-line:no-console

      // TODO: only subscribe to changes to this project/manuscript?
      if (!this.isRelevantUpdate(v, projectID, manuscriptID, sessionID)) {
        return false
      }

      if (op === 'REMOVE') {
        return receive(op, doc)
      }

      // NOTE: need to load the doc to get attachments
      const modelDocument = await collection.findOne(doc).exec()

      if (!modelDocument) {
        return null
      }

      const model = modelDocument.toJSON()

      if (isFigure(model)) {
        model.src = await getImageAttachment(modelDocument)
      } else if (isUserProfile(model)) {
        ;(model as UserProfileWithAvatar).avatar = await getImageAttachment(
          modelDocument
        )
      }

      const conflict = this.conflictForComponent(modelDocument._id)

      if (conflict) {
        try {
          const updatedRevNumber = getRevNumber(modelDocument._rev)
          const remoteConflictRevNumber = getRevNumber(conflict.remote._rev)

          // Check to see if the node is either the one we initially conflicted
          // with, or descendant of it.
          if (updatedRevNumber >= remoteConflictRevNumber) {
            // TODO: this following check shouldn't be needed
            // Maybe there's an issue with the sessionID check
            if (modelDocument._rev !== conflict.local._rev) {
              const updatedNode = await this.processConflict(model, conflict)

              receive(op, doc, updatedNode)
              return
            }
          }
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.warn(`Could not resolve conflict for ${model._id}`, e)
        }
      }

      const { modelMap } = this.state

      modelMap.set(model._id, model) // TODO: what if this overlaps with saving?

      this.setState({ modelMap })

      // TODO: only call receive once finished syncing?

      // TODO: might not need a new decoder, for data models

      // TODO: set updatedAt on nodes that depend on data models?

      const decoder = new Decoder(modelMap)

      try {
        const node = decoder.decode(model)

        receive(op, doc, node)
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.warn(e)
      }
    })

    this.subs.push(sub)
  }

  private processConflict = async (component: Model, conflict: Conflict) => {
    const decoder = new Decoder(new Map())

    const { localNode, ancestorNode } = hydrateConflictNodes(
      conflict,
      decoder.decode
    )

    let updatedNode = decoder.decode(component)

    const { merge, tr: transform } = createMerge(
      updatedNode,
      localNode,
      ancestorNode,
      conflict
    )

    if (transform.steps.length) {
      const mergedStep = transform.steps.reduce((acc, step) => {
        const newStep = acc.merge(step)
        if (!newStep) {
          return acc
        } else {
          return newStep
        }
      })

      const result = mergedStep.apply(updatedNode)
      if (result.doc) {
        updatedNode = result.doc
      }
    }

    // if we have a conflict then this will be set
    let updatedConflicts = this.state.conflicts!

    // This removes conflicts that can be (completely) automerged
    // It is possible the user could manually/coincidentally have the same
    // content, so we want to delete even when there were no automerged steps.
    if (merge.conflictingSteps2.length === 0) {
      const collection = this.props.models.collection as RxCollection<Model>

      updatedConflicts = await removeConflictLocally(collection, conflict)
    }

    // send remaining/updated conflict state to editor plugin
    const { view } = this.state

    if (!view) {
      throw new Error('No view initialized')
    }

    const tr = view.state.tr.setMeta(conflictsKey, updatedConflicts)
    view.dispatch(tr)

    return updatedNode
  }

  private removedModelIds = (
    modelIds: Set<string>,
    newModelIds: Set<string>
  ): string[] =>
    Array.from(modelIds).filter(id => {
      return !newModelIds.has(id)
    })

  private keysForComparison = (model: ModelObject) => {
    const excludedKeys = [
      'id',
      '_id',
      '_rev',
      '_revisions',
      'sessionID',
      'createdAt',
      'updatedAt',
      'owners',
      'manuscriptID',
      'containerID',
    ]

    return Object.keys(model).filter(key => !excludedKeys.includes(key))
  }

  private hasChanged = (model: ModelObject): boolean => {
    const previousModel = this.getModel(model._id) as ModelObject

    // TODO: return false if the previous model was a placeholder element?

    if (!previousModel) return true

    const modelKeys = this.keysForComparison(model)
    const previousModelKeys = this.keysForComparison(previousModel)

    // look for different keys
    if (
      modelKeys.length !== new Set([...modelKeys, ...previousModelKeys]).size
    ) {
      return true
    }

    // look for changed values
    for (const key of modelKeys) {
      if (JSON.stringify(model[key]) !== JSON.stringify(previousModel[key])) {
        return true
      }
    }

    return false
  }

  private handleChange = (
    state: ManuscriptEditorState,
    docChanged: boolean
  ) => {
    const selected = findParentNodeWithIdValue(state.selection) || null

    this.setState(prevState => ({
      ...prevState,
      dirty: prevState.dirty || docChanged,
      doc: state.doc,
      selected,
    }))

    if (docChanged) {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => this.debouncedSaveModels(state), {
          timeout: 5000, // maximum wait for idle
        })
      } else {
        this.debouncedSaveModels(state)
      }
    }
  }

  private buildManuscriptModelIds = (modelMap: Map<string, Model>) => {
    const output = {
      document: new Set(),
      data: new Set(),
    }

    for (const model of modelMap.values()) {
      if (isManuscriptModel(model)) {
        const type = documentObjectTypes.includes(model.objectType)
          ? 'document'
          : 'data'

        output[type].add(model._id)
      }
    }

    return output
  }

  private saveModels = async (state: ManuscriptEditorState) => {
    // TODO: return/queue if already saving?
    const { manuscriptID, projectID } = this.props.match.params

    // NOTE: can't use state.toJSON() as the HTML serializer needs the actual nodes

    const encodedModelMap = encode(state.doc)

    const { deleteModel, saveModel } = this.props.models

    try {
      // save the changed doc models
      // TODO: make sure dependencies are saved first

      const { modelMap } = this.state

      const changedModels = []

      for (const model of encodedModelMap.values()) {
        if (this.hasChanged(model)) {
          changedModels.push(model)
          modelMap.set(model._id, model)
        }
      }

      interface ChangedModelsByType {
        dependencies: Model[]
        elements: Model[]
        sections: Model[]
      }

      const changedModelsObject: ChangedModelsByType = {
        dependencies: [],
        elements: [],
        sections: [],
      }

      const changedModelsByType = changedModels.reduce((output, model) => {
        if (model.objectType === ObjectTypes.Section) {
          output.sections.push(model)
        } else if (elementObjects.includes(model.objectType)) {
          output.elements.push(model)
        } else {
          output.dependencies.push(model)
        }

        return output
      }, changedModelsObject)

      await Promise.all(
        changedModelsByType.dependencies.map((model: Model) =>
          saveModel(model, {
            projectID,
            manuscriptID,
          })
        )
      )

      await Promise.all(
        changedModelsByType.elements.map((model: Model) =>
          saveModel(model, {
            projectID,
            manuscriptID,
          })
        )
      )

      await Promise.all(
        changedModelsByType.sections.map((model: Model) =>
          saveModel(model, {
            projectID,
            manuscriptID,
          })
        )
      )

      // delete any removed models, children first

      const modelIds = this.buildManuscriptModelIds(encodedModelMap)

      const deleteRemovedModelIds = async (type: 'document' | 'data') => {
        const removedModelIds = this.removedModelIds(
          this.state.modelIds[type],
          modelIds[type]
        )

        // NOTE: reversed, to remove children first
        await Promise.all(
          removedModelIds.reverse().map(id =>
            deleteModel(id).catch(error => {
              console.error(error) // tslint:disable-line:no-console
            })
          )
        )

        removedModelIds.map(id => {
          modelMap.delete(id)
        })
      }

      await deleteRemovedModelIds('document')
      await deleteRemovedModelIds('data')

      this.setState({
        modelIds,
        modelMap, // NOTE: not using encodedModelMap, to keep removed models
        dirty: false,
        // doc: state.doc,
      })

      console.log('saved') // tslint:disable-line:no-console
    } catch (error) {
      console.error(error) // tslint:disable-line:no-console
    }
  }

  private handleConflicts = async (conflicts: LocalConflicts) => {
    const { view } = this.state

    if (!view) {
      throw new Error('EditorView not initialized')
    }

    const decoder = new Decoder(new Map())

    let tr = view.state.tr

    const conflictsToDelete: Conflict[] = []

    // Iterate conflicts, cleaning up resolved conflicts
    iterateConflicts(
      conflicts,
      view.state.doc,
      decoder.decode,
      (current, local, ancestor, pos, conflict) => {
        const { merge } = createMerge(current, local, ancestor, conflict)

        // This removes conflicts that can be (completely) automerged
        // Automerging is currently turned off, so this will just cases where
        // the remote state matches the local conflict.
        if (merge.conflictingSteps2.length === 0) {
          conflictsToDelete.push(conflict)
        }
        return
      }
    )

    let updatedConflicts = conflicts

    const collection = this.props.models.collection as RxCollection<Model>

    for (const c of conflictsToDelete) {
      updatedConflicts = await removeConflictLocally(collection, c)
    }

    // send remaining/updated conflict state to editor plugin
    tr = tr.setMeta(conflictsKey, updatedConflicts)

    view.dispatch(tr)
  }

  private getCurrentUser = (): UserProfile => this.props.user

  private listCollaborators = () => Array.from(this.props.users.values())

  private getKeyword = (id: string) => this.props.keywords.get(id)

  private listKeywords = () => Array.from(this.props.keywords.values())

  private createKeyword = (name: string) => {
    const keyword = buildKeyword(name)

    return this.saveModel(keyword)
  }

  private getCollaborator = (id: string) => this.props.users.get(id)

  private handleSectionChange = (section: string) => {
    if (section !== 'manuscript') {
      this.setState({ selected: null })
    }
  }

  // TODO: unmount
  private renderReactComponent = (
    child: React.ReactNode,
    container: HTMLElement
  ) => {
    ReactDOM.render(
      <IntlProvider>
        <ThemeProvider>{child}</ThemeProvider>
      </IntlProvider>,
      container
    )
  }
}

export default withModal<Props>(withModels(withIntl(ManuscriptPageContainer)))
