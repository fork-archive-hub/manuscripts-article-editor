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

import { StyledModal } from '@manuscripts/style-guide'
import React from 'react'

type ModalComponent = React.FunctionComponent<{
  handleClose: CloseModal
}>

type AddModal = (id: string, component: ModalComponent) => void
type CloseModal = () => void

export interface ModalProps {
  addModal: AddModal
}

export const ModalContext = React.createContext<ModalProps>({
  addModal: () => '',
})

export const withModal = <Props extends ModalProps>(
  Component: React.ComponentType<Props>
): React.ComponentType<Omit<Props, keyof ModalProps>> => (props: Props) => (
  <ModalContext.Consumer>
    {value => <Component {...props} {...value} />}
  </ModalContext.Consumer>
)

interface State {
  modals: Array<{ id: string; modal: ModalComponent }>
}

export class ModalProvider extends React.Component<{}, State> {
  private value: ModalProps

  public constructor(props: {}) {
    super(props)

    this.value = {
      addModal: this.addModal,
    }

    this.state = {
      modals: [],
    }
  }

  public render() {
    return (
      <ModalContext.Provider value={this.value}>
        {this.props.children}
        {this.renderModal()}
      </ModalContext.Provider>
    )
  }

  private addModal: AddModal = (id, modal) => {
    this.setState({
      modals: this.state.modals
        .filter(item => item.id !== id)
        .concat({ id, modal }),
    })
  }

  private closeModal = (id: string) => {
    this.setState({
      modals: this.state.modals.filter(modal => modal.id !== id),
    })
  }

  private renderModal = () => {
    return this.state.modals.map(({ id, modal }) => {
      const handleClose = () => this.closeModal(id)

      return (
        <StyledModal key={id} isOpen={true} onRequestClose={handleClose}>
          {modal({ handleClose })}
        </StyledModal>
      )
    })
  }
}
