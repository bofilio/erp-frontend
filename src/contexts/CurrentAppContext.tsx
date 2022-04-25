import { Alert, AlertColor } from '@mui/material'
import React, { createContext, FC, useMemo, useState } from 'react'
import { applicationType } from '../DAL/types'

type currentAppType= applicationType |null
type AlertContextType = {
    currentApp:currentAppType,
    setCurrentApp:(app:currentAppType)=>void
}
export const CurrentAppContext = createContext<AlertContextType>({
    currentApp: null,
    setCurrentApp:()=>{}
})
export const CurrentAppProvider: FC<{}> = ({ children }) => {
    const [currentApp, updateApp] = useState(null as currentAppType)
    const setCurrentApp=(app:currentAppType)=>{
        updateApp(app)
    }
    const contextValue= useMemo(()=>({currentApp,setCurrentApp}),[currentApp])
    return (
        <CurrentAppContext.Provider value={contextValue}>
            {children}
        </CurrentAppContext.Provider>
    )
}