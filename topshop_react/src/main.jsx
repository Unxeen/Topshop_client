import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { NavigationProvider } from './components/Context/NavigationContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <HashRouter>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </HashRouter>
  // </React.StrictMode>,
)
