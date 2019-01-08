import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { difference } from 'lodash-es'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { addProjectUser, projectInvite } from '../../lib/api'
import { buildCollaborators } from '../../lib/collaborators'
import { isOwner } from '../../lib/roles'
import { ModelsProps, withModels } from '../../store/ModelsProvider'
import { Main, Page } from '../Page'
import AddCollaboratorsSidebar from './AddCollaboratorsSidebar'
import {
  AddCollaboratorsPage,
  InviteCollaboratorsPage,
  SearchCollaboratorsPage,
} from './CollaboratorsPage'
import { InvitationValues } from './InvitationForm'
import InviteCollaboratorsSidebar from './InviteCollaboratorsSidebar'

interface State {
  project: Project | null
  people: UserProfile[] | null
  collaborators: UserProfile[]
  invitations: ProjectInvitation[]
  isInvite: boolean
  searchText: string
  userMap: Map<string, UserProfile>
  addedCollaboratorsCount: number
  addedUsers: string[]
  invitationSent: boolean
}

interface Props {
  invitations: ProjectInvitation[]
  project: Project
  projects: Project[]
  user: UserProfileWithAvatar
  users: Map<string, UserProfileWithAvatar>
}

type CombinedProps = Props &
  ModelsProps &
  RouteComponentProps<{
    projectID: string
  }>

class CollaboratorPageContainer extends React.Component<CombinedProps, State> {
  public state: Readonly<State> = {
    project: null,
    people: [],
    collaborators: [],
    invitations: [],
    isInvite: false,
    searchText: '',
    userMap: new Map(),
    addedCollaboratorsCount: 0,
    addedUsers: [],
    invitationSent: false,
  }

  public render() {
    const { isInvite } = this.state
    const { invitations, project, user } = this.props

    if (!isOwner(project, user.userID)) {
      return <Redirect to={`/projects/${project._id}/collaborators`} />
    }

    if (isInvite) {
      return this.renderInviteCollaboratorPage(project)
    }

    const acceptedInvitations = invitations.filter(
      invitation => !invitation.acceptedAt
    )

    const people = this.buildPeople()

    return this.renderAddCollaboratorsPage(project, people, acceptedInvitations)
  }

  private renderInviteCollaboratorPage(project: Project) {
    const { searchText, invitationSent } = this.state

    const isEmail = searchText.includes('@')

    const invitationValues = {
      name: isEmail ? '' : searchText,
      email: isEmail ? searchText : '',
      role: 'Writer',
    }

    return (
      <Page project={project}>
        <InviteCollaboratorsSidebar
          invitationValues={invitationValues}
          handleCancel={this.handleCancel}
          handleSubmit={this.handleInvitationSubmit}
          invitationSent={invitationSent}
        />
        <Main>
          <InviteCollaboratorsPage project={project} />
        </Main>
      </Page>
    )
  }

  private renderAddCollaboratorsPage(
    project: Project,
    people: UserProfile[],
    acceptedInvitations: ProjectInvitation[]
  ) {
    const { addedCollaboratorsCount, searchText, addedUsers } = this.state

    return (
      <Page project={project}>
        <AddCollaboratorsSidebar
          people={people}
          invitations={acceptedInvitations}
          numberOfAddedCollaborators={addedCollaboratorsCount}
          addedUsers={addedUsers}
          addCollaborator={this.addCollaborator}
          countAddedCollaborators={this.countAddedCollaborators}
          handleDoneCancel={this.handleDoneCancel}
          handleInvite={this.handleInvite}
          setSearchText={this.setSearchText}
        />
        <Main>
          {!searchText.length ? (
            <AddCollaboratorsPage
              project={project}
              addedCollaboratorsCount={addedCollaboratorsCount}
            />
          ) : (
            <SearchCollaboratorsPage
              project={project}
              searchText={searchText}
            />
          )}
        </Main>
      </Page>
    )
  }

  private buildPeople = () => {
    const { projectID } = this.props.match.params

    const { project, projects, users } = this.props

    const otherProjects = projects.filter(project => project._id !== projectID)

    const projectCollaborators = buildCollaborators(project, users)

    const collaborators: UserProfile[] = []

    for (const otherProject of otherProjects) {
      const otherCollaborators = buildCollaborators(otherProject, users)

      collaborators.push(...otherCollaborators)
    }

    return difference(collaborators, projectCollaborators)
  }

  private addCollaborator = async (
    userID: string,
    role: string
  ): Promise<void> => {
    const { projectID } = this.props.match.params

    await addProjectUser(projectID, role, userID)

    this.setState({
      addedUsers: this.state.addedUsers.concat(userID),
    })
  }

  private countAddedCollaborators = () => {
    this.setState({
      addedCollaboratorsCount: this.state.addedCollaboratorsCount + 1,
    })
  }

  private handleDoneCancel = () => {
    const { projectID } = this.props.match.params

    this.props.history.push(`/projects/${projectID}/collaborators`)
  }

  private handleInvite = () => {
    this.setState({
      isInvite: true,
    })
  }

  private setSearchText = (searchText: string) => this.setState({ searchText })

  private handleCancel = () => {
    this.setState({
      searchText: '',
      isInvite: false,
    })
    this.setState({ invitationSent: false })
  }

  private handleInvitationSubmit = async (values: InvitationValues) => {
    const { projectID } = this.props.match.params

    const { email, name, role } = values

    await projectInvite(projectID, [{ email, name }], role)
    this.setState({ invitationSent: true })
  }
}

export default withModels<Props>(CollaboratorPageContainer)
