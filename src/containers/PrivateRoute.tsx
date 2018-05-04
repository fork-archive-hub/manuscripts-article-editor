import React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { UserProps, withUser } from '../store/UserProvider'

interface ComponentProps {
  component: React.ComponentType<any> // tslint:disable-line:no-any
}

type Props = ComponentProps & RouteProps & UserProps

const PrivateRoute: React.SFC<Props> = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props: RouteComponentProps<{}>) => {
      const { user } = rest

      if (!user.loaded) {
        return <Spinner />
      }

      if (!user.data) {
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }

      return <Component {...props} />
    }}
  />
)

export default withUser<ComponentProps & RouteProps>(PrivateRoute)
