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

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { sortedSectionCategories } from '../../lib/section-categories'
import { styled } from '../../theme/styled-components'

export const CategoryInput: React.FC<{
  value: string
  handleChange: (category: string) => void
}> = ({ value, handleChange }) => {
  const [category, setCategory] = useState<string>(value)

  useEffect(() => {
    setCategory(value)
  }, [value])

  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const category = event.target.value
      setCategory(category)
      handleChange(category)
    },
    [handleChange]
  )

  return (
    <CategorySelector value={category} onChange={handleValueChange}>
      {sortedSectionCategories.map(sectionCategory => (
        <option value={sectionCategory._id} key={sectionCategory._id}>
          {sectionCategory.name}
        </option>
      ))}
    </CategorySelector>
  )
}

const CategorySelector = styled.select`
  display: block;
  width: 100%;
`