import { Box,Typography,Button, DialogActions } from '@mui/material'
import React from 'react'
import { MyModal, OpenModal,ModalProvider,CloseModal } from '../../contexts/ModalContext'

type DeleteConfirmationProps={
    doDelete:any
}
export const ConfirmeDeletion: React.FC<DeleteConfirmationProps> = ({ doDelete,children }) => {
    return (
        <ModalProvider>
            <OpenModal>
                {children}
            </OpenModal>
            <MyModal>
                <Box sx={{ padding: 3 }}>
                    <Typography variant='body1' color="info" >
                        {"Voulez-vous confermer la suppression cette instance?"}
                    </Typography>
                    <DialogActions>
                        <CloseModal>
                            <Button>Annuler</Button>
                        </CloseModal>
                        <Button color="error" onClick={doDelete}>Oui Supprimer</Button>
                    </DialogActions>
                </Box>

            </MyModal>
        </ModalProvider>
    )
}
