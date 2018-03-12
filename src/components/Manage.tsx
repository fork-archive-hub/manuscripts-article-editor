import * as React from 'react'
import * as Modal from 'react-modal'
import { ThemedStyledProps } from 'styled-components'
import { styled, Theme } from '../theme'
import { Button, ButtonProps } from './Button'

type DivProps = ThemedStyledProps<React.HTMLProps<HTMLDivElement>, Theme>

type FooterProps = ThemedStyledProps<React.HTMLProps<HTMLElement>, Theme>

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props: DivProps) => props.theme.fontFamily};
  //height: 640px; /* TODO: depends on the screen height? */
  width: 932px; /* TODO: depends on the screen width? */
`

export const ModalHeader = styled.div`
  display: flex;
  font-size: 24px;
  margin-bottom: 20px;
`

export const ModalHeading = styled.div`
  font-weight: 600;
`

export const ModalHeadingSeparator = styled.div`
  font-weight: 200;
  margin: 0 10px;
  display: inline-block;
`

export const ModalSubheading = styled.div`
  font-weight: 200;
`

export const ModalForm = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${(props: DivProps) => props.theme.borderRadius};
  border: 1px solid #d6d6d6;
  box-shadow: 0 10px 20px 0 rgba(107, 134, 164, 0.19);
  background: #fff;
`

export const ModalFormBody = styled.div`
  flex: 1;
  display: flex;
  padding: 20px;
`

export const ModalSidebar = styled.div`
  width: 300px;
  border-right: 1px solid #e6e6e6;
  margin-right: 30px;
`

export const ModalMain = styled.div`
  flex: 1;
`

export const ModalFormHeading = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #acb8c7;
`

export const ModalFormFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  padding: ${(props: FooterProps) => props.theme.padding};
  background-color: ${(props: FooterProps) => props.theme.primary};
  border-bottom-left-radius: ${(props: FooterProps) =>
    props.theme.borderRadius};
  border-bottom-right-radius: ${(props: FooterProps) =>
    props.theme.borderRadius};
`

export const ModalFormFooterText = styled.div`
  flex: 1;
  color: white;
  display: flex;
  align-items: center;
`

export const ModalFormActions = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding: 5px 10px;
`

export const ModalFooterButton = Button.extend`
  color: #fff;
  border-color: transparent;
  background-color: transparent;
  margin: 0 5px;
  cursor: pointer;
  padding: 0 10px;

  &:hover {
    color: #fff;
    border-color: #fff;
    background-color: transparent;
  }
`

export const PrimaryModalFooterButton = ModalFooterButton.extend`
  color: ${(props: ButtonProps) => props.theme.primary};
  border-color: #fff;
  background-color: #fff;

  &:hover {
    color: #fff;
    background-color: transparent;
    border-color: #fff;
  }
`

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    background: 'transparent',
    border: 'none',
  },
}

// tslint:disable:no-any

interface ManageProps {
  sidebar?: React.ReactNode
  main: React.ReactNode
  heading: string
  subheading?: string
  footerText?: string | React.ReactNode
  handleClose?: any // (event: KeyboardEvent) => void
  handleDone: React.MouseEventHandler<HTMLElement>
  handleCancel?: React.MouseEventHandler<HTMLElement>
  isOpen: boolean
}

export const Manage = ({
  sidebar,
  main,
  heading,
  subheading,
  footerText,
  handleClose,
  handleDone,
  handleCancel,
  isOpen,
}: ManageProps) => (
  <Modal isOpen={isOpen} onRequestClose={handleClose} style={modalStyle}>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>{heading}</ModalHeading>
        {subheading && (
          <React.Fragment>
            <ModalHeadingSeparator>/</ModalHeadingSeparator>
            <ModalSubheading>{subheading}</ModalSubheading>
          </React.Fragment>
        )}
      </ModalHeader>
      <ModalForm>
        <ModalFormBody>
          {sidebar && <ModalSidebar>{sidebar}</ModalSidebar>}
          <ModalMain>{main}</ModalMain>
        </ModalFormBody>

        <ModalFormFooter>
          {footerText && (
            <ModalFormFooterText>{footerText}</ModalFormFooterText>
          )}
          <ModalFormActions>
            {handleCancel && (
              <ModalFooterButton onClick={handleCancel}>
                Cancel
              </ModalFooterButton>
            )}
            <PrimaryModalFooterButton onClick={handleDone}>
              Done
            </PrimaryModalFooterButton>
          </ModalFormActions>
        </ModalFormFooter>
      </ModalForm>
    </ModalContainer>
  </Modal>
)