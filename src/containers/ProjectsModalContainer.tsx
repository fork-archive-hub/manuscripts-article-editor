import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { RxCollection, RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import Spinner from '../icons/spinner'
import {
  buildContributor,
  buildManuscript,
  buildProject,
} from '../lib/commands'
import { ContributorRole } from '../lib/roles'
import sessionID from '../lib/sessionID'
import timestamp from '../lib/timestamp'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { getComponentFromDoc } from '../transformer/decode'
import { PROJECT, USER_PROFILE } from '../transformer/object-types'
import { Attachments, Project, UserProfile } from '../types/components'
import { AddProject } from '../types/project'
import ProjectsSidebar from './ProjectsSidebar'

export interface ProjectInfo extends Partial<Project> {
  collaborators: UserProfile[]
}

interface State {
  projects: ProjectInfo[] | null
  userMap: Map<string, UserProfile>
}

type Props = UserProps & ComponentsProps & RouteComponentProps

class ProjectsModalContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {
    projects: null,
    userMap: new Map(),
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    this.subs.push(this.loadUserMap())
    this.subs.push(this.loadComponents())
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { projects } = this.state
    const { user } = this.props

    if (!user.loaded) {
      return <Spinner />
    }

    if (!projects) {
      return <Spinner />
    }

    return <ProjectsSidebar projects={projects} addProject={this.addProject} />
  }

  private loadComponents = () => {
    const collection = this.getCollection()

    return collection
      .find({ objectType: PROJECT })
      .$.subscribe(async (docs: Array<RxDocument<Project>>) => {
        const getCollaborator = (id: string) => this.state.userMap.get(id)

        const projects: ProjectInfo[] = []

        for (const doc of docs) {
          const component = doc.toJSON()

          const collaborators = [
            ...component.owners.map(getCollaborator),
            ...component.writers.map(getCollaborator),
            ...component.viewers.map(getCollaborator),
          ].filter(collaborator => collaborator) as UserProfile[]

          projects.push({
            id: component.id,
            objectType: component.objectType,
            title: component.title,
            collaborators,
          })
        }

        this.setState({ projects })
      })
  }

  // TODO: move this to a data provider that owns the map of user profiles
  private loadUserMap = () =>
    this.getCollection()
      .find({ objectType: USER_PROFILE })
      .$.subscribe(
        async (docs: Array<RxDocument<UserProfile & Attachments>>) => {
          const users = await Promise.all(
            docs.map(doc => getComponentFromDoc<UserProfile>(doc))
          )

          const userMap = users.reduce((output, user) => {
            output.set(user.userID, user)
            return output
          }, new Map())

          this.setState({ userMap })
        }
      )

  private getCollection() {
    return this.props.components.collection as RxCollection<{}>
  }

  // TODO: catch and handle errors
  private addProject: AddProject = async () => {
    // TODO: open up the template modal

    const user = this.props.user.data as UserProfile

    const owner = user.userID

    const collection = this.getCollection()

    const project = buildProject(owner) as Project

    const now = timestamp()
    project.createdAt = now
    project.updatedAt = now
    project.sessionID = sessionID

    const projectID = project.id

    await collection.insert(project)

    const manuscript = buildManuscript()
    const manuscriptID = manuscript.id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.components.saveComponent(contributor, {
      manuscriptID,
      projectID,
    })

    await this.props.components.saveComponent(manuscript, {
      manuscriptID,
      projectID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }
}

export default withRouter<RouteComponentProps>(
  withComponents(withUser(ProjectsModalContainer))
)