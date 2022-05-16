import { useRouter } from 'next/router'
import React, { FC, useContext, useEffect } from 'react'
import { AuthContext, USER_KEY } from '../../contexts'
import { auth_routes } from '../applications/auth/routes'

export const AuthenticatedGuard: FC = (props) => {
    const { children } = props
    const router = useRouter()
    const { currentUser } = useContext(AuthContext) 
    
    useEffect(()=>{
        if(currentUser===null) router.push(auth_routes.login)
    },[currentUser])
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
