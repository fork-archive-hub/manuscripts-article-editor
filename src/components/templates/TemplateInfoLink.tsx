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

import { Bundle } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme/styled-components'

const InfoLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.icon.primary};
  margin: 0.5ch;
  line-height: 0;
  text-decoration: none;
`

export const TemplateInfoLink: React.FunctionComponent<{ bundle?: Bundle }> = ({
  bundle,
}) =>
  bundle && bundle.csl && bundle.csl['documentation-URL'] ? (
    <InfoLink href={bundle.csl['documentation-URL']}>ⓘ</InfoLink>
  ) : null
