import * as React from 'react'
import { hot } from 'react-hot-loader'
import { Route, Switch } from 'react-router-dom'
import { Main, Page, Sidebar } from './components/Page'
import SidebarNav from './components/SidebarNav'
import AccountPageContainer from './containers/AccountPageContainer'
import CollaboratorsPageContainer from './containers/CollaboratorsPageContainer'
import GroupsPageContainer from './containers/GroupsPageContainer'
import HomePageContainer from './containers/HomePageContainer'
import LoginPageContainer from './containers/LoginPageContainer'
import LogoutPageContainer from './containers/LogoutPageContainer'
import ManuscriptsPageContainer from './containers/ManuscriptsPageContainer'
import PrivateRoute from './containers/PrivateRoute'
import RecoverPageContainer from './containers/RecoverPageContainer'
import SignupPageContainer from './containers/SignupPageContainer'
import UserContainer from './containers/UserContainer'

const App = () => (
  <Page>
    <Sidebar>
      <UserContainer />
      <SidebarNav />
    </Sidebar>

    <Main>
      <Switch>
        <Route path={'/'} exact={true} component={HomePageContainer} />
        <Route path={'/login'} exact={true} component={LoginPageContainer} />
        <Route path={'/signup'} exact={true} component={SignupPageContainer} />
        <Route
          path={'/recover'}
          exact={true}
          component={RecoverPageContainer}
        />
        <PrivateRoute
          path={'/account'}
          exact={true}
          component={AccountPageContainer}
        />
        <PrivateRoute
          path={'/manuscripts'}
          component={ManuscriptsPageContainer}
        />
        <PrivateRoute
          path={'/collaborators'}
          component={CollaboratorsPageContainer}
        />
        <PrivateRoute path={'/groups'} component={GroupsPageContainer} />
        <PrivateRoute
          path={'/logout'}
          exact={true}
          component={LogoutPageContainer}
        />
      </Switch>
    </Main>
  </Page>
)

export default hot(module)(App)
