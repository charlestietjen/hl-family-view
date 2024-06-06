import { useState, useEffect } from 'react'
import { isAuthValid, login } from './utils/Pocketbase'
import { Login } from './pages'
import { CircularProgress } from '@mui/material'
import { RecordAuthResponse } from 'pocketbase'

function App() {
  const [authData, setAuthData] = useState<RecordAuthResponse | undefined>(undefined)

  login().then(res => setAuthData(res))
  useEffect(() => {

  }, [authData])

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100dvw', height: '100vh' }}>
      {authData !== undefined ? <div>Logged in</div> : <CircularProgress />}
    </main>
  )
}

export default App