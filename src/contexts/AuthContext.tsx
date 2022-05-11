
import React, { createContext, FC, useEffect, useState } from 'react'
import { API } from '../DAL/generic';

export const USER_KEY="current_user"
export type userType = {
    id?: string,
    username: string,
    token:string;
    profile:any;
}
export type CurrentUser=userType|null

type AlertContextType = {
    currentUser: CurrentUser,
    setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>
}
export const AuthContext = createContext<AlertContextType>({
    currentUser: null,
    setCurrentUser: () => { }
})


export const AuthProvider: FC<{}> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null as CurrentUser)
    const contextValue = { currentUser, setCurrentUser }

    
    useEffect(()=>{
        const saved_current_user:string|null=localStorage.getItem(USER_KEY)
        if (saved_current_user!=null){
            setCurrentUser(JSON.parse(saved_current_user))
        } 
        
    },[])

    useEffect(()=>{

        if(currentUser!=null){
            localStorage.setItem(USER_KEY,JSON.stringify(currentUser)) 
        }
        else{
           localStorage.removeItem(USER_KEY) 
        }  
    },[currentUser])
   
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

