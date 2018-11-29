import React from 'react'
import config from '../../config'
import AlertMessage, { AlertMessageType } from '../AlertMessage'

interface ResendVerificationData {
  message: string
  email: string
  type: AlertMessageType
}

export const warningLoginMessage = (message: string) => {
  return <AlertMessage type={AlertMessageType.warning}>{message}</AlertMessage>
}

export const verificationMessage = (message: string) => {
  switch (message) {
    case 'account-verification-failed':
      return (
        <AlertMessage type={AlertMessageType.error}>
          {'Account verification failed. Is the account already verified?'}
        </AlertMessage>
      )
    default:
      return <AlertMessage type={AlertMessageType.info}>{message}</AlertMessage>
  }
}

export const infoLoginMessage = (message: string) => {
  return <AlertMessage type={AlertMessageType.info}>{message}</AlertMessage>
}

export const identityProviderErrorMessage = (message: string) => {
  let alertMessage: string
  switch (message) {
    case 'user-not-found':
      alertMessage = `A user record matching your identity at Google was unexpectedly not found. Please contact ${
        config.support.email
      } if this persists.`
      break

    case 'validation-error':
      alertMessage = `An invalid request was made when attempting to log in via Google. Please contact ${
        config.support.email
      } if this persists.`
      break

    default:
      alertMessage = `An error occurred while logging in with Google, please contact ${
        config.support.email
      }`
  }

  return (
    <AlertMessage type={AlertMessageType.error}>{alertMessage}</AlertMessage>
  )
}

export const gatewayInaccessibleErrorMessage = () => {
  return (
    <AlertMessage type={AlertMessageType.error}>
      {'Trouble reaching manuscripts.io servers. Please try again later.'}
    </AlertMessage>
  )
}

export const networkErrorMessage = () => {
  return (
    <AlertMessage type={AlertMessageType.error}>
      {`Failed to connect to service. Please check your network connection before trying again, and if the problem persists contact ${
        config.support.email
      }.`}
    </AlertMessage>
  )
}

export const resendVerificationDataMessage = (
  resendVerificationData: ResendVerificationData,
  resendVerificationEmail: (email: string) => void
) => {
  return (
    <AlertMessage
      type={resendVerificationData.type}
      dismissButton={{
        text: 'Re-send verification email.',
        action: () => resendVerificationEmail(resendVerificationData.email),
      }}
    >
      {resendVerificationData.message}
    </AlertMessage>
  )
}