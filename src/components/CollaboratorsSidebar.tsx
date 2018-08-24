import React from 'react'
import AddAuthor from '../icons/add-author'
import { initials } from '../lib/name'
import { styled } from '../theme'
import { Project, ProjectInvitation, UserProfile } from '../types/components'
import { Avatar } from './Avatar'
import CollaboratorSettingsButton from './CollaboratorSettingsButton'
import InvitedCollaboratorSettingsButton from './InvitedCollaboratorSettingsButton'
import Panel from './Panel'
import { Sidebar, SidebarContent, SidebarHeader, SidebarTitle } from './Sidebar'

const CollaboratorContainer = styled.div`
  display: flex;
  margin: 0 -22px;
  padding: 8px 16px;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;

  & :hover {
    background-color: #e0eef9;
  }
`

const CollaboratorInitial = styled.span`
  margin-right: 4px;
  font-weight: 300;
`

const CollaboratorName = styled.div`
  font-size: 120%;
  color: #353535;
  font-weight: 500;
`

const CollaboratorRole = styled.div`
  font-size: 14px;
  color: #949494;
`

const CollaboratorSideBar = styled(Sidebar)`
  background-color: #f8fbfe;
`

const AddCollaboratorButton = styled.button`
  display: flex;
  margin: 8px 0;
  font-size: 14px;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 2px 8px;
`

const AddCollaboratorText = styled.div`
  padding-left: 8px;
  font-weight: 500;
`

const CollaboratorData = styled.div`
  padding-left: 8px;
`
const UserDataContainer = styled.div`
  display: flex;
  align-items: center;
`

const Invited = styled.div`
  display: flex;
  font-size: 12px;
  color: #7fb5d5;
`

const InvitedContainer = styled.div`
  display: flex;
  align-items: center;
`

interface Props {
  project: Project
  collaborators: UserProfile[]
  invitations: ProjectInvitation[]
  user: UserProfile
  isSettingsOpen: boolean
  hoveredID: string
  handleAddCollaborator: () => void
  getUserRole: (
    project: Project,
    userID: string
  ) => 'Owner' | 'Viewer' | 'Writer' | undefined
  handleHover: (ID?: string) => void
  openPopper: (isOpen: boolean) => void
}

const CollaboratorsSidebar: React.SFC<Props> = ({
  project,
  collaborators,
  invitations,
  user,
  handleAddCollaborator,
  getUserRole,
  handleHover,
  hoveredID,
  openPopper,
}) => (
  <Panel
    name={'collaborators-sidebar'}
    direction={'row'}
    side={'end'}
    minSize={200}
  >
    <CollaboratorSideBar>
      <SidebarHeader>
        <SidebarTitle>Collaborators</SidebarTitle>
      </SidebarHeader>

      {getUserRole(project, user.userID) === 'Owner' && (
        <AddCollaboratorButton onClick={handleAddCollaborator}>
          <AddAuthor />
          <AddCollaboratorText>Add new collaborator</AddCollaboratorText>
        </AddCollaboratorButton>
      )}

      <SidebarContent>
        {invitations.map(invitation => (
          <CollaboratorContainer
            key={invitation.id}
            onMouseEnter={() => handleHover(invitation.id)}
            onMouseLeave={() => handleHover()}
          >
            <UserDataContainer>
              <Avatar size={45} color={'#585858'} />
              <CollaboratorData>
                <CollaboratorName>
                  {invitation.invitedUserName || invitation.invitedUserEmail}
                </CollaboratorName>
                <CollaboratorRole>{invitation.role}</CollaboratorRole>
              </CollaboratorData>
            </UserDataContainer>
            <InvitedContainer>
              <Invited>Invited</Invited>
              {hoveredID === invitation.id &&
                getUserRole(project, user.userID) === 'Owner' && (
                  <InvitedCollaboratorSettingsButton
                    invitation={invitation}
                    openPopper={openPopper}
                  />
                )}
            </InvitedContainer>
          </CollaboratorContainer>
        ))}
        {!!collaborators &&
          collaborators.map(collaborator => (
            <CollaboratorContainer
              key={collaborator.id}
              onMouseEnter={() => handleHover(collaborator.userID)}
              onMouseLeave={() => handleHover()}
            >
              <UserDataContainer>
                <Avatar src={collaborator.avatar} size={45} color={'#585858'} />
                <CollaboratorData>
                  {user.userID !== collaborator.userID ? (
                    <CollaboratorName>
                      <CollaboratorInitial>
                        {initials(collaborator.bibliographicName)}
                      </CollaboratorInitial>
                      {collaborator.bibliographicName.family}
                    </CollaboratorName>
                  ) : (
                    <CollaboratorName>You</CollaboratorName>
                  )}
                  <CollaboratorRole>
                    {getUserRole(project, collaborator.userID)}
                  </CollaboratorRole>
                </CollaboratorData>
              </UserDataContainer>
              {hoveredID === collaborator.userID &&
                getUserRole(project, user.userID) === 'Owner' && (
                  <CollaboratorSettingsButton
                    projectID={project.id}
                    collaborator={collaborator}
                    openPopper={openPopper}
                  />
                )}
            </CollaboratorContainer>
          ))}
      </SidebarContent>
    </CollaboratorSideBar>
  </Panel>
)

export default CollaboratorsSidebar