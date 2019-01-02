import React from 'react'
import { styled } from '../../theme'
import { ManuscriptBlueButton } from '../Button'
import { IndicatorKind, ProgressIndicator } from '../ProgressIndicator'
import { StyledModal, totalTransitionTime } from '../StyledModal'

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: ${props => props.theme.radius}px;
  box-shadow: 0 4px 9px 0 #d8d8d8;
  background: #fff;
`

const ModalMain = styled.div`
  flex: 1;
  padding: 16px 32px;
  max-height: 70vh;
  overflow-y: auto;
  text-align: center;
  display: relative;
`

const ModalStatus = styled.div`
  color: #777;
  font-size: 120%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalFooter = styled.div`
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

interface Props {
  status: string
  canCancel: boolean
  handleCancel: () => void
}

export const ProgressModal: React.FunctionComponent<Props> = ({
  canCancel,
  handleCancel,
  status,
}) => (
  <StyledModal
    isOpen={true}
    onRequestClose={handleCancel}
    shouldCloseOnOverlayClick={false}
    closeTimeoutMS={totalTransitionTime}
  >
    <ModalBody>
      <ModalMain>
        <ProgressIndicator symbols={IndicatorKind.Project} />
        <ModalStatus>{status}</ModalStatus>
      </ModalMain>
      <ModalFooter>
        <ManuscriptBlueButton onClick={handleCancel} disabled={!canCancel}>
          Cancel
        </ManuscriptBlueButton>
      </ModalFooter>
    </ModalBody>
  </StyledModal>
)