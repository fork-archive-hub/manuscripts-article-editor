import * as React from 'react'
import * as Modal from 'react-modal'
import { ThemedStyledProps } from 'styled-components'
import Close from '../icons/close'
import { styled, Theme } from '../theme'

type DivProps = ThemedStyledProps<React.HTMLProps<HTMLDivElement>, Theme>

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props: DivProps) => props.theme.fontFamily};
  width: 800px;
  max-width: 100%;
  margin: auto;
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
`

export const CloseButton = styled.button`
  width: 45px;
  height: 35px;
  display: inline-block;
  cursor: pointer;
  background: transparent;
  border: none;
`

export const ModalMain = styled.div`
  flex: 1;
  flex-direction: column;
  border-radius: ${(props: DivProps) => props.theme.borderRadius};
  border: 1px solid #d6d6d6;
  box-shadow: 0 10px 20px 0 rgba(107, 134, 164, 0.19);
  background: #fff;
`

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(217, 224, 243, 1)',
    opacity: 0.91,
  },
  content: {
    background: 'transparent',
    border: 'none',
    width: 800,
    maxWidth: '100%',
    padding: 0,
    margin: 'auto',
  },
}

interface SimpleModalProps {
  children: React.ReactNode
  handleClose: () => void
}

export const SimpleModal = ({ children, handleClose }: SimpleModalProps) => (
  <Modal
    isOpen={true}
    onRequestClose={handleClose}
    ariaHideApp={false}
    shouldCloseOnOverlayClick={true}
    style={modalStyle}
  >
    <ModalContainer>
      <ModalHeader>
        <CloseButton onClick={handleClose}>
          <Close size={24} />
        </CloseButton>
      </ModalHeader>
      <ModalMain>{children}</ModalMain>
    </ModalContainer>
  </Modal>
)