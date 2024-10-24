import { createEffect, createSignal, ErrorBoundary } from 'solid-js'
import './App.css'
import { getToken } from './utils/api'
import { FamilyList } from './components'
import { Router, Route } from '@solidjs/router'
import { FamilyProvider } from './utils/FamilyProvider'
import { FamilyView, OAuth, Unauthorized } from './pages'
import * as CryptoJs from 'crypto-js'
import { CircularProgress, Box, Typography, Stack, Card, CardContent } from '@suid/material'

function App() {
  const [authorized, setAuthorized] = createSignal(false)
  const [loading, setLoading] = createSignal(true)

  createEffect(async () => {
    console.log("requesting user data")
    const token = await getToken()
    const key: string = await new Promise((resolve) => {
      window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
      window.addEventListener("message", ({ data }) => {
        if (data.message === "REQUEST_USER_DATA_RESPONSE") {
          resolve(data.payload)
        } else {
          resolve("")
        }
      })
    })
    setLoading(false)
    if (!key) return
    console.log(key, token.locationId)
    const decryptedKey = await JSON.parse(CryptoJs.AES.decrypt(key, import.meta.env.VITE_SSO_KEY).toString(CryptoJs.enc.Utf8))
    // @ts-ignore
    console.log(decryptedKey.activeLocation, token.locationId)
    // @ts-ignore
    if (decryptedKey.activeLocation === token.locationId) {
      setAuthorized(true)
    }
  })

  return (
    <ErrorBoundary fallback={(err) => <div>{err.message}</div>}>
      <Stack spacing={4}>
        <Box component={'header'} sx={{ borderBottom: 1, borderColor: 'divider', paddingBottom: 1}}>
          <Typography variant='h6' textAlign='left'>
            Unified Inbox
          </Typography>
        </Box>
        <Router>
          {loading() ? (
            <>
              <Route path='/*' component={CircularProgress} />
              <Route path='/oauth/' component={OAuth} />
            </>
          ) :
            <FamilyProvider>
              {!authorized() && import.meta.env.PROD ? <Route path='/*' component={Unauthorized} /> :
                <>
                  <Route path='/' component={FamilyList} />
                  <Route path='/family/:id' component={FamilyView} />
                </>}
            </FamilyProvider>
          }
        </Router>
      </Stack>
    </ErrorBoundary>
  )
}

export default App