import React from 'react'

import {Navbar} from './components'
import Routes from './routes'

// import {MiniDrawer} from './components/NavbarWithPersistentDrawer'
// import {NavbarWithPersistentDrawer, NavbarWithTempDrawer} from './components'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  )
}

export default App
