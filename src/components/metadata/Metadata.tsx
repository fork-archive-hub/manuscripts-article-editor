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

import ArrowDownBlue from '@manuscripts/assets/react/ArrowDownBlue'
import CloseIconDark from '@manuscripts/assets/react/CloseIconDark'
import {
  Affiliation,
  Contributor,
  Manuscript,
  Model,
  Project,
  ProjectInvitation,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { TitleEditorView, TitleField } from '@manuscripts/title-editor'
import React from 'react'
import { AffiliationMap } from '../../lib/authors'
import { AuthorItem, DropSide } from '../../lib/drag-drop-authors'
import { isOwner } from '../../lib/roles'
import { styled } from '../../theme/styled-components'
import { InvitationValues } from '../collaboration/InvitationForm'
import { CloseButton } from '../SimpleModal'
import { StyledModal, totalTransitionTime } from '../StyledModal'
import { AddAuthorsModalContainer } from './AddAuthorsModalContainer'
import { Affiliations } from './Affiliations'
import { AuthorAffiliation } from './Author'
import { AuthorValues } from './AuthorForm'
import Authors from './Authors'
import AuthorsModalContainer from './AuthorsModalContainer'
import { InviteAuthorsModal } from './AuthorsModals'
import { Header, HeaderContainer } from './Header'

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.fontFamily};
  width: 800px;
  max-width: 100%;
  margin: auto;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 8px;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`

const AuthorsContainer = styled.div`
  margin-top: 16px;
`

const ExpanderButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const StyledTitleField = styled(TitleField)`
  flex: 1;

  & .ProseMirror {
    cursor: text;
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.3;

    &:focus {
      outline: none;
    }

    &.empty-node::before {
      position: absolute;
      color: #ccc;
      cursor: text;
      content: 'Untitled Manuscript';
      pointer-events: none;
    }

    &.empty-node:hover::before {
      color: #999;
    }
  }
`

interface Props {
  modelMap: Map<string, Model>
  saveTitle: (title: string) => void
  manuscript: Manuscript
  authors: Contributor[]
  invitations: ProjectInvitation[]
  authorAffiliations: Map<string, AuthorAffiliation[]>
  affiliations: AffiliationMap
  startEditing: () => void
  editing: boolean
  stopEditing: () => void
  createAuthor: (
    priority: number,
    person?: UserProfile,
    name?: string,
    invitationID?: string
  ) => void
  removeAuthor: (data: Contributor) => Promise<void>
  selectAuthor: (data: Contributor) => void
  selectedAuthor: Contributor | null
  handleSaveAuthor: (values: AuthorValues) => Promise<void>
  createAffiliation: (name: string) => Promise<Affiliation>
  expanded: boolean
  toggleExpanded: () => void
  addingAuthors: boolean
  nonAuthors: UserProfile[]
  numberOfAddedAuthors: number
  addedAuthors: string[]
  project: Project
  user: UserProfile
  isInvite: boolean
  invitationValues: InvitationValues
  invitationSent: boolean
  openAddAuthors: () => void
  handleAddingDoneCancel: () => void
  handleInvite: (searchText: string) => void
  handleInviteCancel: () => void
  handleInvitationSubmit: (values: InvitationValues) => Promise<void>
  handleDrop: (
    source: AuthorItem,
    target: AuthorItem,
    position: DropSide,
    authors: Contributor[]
  ) => void
  updateAuthor: (author: Contributor, email: string) => void
  handleTitleStateChange: (view: TitleEditorView, docChanged: boolean) => void
}

export const Metadata: React.FunctionComponent<Props> = props => (
  <HeaderContainer>
    <Header>
      <TitleContainer>
        <StyledTitleField
          id={'manuscript-title-field'}
          value={props.manuscript.title}
          autoFocus={!props.manuscript.title}
          handleChange={props.saveTitle}
          handleStateChange={props.handleTitleStateChange}
          tabIndex={1}
        />
        <ExpanderButton
          onClick={props.toggleExpanded}
          style={{
            transform: props.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ArrowDownBlue />
        </ExpanderButton>
      </TitleContainer>

      {props.expanded && (
        <AuthorsContainer>
          <Authors
            authors={props.authors}
            authorAffiliations={props.authorAffiliations}
            startEditing={props.startEditing}
            showEditButton={isOwner(props.project, props.user.userID)}
            selectAuthor={props.selectAuthor}
          />

          <Affiliations affiliations={props.affiliations} />
        </AuthorsContainer>
      )}

      <StyledModal
        isOpen={props.editing}
        onRequestClose={props.stopEditing}
        shouldCloseOnOverlayClick={true}
        closeTimeoutMS={totalTransitionTime}
      >
        <ModalContainer>
          <ModalHeader>
            <CloseButton onClick={props.stopEditing}>
              <CloseIconDark />
            </CloseButton>
          </ModalHeader>

          {!props.isInvite &&
            !props.addingAuthors && <AuthorsModalContainer {...props} />}

          {!props.isInvite &&
            props.addingAuthors && <AddAuthorsModalContainer {...props} />}

          {props.isInvite && <InviteAuthorsModal {...props} />}
        </ModalContainer>
      </StyledModal>
    </Header>
  </HeaderContainer>
)
