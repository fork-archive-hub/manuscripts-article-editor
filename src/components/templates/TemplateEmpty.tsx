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

import { PrimaryButton } from '@manuscripts/style-guide'
import React from 'react'
import { styled } from '../../theme/styled-components'

const SadAnimal = React.lazy(() => import('./SadAnimal'))

const CreateButtonContainer = styled.div`
  padding: 20px;
`

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  width: 600px;
  max-width: 100%;
`

const TextContainer = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.theme.colors.global.text.primary};
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  text-align: center;
`

interface Props {
  searchText: string
  selectedCategoryName: string
  createEmpty: () => void
}

export const TemplateEmpty: React.FunctionComponent<Props> = ({
  searchText,
  selectedCategoryName,
  createEmpty,
}) => (
  <Container>
    <React.Suspense fallback={'😿'}>
      <SadAnimal />
    </React.Suspense>

    {searchText ? (
      <TextContainer>
        {`No matching template for query '${searchText}'.`}
      </TextContainer>
    ) : (
      <TextContainer>
        {`No manuscript templates yet in the ${selectedCategoryName} category.`}
      </TextContainer>
    )}
    <CreateButtonContainer>
      <PrimaryButton onClick={createEmpty}>
        Create empty manuscript
      </PrimaryButton>
    </CreateButtonContainer>
  </Container>
)
