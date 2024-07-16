import React from 'react';
import './App.css'
import { UserProvider } from './components/Context/UserContext'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ApplicationRoutes from './components/ApplicationRoutes'
import { CartProvider } from './components/Context/CartContext'


function App() {
  

  


  return (
    <>
    <UserProvider>
      <CartProvider>
        <ApplicationRoutes/>
      </CartProvider>
    </UserProvider>
    </>
  )
}

export default App
