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

import { Statistics } from '@manuscripts/manuscript-editor'
import {
  ActualManuscriptNode,
  SectionNode,
} from '@manuscripts/manuscript-transform'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { InspectorSection, Subheading } from '../InspectorSection'

const InspectorSubsection = styled.div`
  margin-left: 8px;

  :not(:first-child) {
    margin-top: 16px;
  }
`

export const StatisticsInspector: React.FC<{
  manuscriptNode: ActualManuscriptNode
  sectionNode?: SectionNode
}> = ({ manuscriptNode, sectionNode }) => {
  return (
    <InspectorSection title={'Statistics'}>
      <InspectorSubsection>
        <Subheading>Manuscript</Subheading>

        <Statistics node={manuscriptNode} />
      </InspectorSubsection>

      {sectionNode && (
        <InspectorSubsection>
          <Subheading>Section</Subheading>

          <Statistics node={sectionNode} />
        </InspectorSubsection>
      )}
    </InspectorSection>
  )
}