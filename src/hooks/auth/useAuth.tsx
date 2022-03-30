import React, { useContext, useReducer, useState } from 'react'
import { AuthContext, LoadingContext } from '../../contexts'
import { API } from '../../DAL/generic'

type AuthStateType = {
    isLoading: boolean,
    data: any,
    error: string | null
}
export type ActionType = {
    type: "LOGIN" | "LOGOUT",
    payload?: any
}

export const useAuth = () => {
    const {currentUser,setCurrentUser}=useContext(AuthContext)
    const [authState, setAuthState] = useState({ isLoading: false, data: null, error: null } as AuthStateType)
    
    
    function dispatch(action: ActionType): void {
        const { type, payload } = action
        setAuthState({ isLoading: true, data: null, error: null })
        switch (type) {
            case "LOGIN":
                API.login({
                    url: `/auth/jwt/create/`, methode: "POST", protected: false,
                    data:
                    {
                        username: payload.username,
                        password: payload.password
                    }
                }).then(res => {
                    setAuthState({ isLoading: false, data: res.data, error: null })
                    setCurrentUser({
                        username:payload.username,
                        token:res.data.access,
                    })
                }).catch(err => {
                    setAuthState({ isLoading: false, data: null, error: err.message })
                })
                break;
            case "LOGOUT":
                setCurrentUser(null)
                setAuthState({ isLoading: false, data: null, error: null })
                break;
            default: return
        }
        console.log(authState);
    }
    return { authState, dispatch }

}

