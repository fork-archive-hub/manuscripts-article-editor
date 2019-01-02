import { Field, FieldProps, Form, FormikProps } from 'formik'
import React from 'react'
import { styled } from '../../theme'
import { PrimaryButton } from '../Button'
import { FormError, FormErrors } from '../Form'
import { ModalFormActions } from '../ModalForm'
import { TextArea, TextField } from '../TextField'
import { TextFieldContainer } from '../TextFieldContainer'
import { TextFieldGroupContainer } from '../TextFieldGroupContainer'

export interface FeedbackValues {
  message: string
  title: string
}

const Container = styled.div`
  color: rgba(0, 0, 0, 0.51);
`
export const FeedbackForm: React.FunctionComponent<
  FormikProps<FeedbackValues & FormErrors>
> = ({ errors, isSubmitting }) => (
  <Form id={'feedback-form'} noValidate={true}>
    <TextFieldGroupContainer errors={{ title: errors.title }}>
      <Field name={'title'}>
        {({ field }: FieldProps) => (
          <TextField
            {...field}
            type={'title'}
            placeholder={'Title'}
            autoFocus={true}
            required={true}
          />
        )}
      </Field>
    </TextFieldGroupContainer>

    <TextFieldContainer error={errors.message}>
      <Field name={'message'}>
        {({ field }: FieldProps) => (
          <TextArea
            {...field}
            placeholder={
              'Please tell us how you like Manuscripts.io, and what we should improve.\n\nIf you are reporting a bug, please include steps to help us reproduce the problem you encountered.'
            }
            autoFocus={true}
            required={true}
          />
        )}
      </Field>
    </TextFieldContainer>

    <Container>
      <label>Your feedback will be posted privately to the developers. </label>
    </Container>

    {errors.submit && <FormError>{errors.submit}</FormError>}

    <ModalFormActions>
      <PrimaryButton type={'submit'} disabled={isSubmitting}>
        Submit
      </PrimaryButton>
    </ModalFormActions>
  </Form>
)