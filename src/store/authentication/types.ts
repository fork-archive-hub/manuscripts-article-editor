import { Action } from 'redux'
import { ConnectedReduxProps } from '../types'

export interface User {
  givenName: string
  email: string
  password?: string
  familyName: string
  phone?: string
  avatar?: string
}

export interface AuthenticationState {
  loading: boolean
  loaded: boolean
  user: User | undefined
  error: string | undefined
}

export interface AuthenticateRequestAction extends Action {
  type: string
}

export interface AuthenticateSuccessAction extends Action {
  type: string
  payload: User | undefined
}

export interface AuthenticateFailureAction extends Action {
  type: string
  payload: string
}

export type AuthenticationActions =
  | AuthenticateRequestAction
  | AuthenticateSuccessAction
  | AuthenticateFailureAction

export type AuthenticationDispatchProps = ConnectedReduxProps<
  AuthenticationState
>

export interface AuthenticationStateProps {
  authentication: AuthenticationState
}