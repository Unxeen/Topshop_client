import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Success() {

    const [time, setTime] = useState(3)

    const navigate = useNavigate()

    useEffect(() => {
        let timer = setInterval(() => {
            if(time <= 0) navigate('/')
            setTime(time - 1)
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    })

    return (
        <h2>
            Payment success, redirecting in {time}s
        </h2>
    )
}
