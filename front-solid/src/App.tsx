import { createSignal, ErrorBoundary } from 'solid-js'
import './App.css'
import { hlTokenExpired, isAuthValid, login, getToken, storeHlToken, accessToken, locationId } from './utils/Pocketbase'
import { CircularProgress } from '@suid/material'
import { FamilyList } from './components'
import { refreshToken } from './utils/HighLevel'
import { Router, Route } from '@solidjs/router'
import { FamilyProvider } from './utils/FamilyProvider'
import { FamilyView, OAuth } from './pages'

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

  const ordersTest = async () => {

    const url = `https://services.leadconnectorhq.com/payments/orders?altId=${locationId}&altType=location`;
    const options = {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Version: '2021-07-28', Accept: 'application/json' }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  ordersTest()


  return (
    <ErrorBoundary fallback={(err) => <div>{err.message}</div>}>
      <Router>
        <FamilyProvider>
          <Route path='/' component={loggedIn() && hlAuthState() ? FamilyList : CircularProgress} />
          <Route path='/oauth/' component={OAuth} />
          <Route path='/family/:id' component={FamilyView} />
        </FamilyProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
