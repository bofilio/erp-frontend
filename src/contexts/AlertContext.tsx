import { Alert, AlertColor } from '@mui/material'
import React, { createContext, FC, useState } from 'react'

type AlertProps = {
    status?: AlertColor ,
    message: string
}
type AlertContextType = {
    alert:AlertProps|null,
    setAlert:(alert:AlertProps)=>void
}
export const AlertContext = createContext<AlertContextType>({
    alert: null,
    setAlert:()=>{}
})
export const AlertProvider: FC<{}> = ({ children }) => {
    const [alert, updateAlert] = useState({ status:"info", message: "" } as AlertProps)
    const setAlert=(alert:AlertProps)=>{
        updateAlert(alert)
    }
    const contextValue={alert,setAlert}
    return (
        <AlertContext.Provider value={contextValue}>
            {children}
        </AlertContext.Provider>
    )
}
