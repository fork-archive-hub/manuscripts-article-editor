/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Build,
  buildContributor,
  buildManuscript,
  buildProject,
  buildSection,
  ContainedModel,
  DEFAULT_BUNDLE,
  DEFAULT_PAGE_LAYOUT,
  generateID,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Contributor,
  Manuscript,
  ManuscriptCategory,
  Model,
  ObjectTypes,
  PageLayout,
  ParagraphElement,
  ParagraphStyle,
  Project,
  Section,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog } from '@manuscripts/style-guide'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import config from '../../config'
import { nextManuscriptPriority } from '../../lib/manuscript'
import { ContributorRole } from '../../lib/roles'
import {
  buildCategories,
  buildItems,
  buildManuscriptTitle,
  buildResearchFields,
  buildSectionFromDescription,
  categoriseSectionRequirements,
  chooseBundleID,
  chooseSectionTitle,
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  createMergedTemplate,
  fetchSharedData,
  fromPrototype,
  prepareRequirements,
} from '../../lib/templates'
import { Collection } from '../../sync/Collection'
import {
  ManuscriptTemplate,
  Publisher,
  RequirementType,
  ResearchField,
  SectionCategory,
  TemplateData,
  TemplatesDataType,
} from '../../types/templates'
import { Database, DatabaseContext } from '../DatabaseProvider'
import {
  createProjectCollection,
  importManuscript,
  openProjectsCollection,
} from '../projects/ImportManuscript'
import { TemplateLoadingModal } from './TemplateLoadingModal'
import { TemplateSelectorModal } from './TemplateSelectorModal'

interface Props {
  handleComplete: () => void
  user: UserProfile
  projectID?: string
}

interface State {
  loadingError?: Error
  bundles?: Map<string, Bundle>
  styles?: Map<string, Model>
  manuscriptCategories?: Map<string, ManuscriptCategory>
  sectionCategories?: Map<string, SectionCategory>
  manuscriptTemplates?: Map<string, ManuscriptTemplate>
  publishers?: Map<string, Publisher>
  templatesData?: Map<string, TemplatesDataType>
  researchFields?: Map<string, ResearchField>
}

class TemplateSelector extends React.Component<
  Props & RouteComponentProps,
  State
> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    this.loadData().catch(loadingError => {
      this.setState({ loadingError })
    })
  }

  public render() {
    const {
      bundles,
      loadingError,
      manuscriptCategories,
      manuscriptTemplates,
      publishers,
      researchFields,
      styles,
    } = this.state

    const { history, handleComplete, user, projectID } = this.props

    if (loadingError) {
      return (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Error'}
          message={`There was an error loading the templates. Please contact ${config.support.email} if this persists.`}
          actions={{
            primary: {
              action: this.props.handleComplete,
              title: 'OK',
            },
          }}
        />
      )
    }

    if (
      !manuscriptTemplates ||
      !manuscriptCategories ||
      !bundles ||
      !publishers ||
      !styles ||
      !researchFields
    ) {
      return (
        <TemplateLoadingModal
          handleCancel={this.props.handleComplete}
          status={'Thinking hard…'}
        />
      )
    }

    return (
      <DatabaseContext.Consumer>
        {db => (
          <TemplateSelectorModal
            categories={buildCategories(manuscriptCategories)}
            researchFields={buildResearchFields(researchFields)}
            createEmpty={this.createEmpty(db)}
            importManuscript={importManuscript(
              db,
              history,
              user,
              handleComplete,
              projectID
            )}
            handleComplete={this.props.handleComplete}
            items={buildItems(manuscriptTemplates, bundles, publishers)}
            selectTemplate={this.selectTemplate(db)}
            projectID={this.props.projectID}
          />
        )}
      </DatabaseContext.Consumer>
    )
  }

  private async loadData() {
    // this.setState({ loading: 'categories' })

    const manuscriptCategories = await fetchSharedData<ManuscriptCategory>(
      'manuscript-categories'
    )

    const sectionCategories = await fetchSharedData<SectionCategory>(
      'section-categories'
    )

    // this.setState({ loading: 'publishers' })

    const publishers = await fetchSharedData<Publisher>('publishers')

    // this.setState({ loading: 'fields' })

    const keywords = await fetchSharedData<ResearchField>('keywords')

    const researchFields = new Map<string, ResearchField>()

    for (const item of keywords.values()) {
      if (item.objectType === 'MPResearchField') {
        researchFields.set(item._id, item)
      }
    }

    // this.setState({ loading: 'bundles' })

    const bundles = await fetchSharedData<Bundle>('bundles')

    // this.setState({ loading: 'styles' })

    const styles = await fetchSharedData<Model>('styles')

    // this.setState({ loading: 'templates' })

    const templatesData = await fetchSharedData<TemplatesDataType>(
      'templates-v2'
    )

    const manuscriptTemplates = new Map<string, ManuscriptTemplate>()

    for (const item of templatesData.values()) {
      if (item.objectType === 'MPManuscriptTemplate') {
        manuscriptTemplates.set(item._id, item as ManuscriptTemplate)
      }
    }

    this.setState({
      bundles,
      styles,
      manuscriptCategories,
      sectionCategories,
      manuscriptTemplates,
      publishers,
      templatesData,
      researchFields,
      // loading: undefined,
    })
  }

  // tslint:disable-next-line:cyclomatic-complexity
  private createEmpty = (db: Database) => async () => {
    const {
      handleComplete,
      history,
      user,
      projectID: possibleProjectID,
    } = this.props

    const { bundles, styles } = this.state

    if (!bundles) {
      throw new Error('Bundles not found')
    }

    if (!styles) {
      throw new Error('Styles not found')
    }

    const newProject = possibleProjectID ? null : buildProject(user.userID)

    const projectID = newProject ? newProject._id : possibleProjectID!

    if (newProject) {
      const projectsCollection = openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const collection = await createProjectCollection(db, projectID)

    const priority = await nextManuscriptPriority(collection as Collection<
      Manuscript
    >)

    const newBundle = this.createNewBundle(DEFAULT_BUNDLE, bundles)

    const newStyles = this.createNewStyles(styles)

    const newPageLayout = this.updatedPageLayout(newStyles)

    // const colorScheme = this.findDefaultColorScheme(newStyles)

    const manuscript = {
      ...buildManuscript(undefined),
      bundle: newBundle._id,
      pageLayout: newPageLayout._id,
      // colorScheme: colorScheme ? colorScheme._id : DEFAULT_COLOR_SCHEME,
      priority,
    }

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    const saveContainedModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
      })

    const saveManuscriptModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
        manuscriptID: manuscript._id,
      })

    await saveContainedModel<Bundle>(newBundle)

    await this.attachStyle(newBundle, collection)

    for (const newStyle of newStyles.values()) {
      await saveManuscriptModel<Model>(newStyle)
    }

    await saveManuscriptModel<Contributor>(contributor)

    const paragraph = createEmptyParagraph(newPageLayout)

    await saveManuscriptModel<ParagraphElement>(paragraph)

    await saveManuscriptModel<Section>({
      ...buildSection(),
      elementIDs: [paragraph._id],
    })

    await saveContainedModel<Manuscript>(manuscript)

    history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)

    handleComplete()
  }

  private buildNewProject = (): Build<Project> | undefined => {
    const { projectID, user } = this.props

    return projectID ? undefined : buildProject(user.userID)
  }

  private getByPrototype = <T extends Model>(
    prototype: string,
    modelMap: Map<string, Model>
  ): T | undefined => {
    for (const model of modelMap.values()) {
      if (model.prototype === prototype) {
        return model as T
      }
    }
  }

  private updatedPageLayout = (newStyles: Map<string, Model>) => {
    const newPageLayout = this.getByPrototype<PageLayout>(
      DEFAULT_PAGE_LAYOUT,
      newStyles
    )

    if (!newPageLayout) {
      throw new Error('Default page layout not found')
    }

    const newDefaultParagraphStyle = this.getByPrototype<ParagraphStyle>(
      newPageLayout.defaultParagraphStyle,
      newStyles
    )

    if (!newDefaultParagraphStyle) {
      throw new Error('Default paragraph style not found')
    }

    newPageLayout.defaultParagraphStyle = newDefaultParagraphStyle._id

    // newStyles.set(newPageLayout._id, newPageLayout)

    return newPageLayout
  }

  private createNewStyles = (styles: Map<string, Model>) => {
    const newStyles = new Map<string, Model>()

    const prototypeMap = new Map<string, string>()

    for (const style of styles.values()) {
      const newStyle = fromPrototype(style)
      newStyles.set(newStyle._id, newStyle)

      prototypeMap.set(newStyle.prototype, newStyle._id)
    }

    // this.fixReferencedStyleIds(newStyles, prototypeMap)

    return newStyles
  }

  // private fixReferencedStyleIds = (
  //   newStyles: Map<string, Model>,
  //   prototypeMap: Map<string, string>
  // ) => {
  //   for (const style of newStyles.values()) {
  //     if (isColorScheme(style)) {
  //       style.colors = (style.colors || [])
  //         .map(id => prototypeMap.get(id))
  //         .filter(Boolean) as Color[]
  //     }
  //   }
  // }

  // private findDefaultColorScheme = (newStyles: Map<string, Model>) => {
  //   for (const style of newStyles.values()) {
  //     if (isColorScheme(style)) {
  //       if (style.prototype === DEFAULT_COLOR_SCHEME) {
  //         return style
  //       }
  //     }
  //   }
  // }

  private createNewBundle = (
    bundleID: string,
    bundles: Map<string, Bundle>
  ) => {
    const bundle = bundles.get(bundleID)

    if (!bundle) {
      throw new Error('Bundle not found')
    }

    return fromPrototype(bundle)
  }

  private attachStyle = async (
    newBundle: Bundle,
    collection: Collection<ContainedModel>
  ) => {
    if (newBundle.csl && newBundle.csl.cslIdentifier) {
      const { CitationManager } = await import('@manuscripts/manuscript-editor')

      const citationManager = new CitationManager(config.data.url)
      const cslStyle = await citationManager.fetchCitationStyleString(newBundle)

      await collection.putAttachment(newBundle._id, {
        id: 'csl',
        data: cslStyle,
        type: 'application/vnd.citationstyles.style+xml',
      })
    }
  }

  // tslint:disable:cyclomatic-complexity
  private selectTemplate = (db: Database) => async (item: TemplateData) => {
    const {
      bundles,
      styles,
      templatesData,
      sectionCategories,
      manuscriptTemplates,
    } = this.state

    if (!bundles) {
      throw new Error('Bundles not found')
    }

    if (!styles) {
      throw new Error('Styles not found')
    }

    const { handleComplete, history, user } = this.props

    const title = buildManuscriptTitle(item)

    const newProject = this.buildNewProject()

    if (newProject) {
      const projectsCollection = openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const projectID: string = newProject
      ? newProject._id
      : this.props.projectID!

    const newBundle = this.createNewBundle(
      chooseBundleID(item.template),
      bundles
    )

    const collection = await createProjectCollection(db, projectID)

    let priority = await nextManuscriptPriority(collection as Collection<
      Manuscript
    >)

    const newStyles = this.createNewStyles(styles)

    const newPageLayout = this.updatedPageLayout(newStyles)

    // const colorScheme = this.findDefaultColorScheme(newStyles)

    const manuscript: Build<Manuscript> = {
      ...buildManuscript(title),
      bundle: newBundle._id,
      pageLayout: newPageLayout._id,
      priority: priority++,
      // colorScheme: colorScheme ? colorScheme._id : DEFAULT_COLOR_SCHEME,
    }

    const saveContainedModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
      })

    const saveManuscriptModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
        manuscriptID: manuscript._id,
      })

    await saveContainedModel<Bundle>(newBundle)

    await this.attachStyle(newBundle, collection)

    for (const newStyle of newStyles.values()) {
      await saveManuscriptModel<Model>(newStyle)
    }

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await saveManuscriptModel<Contributor>(contributor)

    if (item.template) {
      // merge the templates
      const mergedTemplate = createMergedTemplate(
        item.template,
        manuscriptTemplates
      )

      // save the requirements
      // TODO: build a new requirements object and save it to the template, or re-use the existing one?

      const requirements = prepareRequirements(mergedTemplate, templatesData)

      mergedTemplate.requirementIDs = await Promise.all(
        requirements.map(async requirement => {
          requirement._id = generateID(requirement.objectType as ObjectTypes)
          await saveManuscriptModel<RequirementType>(requirement)
          return requirement._id
        })
      )

      const {
        requiredSections,
        manuscriptSections,
      } = categoriseSectionRequirements(requirements)

      if (requiredSections.length && sectionCategories) {
        const items = createManuscriptSectionsFromTemplate(
          requiredSections,
          sectionCategories
        )

        for (const item of items) {
          await saveManuscriptModel(item)
        }
      } else {
        const paragraph = createEmptyParagraph(newPageLayout)

        await saveManuscriptModel<ParagraphElement>(paragraph)

        await saveManuscriptModel<Section>({
          ...buildSection(),
          elementIDs: [paragraph._id],
        })
      }

      await saveManuscriptModel(mergedTemplate)

      // save any extra manuscripts
      for (const sectionDescription of manuscriptSections) {
        const sectionCategory = sectionCategories!.get(
          sectionDescription.sectionCategory
        )

        const manuscriptTitle = chooseSectionTitle(
          sectionDescription,
          sectionCategory
        )

        const extraManuscript = buildManuscript(manuscriptTitle)

        const containerIDs = {
          containerID: projectID,
          manuscriptID: extraManuscript._id,
        }

        const { section, dependencies } = buildSectionFromDescription(
          sectionDescription,
          1,
          sectionCategory
        )

        for (const dependency of dependencies) {
          await collection.save(dependency, containerIDs)
        }

        await collection.save(section, containerIDs)

        await saveContainedModel<Manuscript>({
          ...extraManuscript,
          bundle: newBundle._id,
          priority: priority++,
        })
      }
    }

    // save the manuscript
    await saveContainedModel<Manuscript>(manuscript)

    // NOTE: not saving the shared data to the project

    history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)

    handleComplete()
  }
}

export default withRouter(TemplateSelector)
