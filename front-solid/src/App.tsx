import { createEffect, createSignal, ErrorBoundary } from 'solid-js'
import './App.css'
import { getToken } from './utils/api'
import { FamilyList } from './components'
import { Router, Route } from '@solidjs/router'
import { FamilyProvider } from './utils/FamilyProvider'
import { FamilyView, OAuth } from './pages'

function App() {
  const [_token, setToken] = createSignal()
  
  createEffect(async () => {
    const token = await getToken()
    if (token) {
      setToken(token)
      return
    }
    // window.location.replace(import.meta.env.VITE_AUTH_LINK)
  })
  return (
    <ErrorBoundary fallback={(err) => <div>{err.message}</div>}>
      <Router>
        <FamilyProvider>
          <Route path='/' component={FamilyList} />
          <Route path='/oauth/' component={OAuth} />
          <Route path='/family/:id' component={FamilyView} />
        </FamilyProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
