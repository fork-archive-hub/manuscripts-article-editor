import { FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { FormGroup } from './Form'
import {
  ModalContainer,
  ModalFooterButton,
  ModalForm,
  ModalFormActions,
  ModalFormBody,
  ModalFormFooter,
  ModalFormFooterText,
  ModalHeader,
  ModalHeading,
  ModalMain,
  PrimaryModalFooterButton,
} from './Manage'
import { TextField, TextFieldLabel } from './TextField'

export interface CollaboratorValues {
  givenName: string
  familyName: string
}

export interface CollaboratorErrors extends FormikErrors<CollaboratorValues> {
  submit?: string
}

export interface CollaboratorFormProps {
  stopEditing: () => void
  deleteCollaborator: () => void
}

export const CollaboratorForm = ({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  isValid,
  stopEditing,
  deleteCollaborator,
}: FormikProps<CollaboratorValues & CollaboratorErrors> &
  CollaboratorFormProps) => (
  <form onSubmit={handleSubmit}>
    <ModalContainer>
      <ModalHeader>
        <ModalHeading>Collaborators / {values.givenName} / Manage</ModalHeading>
      </ModalHeader>
      <ModalForm>
        <ModalFormBody>
          <ModalMain>
            <FormGroup>
              <TextFieldLabel>
                Collaborator Given Name
                <TextField
                  type={'text'}
                  name={'givenName'}
                  id={'givenName'}
                  autoFocus={true}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.givenName}
                  required={true}
                />
              </TextFieldLabel>
            </FormGroup>

            <FormGroup>
              <TextFieldLabel>
                Collaborator Family Name
                <TextField
                  type={'text'}
                  name={'familyName'}
                  id={'familyName'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.familyName}
                />
              </TextFieldLabel>
            </FormGroup>

            {errors.submit && <div>{errors.submit}</div>}
          </ModalMain>
        </ModalFormBody>

        <ModalFormFooter>
          <ModalFormFooterText>
            <ModalFooterButton onClick={deleteCollaborator}>
              Delete Collaborator
            </ModalFooterButton>
          </ModalFormFooterText>

          <ModalFormActions>
            <ModalFooterButton onClick={stopEditing}>Cancel</ModalFooterButton>

            <PrimaryModalFooterButton type={'submit'}>
              Done
            </PrimaryModalFooterButton>
          </ModalFormActions>
        </ModalFormFooter>
      </ModalForm>
    </ModalContainer>
  </form>
)