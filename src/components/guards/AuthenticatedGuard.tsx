import { useRouter } from 'next/router'
import React, { FC, useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts'
import { auth_routes } from '../applications/auth/routes'

export const AuthenticatedGuard: FC<{}> = (props) => {
    const router = useRouter()
    const { children } = props
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
