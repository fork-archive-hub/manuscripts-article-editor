import React from 'react'
import Modal from 'react-modal'
import { RouteComponentProps, withRouter } from 'react-router'
import Close from '../icons/close'
import { styled, ThemedProps } from '../theme'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props: ThemedDivProps) => props.theme.fontFamily};
  min-width: 400px;
  max-width: 70vw;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
`

const ModalMain = styled.div`
  flex: 1;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 10px 20px 0 rgba(107, 134, 164, 0.19);
  background: #fff;
  border-radius: 8px;
`

const ModalTitle = styled.div`
  font-size: 24px;
  padding: 16px;
`

const ModalBody = styled.div`
  padding: 16px;
`

const CloseButton = styled.button`
  width: 45px;
  height: 35px;
  display: inline-block;
  cursor: pointer;
  background: transparent;
  border: none;
`

export const ModalFormActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#edf2f5',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
  },
  content: {
    background: 'transparent',
    border: 'none',
    position: 'relative',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
}

interface Props {
  title: string | React.ReactNode
}

class ModalForm extends React.Component<Props & RouteComponentProps<{}>> {
  public render() {
    const { title, children } = this.props

    return (
      <Modal
        isOpen={true}
        onRequestClose={this.handleClose}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        style={modalStyle}
      >
        <ModalContainer>
          <ModalHeader>
            <CloseButton onClick={this.handleClose}>
              <Close size={24} />
            </CloseButton>
          </ModalHeader>
          <ModalMain>
            <ModalTitle>{title}</ModalTitle>
            <ModalBody>{children}</ModalBody>
          </ModalMain>
        </ModalContainer>
      </Modal>
    )
  }

  private handleClose = () => this.props.history.push('/')
}

export default withRouter(ModalForm)