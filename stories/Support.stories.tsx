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

import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
import { Support } from '../src/components/Support'

const Container = styled.div`
  height: 300px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`

storiesOf('Support', module).add('Menu', () => (
  <Container>
    <Support />
    <Support />
  </Container>
))
