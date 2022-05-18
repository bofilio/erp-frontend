import { Backdrop, Box, CircularProgress } from '@mui/material';
import React from 'react'
import { LoadingContext } from '../../contexts'

export const LoadingTransaction = () => {
    const { isLoading, setLoading } = React.useContext(LoadingContext)
    const handleClose = () => {
        setLoading(false);
    };
    if (!isLoading) return <></>
    return (
        <Box sx={{position: "fixed",width:"100%", height:"100%", top:0, left:0}}>
                <CircularProgress color="secondary" />
        </Box>

    )
}
