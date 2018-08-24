import React from 'react'
import AddAuthor from '../icons/add-author'
import ContributorDetails from '../icons/contributor-details-placeholder'
import ContributorsPlaceholder from '../icons/contributor-placeholder'
import ContributorSearchPlaceholder from '../icons/contributor-search-placeholder'
import InvitationPlaceholder from '../icons/invitation-placeholder'
import { styled } from '../theme'
import { CollaboratorActions } from '../types/collaborator'
import { Project } from '../types/components'
import {
  AddCollaboratorsMessage,
  AddedCollaboratorsMessage,
  CheckCollaboratorsSearchMessage,
  InviteCollaboratorsMessage,
  SelectCollaboratorMessage,
} from './Messages'

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow-y: auto;
`

const InnerContainer = styled.div`
  text-align: center;
  max-width: 480px;
  font-size: 20px;
  line-height: 28px;
`

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`

const ProjectTitle = styled.div`
  font-size: 18px;
  font-weight: 300;
  padding: 15px 0;
  color: #949494;
`

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  border: none;
  font-size: inherit;
  white-space: nowrap;
`

const ActionButtonText = styled.div`
  font-weight: 500;
  font-size: 26px;
  color: #353535;
`

const Message = styled.div`
  font-size: 21px;
  padding: 15px 0;
  font-weight: 300;
  color: #949494;
`

const AddButtonIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`

interface CollaboratorDetailsPageProps {
  collaboratorsCount: number
  project: Project
}

export const CollaboratorDetailsPage: React.SFC<
  CollaboratorDetailsPageProps & CollaboratorActions
> = ({ collaboratorsCount, handleAddCollaborator, project }) => (
  <OuterContainer>
    <InnerContainer>
      {collaboratorsCount ? (
        <InnerContainer>
          <Placeholder>
            <ContributorDetails size={500} />
          </Placeholder>

          <ProjectTitle>{project.title}</ProjectTitle>

          <Action>Collaborator's Details</Action>

          <Message>
            <SelectCollaboratorMessage />
          </Message>
        </InnerContainer>
      ) : (
        <InnerContainer>
          <Placeholder>
            <ContributorsPlaceholder size={500} />
          </Placeholder>

          <ProjectTitle>{project.title}</ProjectTitle>

          <Action>
            <ActionButton onClick={handleAddCollaborator}>
              <AddButtonIcon>
                <AddAuthor />
              </AddButtonIcon>

              <ActionButtonText>Add Collaborator</ActionButtonText>
            </ActionButton>
          </Action>

          <Message>
            <AddCollaboratorsMessage />
          </Message>
        </InnerContainer>
      )}
    </InnerContainer>
  </OuterContainer>
)

interface AddCollaboratorsPageProps {
  project: Project
  addedCollaboratorsCount: number
}

export const AddCollaboratorsPage: React.SFC<AddCollaboratorsPageProps> = ({
  project,
  addedCollaboratorsCount,
}) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <ContributorsPlaceholder size={500} />
      </Placeholder>

      <ProjectTitle>{project.title}</ProjectTitle>

      {addedCollaboratorsCount ? (
        <React.Fragment>
          <Action>Add Collaborator</Action>

          <Message>
            <AddedCollaboratorsMessage addedCount={addedCollaboratorsCount} />
          </Message>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Message>
            <AddCollaboratorsMessage />
          </Message>
        </React.Fragment>
      )}
    </InnerContainer>
  </OuterContainer>
)

interface InviteCollaboratorsPageProps {
  project: Project
}

export const InviteCollaboratorsPage: React.SFC<
  InviteCollaboratorsPageProps
> = ({ project }) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <InvitationPlaceholder size={500} />
      </Placeholder>

      <ProjectTitle>{project.title}</ProjectTitle>

      <Action>Invite New Collaborator</Action>

      <Message>
        <InviteCollaboratorsMessage />
      </Message>
    </InnerContainer>
  </OuterContainer>
)

interface SearchCollaboratorsPageProps {
  project: Project
  searchText: string
}

export const SearchCollaboratorsPage: React.SFC<
  SearchCollaboratorsPageProps
> = ({ project, searchText }) => (
  <OuterContainer>
    <InnerContainer>
      <Placeholder>
        <ContributorSearchPlaceholder size={500} />
      </Placeholder>

      <ProjectTitle>{project.title}</ProjectTitle>

      <Message>No matches in the People list</Message>

      <Message>
        <CheckCollaboratorsSearchMessage searchText={searchText} />
      </Message>
    </InnerContainer>
  </OuterContainer>
)