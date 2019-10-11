/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import {
  getHighlightTarget,
  getHighlightText,
} from '@manuscripts/manuscript-editor'
import { ManuscriptEditorState } from '@manuscripts/manuscript-transform'
import { CommentAnnotation } from '@manuscripts/manuscripts-json-schema'
import React, { useMemo } from 'react'
import { styled } from '../../theme/styled-components'

const Container = styled.div`
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 4px 8px;
  background-color: #ffe08b;
  margin: 16px;
`

export const HighlightedText: React.FC<{
  comment: CommentAnnotation
  state: ManuscriptEditorState
}> = React.memo(({ comment, state }) => {
  const highlightText = useMemo<string | undefined>(() => {
    const highlight = getHighlightTarget(comment, state)

    return highlight ? getHighlightText(highlight, state) : undefined
  }, [comment, state])

  if (!comment.originalText) {
    return null
  }

  return (
    <Container
      style={{
        // TODO: should change colour only if highlight markers are deleted?
        backgroundColor: highlightText !== undefined ? '#ffe08b' : '#f9020287',
      }}
    >
      {comment.originalText.split('\n').map((item, index) => {
        return <div key={index}>{item}</div>
      })}
    </Container>
  )
})
