/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { Build, buildKeyword } from '@manuscripts/manuscript-transform'
import {
  Keyword,
  Manuscript,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import { SaveModel } from './ManuscriptInspector'

interface OptionType {
  label: string
  value: Build<Keyword>
}

export const KeywordsInput: React.FC<{
  manuscript: Manuscript
  modelMap: Map<string, Model>
  saveModel: SaveModel
}> = React.memo(({ manuscript, modelMap, saveModel }) => {
  const manuscriptKeywords: Keyword[] = (manuscript.keywordIDs || [])
    .map(id => modelMap.get(id) as Keyword | undefined)
    .filter(Boolean) as Keyword[]

  const manuscriptOptions = manuscriptKeywords.map(keyword => ({
    value: keyword,
    label: keyword.name,
  }))

  return (
    <CreatableSelect<OptionType>
      isMulti={true}
      noOptionsMessage={() => null}
      onChange={async (newValue: OptionsType<OptionType>) => {
        for (const item of newValue) {
          if (!item.value._id) {
            const keyword = buildKeyword((item.value as unknown) as string)

            await saveModel<Keyword>(keyword)

            item.value = keyword
          }
        }

        await saveModel<Manuscript>({
          ...manuscript,
          keywordIDs: newValue.map(item => item.value._id),
        })
      }}
      options={manuscriptOptions}
      value={manuscriptOptions}
    />
  )
})