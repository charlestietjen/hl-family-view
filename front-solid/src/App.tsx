import { createSignal, createEffect } from 'solid-js'
import './App.css'
import { isAuthValid, login } from './utils/Pocketbase'
import { CircularProgress } from '@suid/material'
import { FamilyList } from './components'

function App() {
  const [loggedIn, setIsLoggedIn] = createSignal(isAuthValid)
  const [hlAuthState, setHlAuthState] = createSignal(false)

  login().then(res => {
    if (res?.token) setIsLoggedIn(true)
  })


  return (
    <>
      {loggedIn() ? (
        <FamilyList />
      ):
      <CircularProgress />
        
      }
    </>
  )
}

export default App
