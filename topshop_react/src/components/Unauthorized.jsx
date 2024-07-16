import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {

    const [timer, setTimer] = useState(3)
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            if (timer > 0) {
                setTimer(prev => {
                    return prev - 1
                })
            } else{
                navigate('/', {replace: true})
            }
        }, 1000);
    }, [timer])

    return (
        <div>
        <h1>Unauthorized access, please login!</h1>
        <h3>Redirecting in {timer}s</h3>
        </div>
    )
}
