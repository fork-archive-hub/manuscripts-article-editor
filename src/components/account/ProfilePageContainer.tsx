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

import { buildUserProfileAffiliation } from '@manuscripts/manuscript-transform'
import {
  ObjectTypes,
  UserProfile,
  UserProfileAffiliation,
} from '@manuscripts/manuscripts-json-schema'
import { FormikErrors, FormikHelpers } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import config from '../../config'
import UserAffiliationsData from '../../data/UserAffiliationsData'
import UserData from '../../data/UserData'
import { PROFILE_IMAGE_ATTACHMENT } from '../../lib/data'
import { getCurrentUserId } from '../../lib/user'
import { Collection } from '../../sync/Collection'
import { ProfileErrors, ProfileValues } from './ProfileForm'
import { ProfilePageComponent } from './ProfilePage'

const ProfilePage = React.lazy<ProfilePageComponent>(() =>
  import('./ProfilePage')
)

class ProfilePageContainer extends React.Component<RouteComponentProps> {
  public render() {
    return (
      <UserData userID={getCurrentUserId()!}>
        {(user, userCollection) => (
          <UserAffiliationsData profileID={user._id}>
            {(affiliations, affiliationsCollection) => (
              <React.Suspense fallback={null}>
                <ProfilePage
                  userWithAvatar={user}
                  affiliationsMap={affiliations}
                  handleSave={this.handleSave(user, userCollection)}
                  handleChangePassword={this.handleChangePassword}
                  handleDeleteAccount={this.handleDeleteAccount}
                  handleClose={this.handleClose}
                  saveUserProfileAvatar={this.saveUserProfileAvatar(
                    user._id,
                    userCollection
                  )}
                  deleteUserProfileAvatar={this.deleteUserProfileAvatar(
                    user._id,
                    userCollection
                  )}
                  createAffiliation={this.createAffiliation(
                    user._id,
                    affiliationsCollection,
                    userCollection
                  )}
                  updateAffiliation={this.updateAffiliation(
                    affiliationsCollection
                  )}
                  removeAffiliation={this.removeAffiliation(
                    affiliationsCollection
                  )}
                />
              </React.Suspense>
            )}
          </UserAffiliationsData>
        )}
      </UserData>
    )
  }

  private handleSave = (
    user: UserProfile,
    userCollection: Collection<UserProfile>
  ) => async (
    values: ProfileValues,
    { setSubmitting, setErrors }: FormikHelpers<ProfileValues | ProfileErrors>
  ) => {
    userCollection.update(user._id, values).then(
      () => setSubmitting(false),
      error => {
        setSubmitting(false)

        const errors: FormikErrors<ProfileErrors> = {
          submit: error.response
            ? error.response.data.error
            : 'There was an error',
        }

        setErrors(errors)
      }
    )
  }

  private handleChangePassword = () =>
    config.connect.enabled
      ? window.open(`${config.iam.url}/security/password`)
      : this.props.history.push('/change-password')

  private handleDeleteAccount = () => this.props.history.push('/delete-account')

  private handleClose = () => this.props.history.goBack()

  private createAffiliation = (
    userID: string,
    affiliationsCollection: Collection<UserProfileAffiliation>,
    userCollection: Collection<UserProfile>
  ) => async (institution: string) => {
    const userProfileAffiliation = buildUserProfileAffiliation(institution)

    try {
      const user = await userCollection.findDoc(userID)
      await user.atomicUpdate(current => {
        current.affiliations = current.affiliations || []
        current.affiliations.push(userProfileAffiliation._id)
        return current
      })
    } catch (e) {
      /* tslint:disable-next-line:no-console */
      console.error('Failed to create affiliation', e)
    }

    return affiliationsCollection.create(userProfileAffiliation, {
      containerID: userID,
    })
  }

  private updateAffiliation = (
    affiliationsCollection: Collection<UserProfileAffiliation>
  ) => async (data: Partial<UserProfileAffiliation>) => {
    return affiliationsCollection.save({
      ...data,
      objectType: ObjectTypes.UserProfileAffiliation,
    })
  }

  private removeAffiliation = (
    affiliationsCollection: Collection<UserProfileAffiliation>
  ) => async (data: UserProfileAffiliation) => {
    return affiliationsCollection.delete(data._id)
  }

  private saveUserProfileAvatar = (
    id: string,
    userCollection: Collection<UserProfile>
  ) => async (data: Blob) => {
    await userCollection.putAttachment(id, {
      id: PROFILE_IMAGE_ATTACHMENT,
      type: data.type,
      data,
    })
  }

  private deleteUserProfileAvatar = (
    id: string,
    userCollection: Collection<UserProfile>
  ) => async () => {
    const doc = await userCollection.findOne(id).exec()

    if (!doc) {
      throw new Error('Document not found')
    }

    const attachment = doc.getAttachment(PROFILE_IMAGE_ATTACHMENT)

    return attachment.remove()
  }
}

export default ProfilePageContainer
