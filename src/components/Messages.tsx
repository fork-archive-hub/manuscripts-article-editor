import React from 'react'
import { FormattedMessage } from 'react-intl'

export const SignInMessage = () => (
  <FormattedMessage
    id={'sign_in'}
    description={'Title of sign in page'}
    defaultMessage={'Sign in'}
  />
)

export const SignOutMessage = () => (
  <FormattedMessage
    id={'sign_out'}
    description={'Title of sign out page'}
    defaultMessage={'Sign out'}
  />
)

export const ManageProfileMessage = () => (
  <FormattedMessage
    id={'manage_profile'}
    description={'Title of profile management page'}
    defaultMessage={'Details'}
  />
)

export const PreferencesMessage = () => (
  <FormattedMessage
    id={'preferences'}
    description={'Title of preferences page'}
    defaultMessage={'Preferences'}
  />
)

export const ManuscriptsTitleMessage = () => (
  <FormattedMessage
    id={'manuscripts'}
    description={'Title of the manuscripts overview page'}
    defaultMessage={'Manuscripts'}
  />
)

export const EmptyManuscriptsMessage = () => (
  <FormattedMessage
    id={'empty_manuscripts'}
    description={'Message shown when the manuscripts list is empty'}
    defaultMessage={'No manuscripts yet.'}
  />
)

export const ImportManuscriptMessage = () => (
  <FormattedMessage
    id={'import_manuscript'}
    description={'Additional message shown when the manuscripts list is empty'}
    defaultMessage={
      'Use the + button to create a new Manuscript or import one from your computer.'
    }
  />
)

export const ChangePasswordMessage = () => (
  <FormattedMessage
    id={'change_password'}
    description={'Title of change password page'}
    defaultMessage={'Change password'}
  />
)

export const DeleteAccountMessage = () => (
  <FormattedMessage
    id={'delete_account'}
    description={'Title of delete account page'}
    defaultMessage={'Delete account'}
  />
)

export const SelectCollaboratorMessage = () => (
  <FormattedMessage
    id={'select_collaborator'}
    defaultMessage={
      'Select a collaborator from the list to display their details here.'
    }
  />
)

export const AddCollaboratorsMessage = () => (
  <FormattedMessage
    id={'add_collaborators'}
    defaultMessage={
      'You can add collaborators from the people list or send out invitation mails to those not yet in the list.'
    }
  />
)

export const AddedCollaboratorsMessage: React.FunctionComponent<{
  addedCount: number
}> = ({ addedCount }) => (
  <FormattedMessage
    id={'added_collaborators'}
    defaultMessage={`You added {addedCount, number} {addedCount, plural,
                      one {collaborator}
                      other {collaborators}
                    }`}
    values={{ addedCount }}
  />
)

export const AddAuthorsMessage = () => (
  <FormattedMessage
    id={'add_authors'}
    defaultMessage={
      'Add authors to your author list from your collaborators, or invite new ones'
    }
  />
)
export const SelectAuthorMessage = () => (
  <FormattedMessage
    id={'select_author'}
    defaultMessage={
      'Select an author from the list to display their details here.'
    }
  />
)

export const AddedAuthorsMessage: React.FunctionComponent<{
  addedCount: number
}> = ({ addedCount }) => (
  <FormattedMessage
    id={'added_authors'}
    defaultMessage={`You added {addedCount, number} {addedCount, plural, one {author} other {authors}}`}
    values={{ addedCount }}
  />
)
export const CheckCollaboratorsSearchMessage: React.FunctionComponent<{
  searchText: string
}> = ({ searchText }) => (
  <FormattedMessage
    id={'check_collaborators_search'}
    defaultMessage={`Check that the name or email are correct or invite "{searchText}" to
          join as new Collaborator.`}
    values={{ searchText }}
  />
)

export const InviteCollaboratorsMessage = () => (
  <FormattedMessage
    id={'invite_collaborators'}
    defaultMessage={
      'You can invite collaborators by sending email to the users you want to add.'
    }
  />
)

export const AcceptedInvitationSuccessMessage: React.FunctionComponent = () => (
  <FormattedMessage
    id={'accepted_invitation_success'}
    defaultMessage={
      'An invitation was accepted successfully, you can find the project in the projects list.'
    }
  />
)

export const AcceptedInvitationFailureMessage: React.FunctionComponent = () => (
  <FormattedMessage
    id={'accepted_invitation_failure'}
    defaultMessage={
      'Please sign in with the invited email address to accept this invitation.'
    }
  />
)

export const FeedbackMessage = () => (
  <FormattedMessage
    id={'feedback'}
    description={'Title of feedback page'}
    defaultMessage={'Post Feedback'}
  />
)

export const ProjectRenameMessage = () => (
  <FormattedMessage
    id={'rename_project'}
    description={'Title of rename project form'}
    defaultMessage={'Rename project'}
  />
)
