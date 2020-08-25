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
  Model,
  Section,
  StatusLabel,
  Tag,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { isDueSoon, isOverdue } from '../../lib/date'
import { InspectorSection } from '../InspectorSection'
import { AssigneesInput } from '../projects/AssigneesInput'
import { DeadlineInput } from '../projects/DeadlineInput'
import { StatusInput } from '../projects/Status'
import { TagsInput } from '../projects/TagsInput'
import { AnyElement } from './ElementStyleInspector'
import { InspectorField, InspectorLabel } from './ManuscriptStyleInspector'

const Label = styled(InspectorLabel)`
  color: ${props => props.theme.colors.text.primary};
`

type SaveModel = <T extends Model>(model: Partial<T>) => Promise<T>

interface Props {
  target: AnyElement | Section
  saveModel: SaveModel
  listCollaborators: () => UserProfile[]
  statusLabels: StatusLabel[]
  tags: Tag[]
  modelMap: Map<string, Model>
  deleteModel: (id: string) => Promise<string>
}

export const ManageTargetInspector: React.FC<Props> = ({
  target,
  saveModel,
  listCollaborators,
  statusLabels,
  tags,
  modelMap,
  deleteModel,
}) => {
  const title = target.objectType.replace(/MP|Element/g, '')

  const profiles = listCollaborators() || []

  const deadline = target.deadline

  const { overdue, dueSoon } = useMemo(
    () =>
      isOverdue(deadline)
        ? { overdue: true, dueSoon: false }
        : isDueSoon(deadline)
        ? { overdue: false, dueSoon: true }
        : { overdue: false, dueSoon: false },
    [deadline]
  )

  return (
    <InspectorSection title={`Manage ${title}`}>
      <InspectorField>
        <Label>Assignees</Label>
        <AssigneesInput
          saveModel={saveModel}
          profiles={profiles}
          target={target}
        />
      </InspectorField>
      <InspectorField>
        <Label>Deadline</Label>
        <DeadlineInput
          saveModel={saveModel}
          target={target}
          isOverdue={overdue}
          isDueSoon={dueSoon}
        />
      </InspectorField>
      <InspectorField>
        <Label>Tags</Label>
        <TagsInput
          tags={tags}
          saveModel={saveModel}
          target={target}
          modelMap={modelMap}
          deleteModel={deleteModel}
        />
      </InspectorField>
      <InspectorField>
        <Label>Status</Label>
        <StatusInput
          labels={statusLabels}
          saveModel={saveModel}
          target={target}
          isOverdue={overdue}
          isDueSoon={dueSoon}
        />
      </InspectorField>
    </InspectorSection>
  )
}
