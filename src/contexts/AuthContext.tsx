
import { useRouter } from 'next/router';
import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query';
import { auth_routes } from '../components/applications/auth/routes';
import { API } from '../DAL/generic';

export const USER_KEY = "current_user"

export type userProfile = {
    username: string
    email: string
    is_superuser: boolean
    is_staff: boolean
}

export type userType = {
    id?: string,
    username: string,
    token: string;
    profile?: userProfile;
}
export type CurrentUser = userType | null

type AlertContextType = {
    currentUser: CurrentUser,
    setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>
}
export const AuthContext = createContext<AlertContextType>({
    currentUser: null,
    setCurrentUser: () => { }
})



export const AuthProvider: FC<{}> = ({ children }) => {
    const router = useRouter()
    const [currentUser, setCurrentUser] = useState<CurrentUser>(getCurrentUser())
    const contextValue = useMemo(() => (
        { currentUser, setCurrentUser })
        , [currentUser])

    const { isLoading, error, data: profile,refetch } = useQuery<boolean, Error, userProfile>("userProfile", () => API.getMe({ methode: "GET" }), { retry: false, enabled: currentUser !== null })

    function getCurrentUser() {
        if (typeof (window) !== "undefined") {
            const saved_current_user = localStorage.getItem(USER_KEY)
            console.log("================="+saved_current_user);

            if (saved_current_user) {
                return JSON.parse(saved_current_user) as CurrentUser
            }
        }
        return null
    }

    console.log(currentUser);
    useEffect(() => {
        if(currentUser === null) router.push(auth_routes.login)
        else{
            localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
        }

    }, [currentUser])

    useEffect(() => {
        refetch()
        if (profile && !(currentUser?.profile)) {
            setCurrentUser(currentUser => ({ ...currentUser, profile: profile } as CurrentUser))
            localStorage.setItem(USER_KEY, JSON.stringify({ ...currentUser, profile: profile }))
        }
    }, [profile,currentUser])

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

