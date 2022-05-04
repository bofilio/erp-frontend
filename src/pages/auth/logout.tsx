import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { auth_routes } from '../../components/applications/auth/routes'
import { AuthContext } from '../../contexts'
import { useAuth } from '../../hooks/auth'

const logout = () => {
    const { authState, dispatch } = useAuth()
    const router = useRouter()
    const { currentUser } = React.useContext(AuthContext)
    useEffect(() => {
        if (currentUser === null) router.push(auth_routes.login)
        dispatch({ type: "LOGOUT" })
        router.push(auth_routes.login)
    }, [])
    return (
        <></>
    )
}

export default logout