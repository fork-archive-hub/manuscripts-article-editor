import { AxiosResponse } from 'axios'
import { FormikActions, FormikErrors } from 'formik'
import { LocationState } from 'history'
import * as HttpStatusCodes from 'http-status-codes'
import { parse } from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import config from '../../config'
import { TokenActions } from '../../data/TokenData'
import { login } from '../../lib/account'
import { resendVerificationEmail } from '../../lib/api'
import { loginSchema } from '../../validation'
import { AlertMessageType } from '../AlertMessage'
import { DatabaseContext } from '../DatabaseProvider'
import { FormErrors } from '../Form'
import { Main, Page } from '../Page'
import { LoginValues } from './LoginForm'
import {
  gatewayInaccessibleErrorMessage,
  identityProviderErrorMessage,
  infoLoginMessage,
  networkErrorMessage,
  resendVerificationDataMessage,
  verificationMessage,
  warningLoginMessage,
} from './LoginMessages'
import LoginPage from './LoginPage'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

type AlertFunction = () => void

export enum ErrorName {
  GatewayInaccessibleError = 'GatewayInaccessibleError',
  AccountNotFoundError = 'AccountNotFoundError',
  InvalidClientApplicationError = 'InvalidClientApplicationError',
  InvalidCredentialsError = 'InvalidCredentialsError',
}

interface State {
  message: null | AlertFunction
  submitErrorType: string | null
}

interface ErrorMessage {
  error: string
}

interface Action {
  action: string
}

interface Token {
  access_token: string
}

interface VerificationData {
  token: string
  email: string
}

interface RouteLocationState {
  from?: LocationState
  loginMessage?: string
  verificationMessage?: string
  infoLoginMessage?: string
}

interface Props {
  tokenActions: TokenActions
}

class LoginPageContainer extends React.Component<
  Props & RouteComponentProps<{}, {}, RouteLocationState>,
  State
> {
  public state: Readonly<State> = {
    message: null,
    submitErrorType: null,
  }

  private initialValues: LoginValues = {
    email: '',
    password: '',
  }

  public async componentDidMount() {
    // TODO: needs state
    const hashData: Token & ErrorMessage & VerificationData & Action = parse(
      window.location.hash.substr(1)
    )

    this.updateState(hashData)

    const { email, error_description: errorDescription } = parse(
      this.props.location.search.substr(1)
    )

    if (email) {
      this.initialValues.email = email
    }

    if (errorDescription) {
      // TODO: do something
    }

    const { state } = this.props.location

    if (state) {
      if (state.loginMessage) {
        this.setState({
          message: () => warningLoginMessage(state.loginMessage!),
        })
      }
      if (state.verificationMessage) {
        this.setState({
          message: () => verificationMessage(state.verificationMessage!),
        })
      }
      if (state.infoLoginMessage) {
        this.setState({
          message: () => infoLoginMessage(state.infoLoginMessage!),
        })
      }
    }
  }

  public updateState = (
    hashData: Token & ErrorMessage & VerificationData & Action
  ) => {
    if (hashData && Object.keys(hashData).length) {
      const { error, access_token: token, action } = hashData

      if (error) {
        this.setState({
          message: () => identityProviderErrorMessage(error),
        })
      } else if (token) {
        this.props.tokenActions.update(token)

        window.location.href = '/'
      }

      if (action === 'logout') {
        this.setState({
          message: () => infoLoginMessage('You have been logged out.'),
        })
      }

      window.location.hash = ''
    }
  }

  public render() {
    const { message, submitErrorType } = this.state

    return (
      <Page>
        <Main>
          {message && message()}

          <DatabaseContext.Consumer>
            {db => (
              <LoginPage
                initialValues={this.initialValues}
                validationSchema={loginSchema}
                submitErrorType={submitErrorType}
                onSubmit={async (values, actions) => {
                  this.props.tokenActions.delete()

                  try {
                    const token = await login(values.email, values.password, db)

                    this.props.tokenActions.update(token)

                    this.redirectAfterLogin()
                  } catch (error) {
                    console.error(error) // tslint:disable-line:no-console

                    if (error.response) {
                      this.handleErrorResponse(error.response, values, actions)
                    } else {
                      this.setState({
                        message: networkErrorMessage,
                      })
                    }

                    actions.setSubmitting(false)
                  }
                }}
              />
            )}
          </DatabaseContext.Consumer>
        </Main>
      </Page>
    )
  }

  private handleErrorResponse = (
    response: AxiosResponse,
    values: LoginValues,
    actions: FormikActions<LoginValues>
  ) => {
    const errorName = this.errorName(response)

    switch (errorName) {
      case ErrorName.GatewayInaccessibleError:
        this.setState({
          message: gatewayInaccessibleErrorMessage,
        })
        return

      case ErrorName.InvalidCredentialsError:
      default:
        const errors: FormikErrors<LoginValues & FormErrors> = {
          submit: this.errorResponseMessage(response.status, values, errorName),
        }

        actions.setErrors(errors)

        this.setState({
          submitErrorType: errorName,
        })

        return
    }
  }

  // redirect if the user tried before login to access an authenticated route
  // (e.g. a bookmarked project, or a project invitation link)
  private redirectAfterLogin = () => {
    const { state } = this.props.location

    window.location.href = state && state.from ? state.from.pathname : '/'
  }

  private errorName = (response: AxiosResponse) => {
    const { data } = response

    if (!data) return null

    if (!data.error) return null

    const error = JSON.parse(data.error)

    return error ? error.name : null
  }

  private errorResponseMessage = (
    status: number,
    values: LoginValues,
    errorName: string
  ) => {
    switch (status) {
      case HttpStatusCodes.BAD_REQUEST:
        return 'Invalid operation'

      case HttpStatusCodes.UNAUTHORIZED:
        if (errorName === ErrorName.AccountNotFoundError) {
          return 'No user exists with this email address.'
        } else if (errorName === ErrorName.InvalidClientApplicationError) {
          return `Client and server configuration do not match. Please report this to ${
            config.support.email
          }.`
        } else {
          return 'Invalid password.'
        }

      case HttpStatusCodes.FORBIDDEN:
        const resendVerificationData: ResendVerificationData = {
          message: 'Please verify your email address',
          email: values.email,
          type: AlertMessageType.warning,
        }

        this.setState({
          message: () =>
            resendVerificationDataMessage(resendVerificationData, () =>
              this.resendVerificationEmail(values.email)
            ),
        })
        break
      default:
        return 'An error occurred.'
    }
  }

  private resendVerificationEmail = async (email: string) => {
    try {
      await resendVerificationEmail(email)

      this.setState({
        message: null,
      })
    } catch (error) {
      const resendVerificationData: ResendVerificationData = {
        message: 'Re-sending verification email failed.',
        email,
        type: AlertMessageType.error,
      }
      this.setState({
        message: () =>
          resendVerificationDataMessage(resendVerificationData, () =>
            this.resendVerificationEmail(email)
          ),
      })
    }
  }
}

export default LoginPageContainer
