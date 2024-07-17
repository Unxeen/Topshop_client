import React, { useState } from 'react'
import { useUser } from './Context/UserContext'
import { Navigate, Route, useNavigate } from 'react-router-dom'

export default function ProtectedRoute({role, element}) {

    const [user, setUser] = useUser()
    // const navigate = useNavigate()

    if (!user) {
        // navigate('/login')
        return <Navigate to={'/login'} replace/>
    }

    if (user && user.roles && !user.roles.includes(role)) {
        // navigate('/unauthorized')
        return <Navigate to={'/unauthorized'} replace/>
    }

    return element
}
