/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import 'solid-devtools'

import './index.css'
import App from './App'
import { OAuth } from './pages'

const root = document.getElementById('root')

render(() => 
<Router>
    <Route path="/" component={App} />
    <Route path="/OAuth" component={OAuth} />
</Router>, root!)
