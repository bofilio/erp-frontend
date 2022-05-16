
import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/auth'

const logout = () => {
    const { dispatch } = useAuth()

    useEffect(() => {
        dispatch({ type: "LOGOUT" })
    }, [])
    return (
        <></>
    )
}

export default logout