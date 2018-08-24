import { InvitationData } from '../../src/containers/ProjectsDropdownButton'
import {
  Project,
  ProjectInvitation,
  UserProfile,
} from '../../src/types/components'

const invitations: ProjectInvitation[] = [
  {
    id: 'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
    invitedUserEmail: 'lmessi@atypon.com',
    invitingUserID: 'User|pcoutinho@atypon.com',
    projectID: 'MPProject:2D9BC3CE-D75D-429F-AE8B-3459269785D5',
    projectTitle: 'Breadth First Search Algorithm',
    message: 'message',
    role: 'Writer',
    objectType: 'MPInvitation',
  },
  {
    id: 'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f547',
    invitedUserEmail: 'lmessi@atypon.com',
    invitingUserID: 'User|pcoutinho@atypon.com',
    projectID: 'MPProject:C8C7A84A-0927-4240-B83E-F5290C829BDB',
    message: 'message',
    role: 'Writer',
    objectType: 'MPInvitation',
  },
]

const userProfiles: UserProfile[] = [
  {
    id: 'ID',
    userID: 'User|pcoutinho@atypon.com',
    bibliographicName: {
      _id: '001',
      objectType: 'MPBibliographicName',
      given: 'Lionel',
      family: 'Messi',
    },
    objectType: 'MPUserProfile',
  },
]

const projects: Project[] = [
  {
    id: invitations[0].projectID,
    objectType: 'MPProject',
    owners: [],
    viewers: [],
    writers: [],
    title: invitations[0].projectTitle || 'Untitled Project',
  },
  {
    id: invitations[1].projectID,
    objectType: 'MPProject',
    owners: [],
    viewers: [],
    writers: [],
    title: invitations[1].projectTitle || 'Untitled Project',
  },
]

const invitationsData: InvitationData[] = [
  {
    invitation: invitations[0],
    invitingUserProfile: userProfiles[0],
    project: projects[0],
  },
  {
    invitation: invitations[1],
    invitingUserProfile: userProfiles[0],
    project: projects[1],
  },
]

export default invitationsData