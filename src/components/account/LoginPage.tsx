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
import AuthButtonContainer from './AuthButtonContainer'
import { AuthenticationContainer, GoogleLogin } from './Authentication'
import FooterContainer from './FooterContainer'
import { LoginForm, LoginValues } from './LoginForm'

interface Props {
  submitErrorType?: string
}

const LoginPage: React.FunctionComponent<FormikConfig<LoginValues> & Props> = ({
  initialValues,
  validationSchema,
  onSubmit,
  submitErrorType,
}) => (
  <Centered>
    <Formik<LoginValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onSubmit}
      render={formikProps => (
        <LoginForm {...formikProps} submitErrorType={submitErrorType} />
      )}
    />

    <AuthenticationContainer>
      <div>Sign in with</div>
      <div>
        <AuthButtonContainer component={GoogleLogin} />
        {/*<AuthButtonContainer component={OrcidLogin} />*/}
      </div>
    </AuthenticationContainer>

    <FooterContainer />
  </Centered>
)

export default LoginPage
