import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserProvider } from './Context/UserContext'
import Home from './Home/Home'
import ProductListing from './ProductListing/ProductListing'
import ProductDetails from './ProductDetails/ProductDetails'
import Header from './Header/Header'
import Catalog from './Catalog/Catalog'
import Login from './Login/Login'
import Register from './Register/Register'
import Checkout from './Checkout/Checkout'
import Success from './Success/Success'
import Cart from './Cart/Cart'
import Dashboard from './Dashboard/Dashboard'
import Profile from './Profile/Profile'
import ProductManage from './ManageProducts/ProductManage'
import CustomDataGrid from './ManageProducts/test'
import Unauthorized from './Unauthorized'
import ProtectedRoute from './ProtectedRoute'
import TestAuth from './TestAuth'

export default function ApplicationRoutes() {
  return (
    <Routes>

        <Route 
        element={<Home/>} 
        path="/"
        />


        <Route
        element={
          <ProtectedRoute
          element={<ProductListing/>}
          role={"ROLE_CLIENT"}
          />
        }
        path='/listitem'
        />


        <Route 
        element={<ProductDetails/>}
        path='/product/:id'
        
        />


        <Route
        element={<Header/>}
        path='/header'
        
        />


        <Route
        element={<Catalog/>}
        path='/browse'
        />


        <Route
        element={
          <ProtectedRoute
          element={<ProductManage/>}
          role={"ROLE_CLIENT"}
          />
        }
        path='/manage'
        />


        <Route 
        element={<Login/>} 
        path="/login"
        />


        <Route 
        element={<Register/>} 
        path="/register"
        />


        <Route
        element={
          <ProtectedRoute
          element={<Checkout/>}
          role={"ROLE_CLIENT"}
          />
        }
        path='/checkout'
        />


        <Route
        element={
          <ProtectedRoute
          element={<Profile/>}
          role={"ROLE_CLIENT"}
          />
        }
        path='/profile'
        />


        <Route
        element={
          <ProtectedRoute
          element={<Cart/>}
          role={"ROLE_CLIENT"}
          />
        }
        path='/cart'
        />


        <Route
        element={
          <ProtectedRoute 
          element={<Dashboard/>} 
          role={"ROLE_CLIENT"}
          />
        }
        path='/dashboard'
        />


        <Route
        element={<Success/>}
        path='/success'
        />


        <Route
        element={<Unauthorized/>}
        path='/unauthorized'
        />


        <Route
        path='/testauth'
        element={
          <ProtectedRoute 
          element={<TestAuth/>} 
          role={"ROLE_CLIENT"}
          />
        }
        />
    </Routes>
  )
}
