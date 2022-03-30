import { Alert, AlertColor } from '@mui/material'
import React, { createContext, FC, useState } from 'react'


type LoadingContextType = {
    isLoading:boolean,
    setLoading:React.Dispatch<React.SetStateAction<boolean>>
}
export const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setLoading:()=>{}
})
export const LoadingProvider: FC<{}> = ({ children }) => {
    const [isLoading, setLoading] = useState(false)
    const contextValue={isLoading,setLoading}
    return (
        <LoadingContext.Provider value={contextValue}>
            {children}
        </LoadingContext.Provider>
    )
}