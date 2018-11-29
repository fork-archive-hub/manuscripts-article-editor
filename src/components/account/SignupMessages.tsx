import React from 'react'
import config from '../../config'
import AlertMessage, { AlertMessageType } from '../AlertMessage'

export const signupVerifyMessage = (
  email: string,
  resendVerificationEmail: (email: string) => void
) => {
  return (
    <AlertMessage
      type={AlertMessageType.success}
      dismissButton={{
        text: 'Click here to re-send.',
        action: () => resendVerificationEmail(email),
      }}
    >
      {`Thanks for signing up! Please click the link sent to ${email} to verify your account.`}
    </AlertMessage>
  )
}

export const signupVerifyConflictMessage = (email: string) => {
  return (
    <AlertMessage
      type={AlertMessageType.warning}
    >{`Account already exists with ${email}. Verification email has been re-sent to your email address.`}</AlertMessage>
  )
}

export const signupVerifyResendSuccessMessage = (email: string) => {
  const supportEmail = config.support.email
  return (
    <AlertMessage type={AlertMessageType.success}>
      {`Verification email re-resent to ${email}. If you have not received it, please wait, check your spam box before getting in touch via ${supportEmail}.`}
      }
    </AlertMessage>
  )
}

export const signupVerifyResendFailureMessage = (
  email: string,
  resendVerificationEmail: (email: string) => void
) => {
  return (
    <AlertMessage
      type={AlertMessageType.error}
      dismissButton={{
        text: 'Click here to retry.',
        action: () => resendVerificationEmail(email),
      }}
    >
      {`Failed to re-send verification email to ${email}.`}
    </AlertMessage>
  )
}