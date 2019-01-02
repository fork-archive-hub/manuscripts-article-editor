import AddIcon from '@manuscripts/assets/react/AddIcon'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { manuscriptsGrey } from '../../colors'
import ProjectPlaceholder from '../../icons/project-placeholder'
import { styled } from '../../theme'
import { Page } from '../Page'

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow-y: auto;
  width: 100%;
  text-align: center;
  font-size: 20px;
  line-height: 28px;
`

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`

const ProjectTitle = styled(Title)`
  font-size: 18px;
  font-weight: 300;
  padding: 15px 0;
  color: #949494;
`

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`

const AddManuscriptButton = styled.button`
  display: flex;
  font-size: 14px;
  font-weight: 500;
  align-items: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 2px 8px;
  letter-spacing: -0.3px;
  color: ${manuscriptsGrey};
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Message = styled.div`
  font-size: 21px;
  padding: 15px 0;
  font-weight: 300;
  color: #949494;
  max-width: 600px;

  @media (max-width: 850px) {
    margin-right: 20px;
    margin-left: 20px;
    max-width: 350px;
  }
`

const ButtonText = styled.span`
  margin-left: 4px;
`

interface Props {
  project: Project
  openTemplateSelector: () => void
}

export const EmptyProjectPage: React.FunctionComponent<Props> = ({
  project,
  openTemplateSelector,
}) => (
  <Page project={project}>
    <OuterContainer>
      <Placeholder>
        <ProjectPlaceholder />
      </Placeholder>

      <ProjectTitle value={project.title || 'Untitled Project'} />

      <Message>
        This project is empty. Create a manuscript to get started.
      </Message>
      <Action>
        <AddManuscriptButton onClick={openTemplateSelector}>
          <AddIcon />
          <ButtonText>New Manuscript</ButtonText>
        </AddManuscriptButton>
      </Action>
    </OuterContainer>
  </Page>
)