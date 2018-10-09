import React from 'react'
import AttentionError from '../icons/attention-error'
import { styled, ThemedProps } from '../theme'
import { ManuscriptBlueButton, TransparentGreyButton } from './Button'
import { StyledModal, totalTransitionTime } from './StyledModal'

type ThemedDivProps = ThemedProps<HTMLDivElement>

const ButtonContainer = styled.div`
  margin-left: 4px;
`
const Icon = styled.div`
  margin-right: 6px;
  color: #fffceb;
`
const ModalBody = styled.div`
  border-radius: ${(props: ThemedDivProps) => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 #d8d8d8;
  background: #fff;
`

const MessageContainer = styled.div`
  max-width: 297px;
  min-height: 95px;
  font-family: Barlow;
  font-size: 16px;
  color: #949494;
  margin-top: 15px;
  margin-left: 20px;
`
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: Barlow;
  font-size: 16px;
  font-weight: 500;
  padding-left: 20px;
  padding-top: 15px;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
  padding-bottom: 20px;
`

interface DialogProps {
  isOpen: boolean
  actions: {
    primary: {
      action: () => void
      title?: string
    }
    secondary?: {
      action: () => void
      title: string
    }
  }
  category: string
  header: string
  message: string
}

export enum Category {
  error = 'error',
  confirmation = 'confirmation',
}

export const Dialog: React.SFC<DialogProps> = ({
  isOpen,
  actions,
  header,
  message,
  category,
}) => (
  <StyledModal
    isOpen={isOpen}
    onRequestClose={actions.primary.action}
    shouldCloseOnOverlayClick={true}
    closeTimeoutMS={totalTransitionTime}
  >
    <ModalBody>
      <HeaderContainer>
        {category === Category.error && (
          <Icon>
            <AttentionError />
          </Icon>
        )}
        {header}
      </HeaderContainer>
      <MessageContainer>{message}</MessageContainer>
      <ButtonsContainer>
        <ManuscriptBlueButton onClick={actions.primary.action}>
          {actions.primary.title || 'Dismiss'}
        </ManuscriptBlueButton>
        {category === Category.confirmation &&
          actions.secondary && (
            <ButtonContainer>
              <TransparentGreyButton onClick={actions.secondary.action}>
                {actions.secondary.title}
              </TransparentGreyButton>
            </ButtonContainer>
          )}
      </ButtonsContainer>
    </ModalBody>
  </StyledModal>
)