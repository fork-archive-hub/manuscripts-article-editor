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

import { Formik, FormikConfig } from 'formik'
import React from 'react'
import { Centered } from '../Page'
import FooterContainer from './FooterContainer'
import { PasswordForm, PasswordValues } from './PasswordForm'

const PasswordPage: React.FunctionComponent<FormikConfig<PasswordValues>> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => (
  <Centered>
    <Formik<PasswordValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
      component={PasswordForm}
    />

    <FooterContainer />
  </Centered>
)

export default PasswordPage
