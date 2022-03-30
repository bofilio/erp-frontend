import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { AuthContext } from '../../contexts'
import { useAuth } from '../../hooks/auth'

const logout = () => {
    const { authState, dispatch } = useAuth()
    const router = useRouter()
    const { currentUser } = React.useContext(AuthContext)
    useEffect(() => {
        if (currentUser === null) router.back()
        dispatch({ type: "LOGOUT" })
        router.push("/auth/login")
    }, [])
    return (
        <></>
    )
}

export default logout