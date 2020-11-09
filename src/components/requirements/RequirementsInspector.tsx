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

import { ContainedModel, isFigure } from '@manuscripts/manuscript-transform'
import { Model } from '@manuscripts/manuscripts-json-schema'
import { createTemplateValidator } from '@manuscripts/requirements'
import toBuffer from 'blob-to-buffer'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { AnyValidationResult } from '../../lib/validations'
import { RequirementsList } from './RequirementsList'

const buildQualityCheck = async (
  modelMap: Map<string, Model>,
  prototypeId: string | undefined,
  manuscriptID: string
): Promise<AnyValidationResult[] | undefined> => {
  if (prototypeId !== undefined) {
    const getData = async (id: string): Promise<Buffer | undefined> => {
      if (modelMap.has(id)) {
        const model = modelMap.get(id) as Model
        if (isFigure(model)) {
          const modelSrc = model.src as string
          const blobData = await fetch(modelSrc).then((res) => res.blob())
          const blobFile = new File([blobData], id, {
            type: blobData.type,
          })
          return fileToBuffer(blobFile)
        }
      }
      return undefined
    }

    const fileToBuffer = (file: File): Promise<Buffer> =>
      new Promise((resolve, reject) => {
        toBuffer(file, (err, buffer) => {
          if (err) {
            reject(err)
          } else {
            resolve(buffer)
          }
        })
      })

    const validateManuscript = createTemplateValidator(prototypeId)
    // TODO: remove `as AnyValidationResult[]`
    const results = (await validateManuscript(
      Array.from(modelMap.values()) as ContainedModel[],
      manuscriptID,
      getData
    )) as AnyValidationResult[]
    return results
  }
}

export const RequirementsInspector: React.FC<{
  modelMap: Map<string, Model>
  prototypeId: string | undefined
  manuscriptID: string
  bulkUpdate: (items: Array<ContainedModel>) => Promise<void>
}> = ({ modelMap, prototypeId, manuscriptID, bulkUpdate }) => {
  const [result, setResult] = useState<AnyValidationResult[]>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    buildQualityCheck(modelMap, prototypeId, manuscriptID)
      .then(setResult)
      .catch(setError)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prototypeId, manuscriptID, JSON.stringify([...modelMap.values()])])

  if (error) {
    return <ErrorMessage> {error?.message}</ErrorMessage>
  }

  if (!prototypeId) {
    return (
      <AlertMessage>
        You need to select a template to display the quality report check
      </AlertMessage>
    )
  }

  if (!result) {
    return null // TODO
  }

  return (
    <RequirementsList
      validationResult={result}
      modelMap={modelMap}
      manuscriptID={manuscriptID}
      bulkUpdate={bulkUpdate}
    />
  )
}

const AlertMessage = styled.div`
  margin: 13px 0 9px 17px;
`
const ErrorMessage = styled.div`
  margin: 13px 0 9px 17px;
`