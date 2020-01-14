import React from 'react'
import AppProvider from 'provider'
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
// import FacebookCallBack from 'screens/facebook'
import configureAmplify from 'config/amplify'

import WelcomeScreen from 'screens/welcome'
import ForgotPasswordScreen from 'screens/forgot-password'
import LoginScreen from 'screens/login'
import SignUpScreen from 'screens/signup'
import ProfileScreen from 'screens/profile'

configureAmplify()

function App() {
  return (
    <div>
      <AppProvider>
        <Switch>
          <Route exact path="/forgot-password">
            <ForgotPasswordScreen />
          </Route>
          <Route exact path="/login">
            <LoginScreen />
          </Route>
          <Route exact path="/signup">
            <SignUpScreen />
          </Route>
          <Route exact path="/">
            <WelcomeScreen />
          </Route>
          <Route exact path="/profile">
            <ProfileScreen />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </AppProvider>
    </div>
  )
}

export default App