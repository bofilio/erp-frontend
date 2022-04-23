import { Box, Dialog, Modal } from '@mui/material'
import React, { createContext, useContext, useState } from 'react'

type ModalType = {
    isopen: boolean,
    toggleModal: (val: boolean) => void
}
export const ModalContext = createContext<ModalType>({
    isopen: false,
    toggleModal: () => { }
})

export const ModalProvider: React.FC<{}> = ({ children }) => {
    const [isopen, setOpen] = useState(false)
    const toggleModal = (val: boolean) => {
        setOpen(val)
    }
    const contextVal = { isopen, toggleModal }

    return (
        <ModalContext.Provider value={contextVal}>
            {children}
        </ModalContext.Provider>
    )
}

export const MyModal: React.FC<{}> = ({ children }) => {
    const { isopen, toggleModal } = useContext(ModalContext)
    return (

        <Dialog
            open={isopen}
            onClose={() => toggleModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            fullWidth
        >
            {children}
        </Dialog>


    )

}

export const OpenModal: React.FC<{}> = ({ children }) => {
    const { toggleModal } = useContext(ModalContext)
    return (
        <div onClick={() => toggleModal(true)} >
            {children}
        </div>
    )
}
export const CloseModal: React.FC<{}> = ({ children }) => {
    const { toggleModal } = useContext(ModalContext)
    return (
        <div onClick={() => toggleModal(false)}>
            {children}
        </div>
    )
}