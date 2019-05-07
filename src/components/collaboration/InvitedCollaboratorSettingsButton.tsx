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

import SettingsInverted from '@manuscripts/assets/react/SettingsInverted'
import { ProjectInvitation } from '@manuscripts/manuscripts-json-schema'
import { Category, Dialog, IconButton } from '@manuscripts/style-guide'
import { AxiosError } from 'axios'
import * as HttpStatusCodes from 'http-status-codes'
import React from 'react'
import { Manager, Popper, PopperChildrenProps, Reference } from 'react-popper'
import { TokenActions } from '../../data/TokenData'
import { styled } from '../../theme/styled-components'
import InviteCollaboratorPopperContainer from './InviteCollaboratorPopperContainer'

const AddIconButton = styled(IconButton)`
  display: flex;
  height: 24px;
  width: 40px;

  &:focus {
    outline: none;
  }
`

const SettingsInvertedIcon = styled(SettingsInverted)`
  g {
    stroke: ${props => props.theme.colors.icon.primary};
  }
`

interface State {
  isOpen: boolean
  isUpdateRoleOpen: boolean
  error: { data: AxiosError; message: string } | null
  resendSucceed: boolean | null
}

interface Props {
  invitation: ProjectInvitation
  openPopper: (isOpen: boolean) => void
  projectInvite: (
    email: string,
    role: string,
    name?: string,
    message?: string
  ) => Promise<void>
  projectUninvite: (invitationID: string) => Promise<void>
  tokenActions: TokenActions
}

class InvitedCollaboratorSettingsButton extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
    isUpdateRoleOpen: false,
    error: null,
    resendSucceed: null,
  }

  private node: Node

  public componentDidMount() {
    this.updateListener(this.state.isOpen)
  }

  public render() {
    const { isOpen, isUpdateRoleOpen, resendSucceed } = this.state

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <AddIconButton ref={ref} onClick={this.openPopper}>
              <SettingsInvertedIcon />
            </AddIconButton>
          )}
        </Reference>
        {isOpen && (
          <Popper
            placement={'bottom'}
            innerRef={(node: HTMLDivElement) => (this.node = node)}
          >
            {(popperProps: PopperChildrenProps) => (
              <InviteCollaboratorPopperContainer
                invitation={this.props.invitation}
                popperProps={popperProps}
                isUpdateRoleOpen={isUpdateRoleOpen}
                handleOpenModal={this.handleOpenModal}
                handleUpdateRole={this.handleUpdateRole}
                handleUninvite={this.handleUninvite}
                resendInvitation={this.resendInvitation}
                resendSucceed={resendSucceed}
              />
            )}
          </Popper>
        )}
        {this.state.error && (
          <Dialog
            isOpen={true}
            category={Category.error}
            header={this.state.error.message}
            message={
              this.state.error.data.response!.status ===
              HttpStatusCodes.SERVICE_UNAVAILABLE
                ? 'Trouble reaching manuscripts.io servers. Please try again later.'
                : 'An error occurred.'
            }
            actions={{
              primary: {
                action: this.handleCancel,
                title: 'OK',
              },
            }}
          />
        )}
      </Manager>
    )
  }

  private openPopper = () => {
    this.props.openPopper(!this.state.isOpen)
    this.updateListener(!this.state.isOpen)
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  private handleOpenModal = () => {
    this.setState({
      isUpdateRoleOpen: !this.state.isUpdateRoleOpen,
    })
  }

  private handleClickOutside: EventListener = (event: Event) => {
    if (
      this.node &&
      !this.node.contains(event.target as Node) &&
      !this.state.isUpdateRoleOpen
    ) {
      this.openPopper()
    }
  }

  private updateListener = (isOpen: boolean) => {
    if (isOpen) {
      document.addEventListener('mousedown', this.handleClickOutside)
    } else {
      document.removeEventListener('mousedown', this.handleClickOutside)
    }
  }

  private handleUpdateRole = async (role: string) => {
    const {
      invitedUserEmail: email,
      invitedUserName: name,
      message,
    } = this.props.invitation

    const { projectInvite } = this.props

    try {
      await projectInvite(email, role, name, message)
      this.openPopper()
    } catch (error) {
      if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
        this.props.tokenActions.delete()
      } else {
        this.setState({
          error: { data: error, message: 'Failed to update invitation role' },
        })
      }
    }
  }

  private resendInvitation = async () => {
    const {
      invitedUserEmail: email,
      invitedUserName: name,
      message,
      role,
    } = this.props.invitation

    const { projectInvite } = this.props

    try {
      await projectInvite(email, role, name, message)
      this.setState({
        resendSucceed: true,
      })
    } catch (error) {
      if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
        this.props.tokenActions.delete()
      } else {
        this.setState({
          resendSucceed: false,
        })
      }
    }
  }

  private handleUninvite = async () => {
    const { invitation, projectUninvite } = this.props

    try {
      await projectUninvite(invitation._id)
      this.openPopper()
    } catch (error) {
      if (error.response.status === HttpStatusCodes.UNAUTHORIZED) {
        this.props.tokenActions.delete()
      } else {
        this.setState({
          error: { data: error, message: 'Uninvite user failed' },
        })
      }
    }
  }

  private handleCancel = () => {
    this.setState({
      error: null,
    })
  }
}

export default InvitedCollaboratorSettingsButton
