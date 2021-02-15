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
  ApplicationMenus,
  getMenus,
  MenuSpec,
  useApplicationMenus,
} from '@manuscripts/manuscript-editor'
import {
  ManuscriptEditorState,
  ManuscriptTransaction,
} from '@manuscripts/manuscript-transform'
import React, { useEffect } from 'react'

import config from '../../config'
import { createDispatchMenuAction } from '../../lib/native'
import { buildProjectMenu, ProjectMenuProps } from '../../lib/project-menu'

type Command = (
  state: ManuscriptEditorState,
  dispatch?: (tr: ManuscriptTransaction) => void
) => boolean

export const createMenuSpec = (props: ProjectMenuProps): MenuSpec[] => {
  const { view } = props
  const { state, dispatch } = view
  const doCommand = (command: Command) => command(state, dispatch)
  const isCommandValid = (command: Command) => !!command(state)

  return [
    buildProjectMenu(props),
    ...getMenus(
      {
        state,
        doCommand,
        isCommandValid,
      } as any,
      config.footnotes.enabled
    ),
  ]
}

export const ManuscriptPageMenus: React.FC<ProjectMenuProps> = (props) => {
  const spec = createMenuSpec(props)

  useEffect(() => {
    window.dispatchMenuAction = createDispatchMenuAction(spec)
    window.getMenuState = () => spec
  }, [spec])

  const { menuState, wrapperRef, handleItemClick } = useApplicationMenus(spec)

  return (
    <ApplicationMenus
      menuState={menuState}
      wrapperRef={wrapperRef}
      handleItemClick={handleItemClick}
    />
  )
}