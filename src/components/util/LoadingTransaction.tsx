import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react'
import { LoadingContext } from '../../contexts'

export const LoadingTransaction = () => {
    const { isLoading, setLoading } = React.useContext(LoadingContext)
    const handleClose = () => {
        setLoading(false);
      };
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
            onClick={handleClose}
        >
            <CircularProgress color="secondary" />
        </Backdrop>
    )
}
