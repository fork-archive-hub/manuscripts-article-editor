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

import { buildKeyword } from '@manuscripts/manuscript-editor'
import {
  BibliographicName,
  BibliographyItem,
  Keyword,
} from '@manuscripts/manuscripts-json-schema'
import { DangerButton, PrimarySubmitButton } from '@manuscripts/style-guide'
import { TitleField } from '@manuscripts/title-editor'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import * as React from 'react'
import { Creatable as CreatableSelect } from 'react-select'
import { OptionsType } from 'react-select/lib/types'
import ProjectKeywordsData from '../../data/ProjectKeywordsData'
import { styled } from '../../theme/styled-components'

const Fields = styled.div`
  padding: 10px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

const LabelText = styled.div`
  margin-bottom: 5px;
`

const TextField = styled.input`
  font-size: 14px;
  padding: 8px 16px;
  box-sizing: border-box;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }

  &:hover {
    &::placeholder {
      color: #777;
    }
  }
`

const StyledTitleField = styled(TitleField)`
  flex: 1;

  & .ProseMirror {
    font-weight: bold;
    cursor: pointer;
    font-size: 13pt;
    font-family: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;

    &:focus {
      outline: none;
    }
  }
`

const Button = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.button.primary};
  border: 2px solid transparent;
  border-radius: 4px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 10px 3px;
  font-family: ${props => props.theme.fontFamily};
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => (props.disabled ? 'text' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.5' : '1.0')};
  transition: border 0.1s, color 0.1s, background-color 0.1s;

  &:hover {
    background-color: #fff;
    color: ${props => props.theme.colors.button.primary};
    border-color: ${props => props.theme.colors.button.primary};
  }

  &:active {
    background-color: ${props => props.theme.colors.button.primary};
    border-color: ${props => props.theme.colors.button.primary};
    color: white;
  }
`

const Author = styled.div`
  display: inline-flex;
  border-radius: 5px;
  border: none;
  width: auto;
  box-shadow: 0 1px 3px #aaa;
  margin-bottom: 5px;
  margin-right: 5px;

  & ${TextField} {
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
`

const TitleContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`

const TitleLink = styled.a`
  text-decoration: none;
`

interface OptionType {
  label: string
  value: any // tslint:disable-line:no-any
}

interface Props {
  item: BibliographyItem
  handleDelete?: (item: BibliographyItem) => void
  handleSave: (item: BibliographyItem) => void
  projectID: string
}

const buildOptions = (data: Map<string, Keyword>) => {
  const options: OptionsType<OptionType> = []

  for (const keyword of data.values()) {
    options.push({
      value: keyword._id,
      label: keyword.name,
    })
  }

  return options
}

interface LibraryFormValues {
  _id: string
  title?: string
  author?: BibliographicName[]
  keywordIDs?: string[]
  DOI?: string
}

const buildInitialValues = (item: BibliographyItem): LibraryFormValues => ({
  _id: item._id,
  title: item.title,
  author: item.author,
  keywordIDs: item.keywordIDs,
  DOI: item.DOI,
})

// TODO: a "manage tags" page, where old tags can be deleted

const LibraryForm: React.FunctionComponent<Props> = ({
  item,
  handleSave,
  handleDelete,
  projectID,
}) => (
  <ProjectKeywordsData projectID={projectID}>
    {(keywords, keywordActions) => (
      <Formik<LibraryFormValues>
        initialValues={buildInitialValues(item)}
        onSubmit={handleSave}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, handleChange }) => (
          <Form>
            <Fields>
              <TitleContainer>
                <StyledTitleField
                  value={values.title || ''}
                  handleChange={data => setFieldValue('title', data)}
                />
              </TitleContainer>

              <Label>
                <LabelText>Authors</LabelText>
                <FieldArray
                  name={'author'}
                  render={arrayHelpers => (
                    <div>
                      {values.author &&
                        values.author.map((author, index) => (
                          <Author key={`author.${index}`}>
                            <Field
                              name={`author.${index}.given`}
                              value={author.given}
                              onChange={handleChange}
                            >
                              {({ field }: FieldProps) => (
                                <TextField {...field} placeholder={'Given'} />
                              )}
                            </Field>

                            <Field
                              name={`author.${index}.family`}
                              value={author.family}
                              onChange={handleChange}
                            >
                              {({ field }: FieldProps) => (
                                <TextField {...field} placeholder={'Family'} />
                              )}
                            </Field>

                            <Button
                              type={'button'}
                              onClick={() => arrayHelpers.remove(index)}
                              tabIndex={-1}
                            >
                              -
                            </Button>
                          </Author>
                        ))}
                      <Button
                        type={'button'}
                        onClick={() =>
                          arrayHelpers.push({ given: '', family: '' })
                        }
                      >
                        +
                      </Button>
                    </div>
                  )}
                />
              </Label>

              <Label>
                <LabelText>Keywords</LabelText>

                <Field name={'keywordIDs'}>
                  {(props: FieldProps) => (
                    <CreatableSelect<OptionType>
                      isMulti={true}
                      onChange={async (newValue: OptionsType<OptionType>) => {
                        props.form.setFieldValue(
                          props.field.name,
                          await Promise.all(
                            newValue.map(async option => {
                              const existing = keywords.get(option.value)

                              if (existing) return existing._id

                              const keyword = buildKeyword(String(option.label))

                              await keywordActions.create(keyword, {
                                containerID: projectID,
                              })

                              return keyword._id
                            })
                          )
                        )
                      }}
                      options={buildOptions(keywords)}
                      value={(props.field.value as string[])
                        .filter(id => keywords.has(id))
                        .map(id => keywords.get(id)!)
                        .map(item => ({
                          value: item._id,
                          label: item.name,
                        }))}
                    />
                  )}
                </Field>
              </Label>

              <Actions>
                <ActionsGroup>
                  <PrimarySubmitButton>Save</PrimarySubmitButton>

                  <TitleLink
                    href={`https://doi.org/${values.DOI}`}
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                  >
                    Read
                  </TitleLink>
                </ActionsGroup>

                {handleDelete && (
                  <DangerButton onClick={() => handleDelete(item)}>
                    Delete
                  </DangerButton>
                )}
              </Actions>
            </Fields>
          </Form>
        )}
      </Formik>
    )}
  </ProjectKeywordsData>
)

export default LibraryForm
