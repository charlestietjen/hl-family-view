import { createSignal } from 'solid-js'
import './App.css'
import { hlTokenExpired, isAuthValid, login, getToken, storeHlToken } from './utils/Pocketbase'
import { CircularProgress } from '@suid/material'
import { FamilyList } from './components'
import { refreshToken } from './utils/HighLevel'
import { Router, Route } from '@solidjs/router'
import { FamilyProvider } from './utils/FamilyProvider'

function App() {
  const [loggedIn, setIsLoggedIn] = createSignal(isAuthValid)
  const [hlAuthState, setHlAuthState] = createSignal(false)

  login().then(res => {
    if (res?.token) setIsLoggedIn(true)
  })

  if (hlTokenExpired()) {
    refreshToken(getToken().refresh_token).then(res => {
      storeHlToken(res)
      setHlAuthState(true)
    })
  } else {
    setHlAuthState(true)
  }


  return (
    <Router>
      <FamilyProvider>
        <Route path='/' component={loggedIn() && hlAuthState() ? FamilyList : CircularProgress} />
      </FamilyProvider>
    </Router>
  )
}

export default App
