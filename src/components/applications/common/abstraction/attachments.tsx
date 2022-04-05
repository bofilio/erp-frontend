import { Avatar, Box, Button, Card, DialogActions, IconButton, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { API } from '../../../../DAL/generic'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CloseModal, ModalContext, ModalProvider, MyModal, OpenModal } from '../../../../contexts/ModalContext';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { modelType } from '../../../../DAL/common/query';
import { AddModelInstance, UpdateModelInstance } from './add_update_model';
import { AddUpdateAttchmentForm } from '../../couriers/forms/AddUpdateAttchmentForm';
import { AlertContext } from '../../../../contexts';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ConfirmeDeletion } from '../../../util';



type AttachmentProps = {
    id_parent: string;
    model: modelType
}

export const Attachments = (props: AttachmentProps) => {
    const [queryHasChanged, setQueryHasChanged] = useState(false)
    const { setAlert } = useContext(AlertContext)
    const { id_parent, model } = props
    const ATTACHMENTS_QUERY_KEYS = `${id_parent}_attchments`
    const queryClient = useQueryClient()
    const { isLoading, error, data: attchements } = useQuery(ATTACHMENTS_QUERY_KEYS, () => API.filter({
        methode: "GET",
        application: "couriers",
        model: model,
        params: {
            id_parent: id_parent
        }
    }))

    const deleteAttachment = (id: any) => {
        API.delete_one({
            methode: "DELETE",
            application: "couriers",
            model: model,
            params: {
                id: id
            }
        }).then(res => {
            setQueryHasChanged(true)
            setAlert({ status: "success", message: "fichier supprimé" })
        }).catch(err => {
            setAlert({ status: "error", message: "erreur de supprission" })
        })
    }

    useEffect(() => {
        if (queryHasChanged) {
            queryClient.invalidateQueries(ATTACHMENTS_QUERY_KEYS)
            setQueryHasChanged(false)
        }
    }, [queryHasChanged === true])

    return (
        <>
            <Typography variant='body1'>
                Fichiers attachés:
            </Typography>

            {!attchements?.length ?
                <div style={{ padding: "0.5rem" }}>
                    <Typography variant='caption' sx={{}}> Pas de fichiers attachés à ce couriers</Typography>
                </div>

                :
                <Stack gap={1} sx={{ marginBottom: 1 }} >
                    {
                        attchements.map((file: any) => (
                            <Card key={file.id}>
                                <ListItem
                                    secondaryAction={
                                        <Stack direction={"row"} gap={2}>
                                            <a href={file.file} target="_blank">
                                                <IconButton edge="end" aria-label="delete">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </a>
                                            {/**update attachement */}
                                            <ModalProvider>
                                                <OpenModal>
                                                    <IconButton edge="end" aria-label="delete" >
                                                        <AutoFixNormalOutlinedIcon color='secondary' />
                                                    </IconButton>
                                                </OpenModal>
                                                <MyModal>
                                                    <UpdateModelInstance
                                                        value={file}
                                                        onceDone={() => setQueryHasChanged(true)}
                                                        model={model}
                                                        formComponent={<AddUpdateAttchmentForm />}
                                                        extra_headers={{ 'Content-Type': 'multipart/form-data' }}
                                                    />
                                                </MyModal>
                                            </ModalProvider>


                                            {/**delete ibuttun with confirmation context */}
                                            <ConfirmeDeletion doDelete={() => deleteAttachment(file.id)}>
                                                <IconButton>
                                                    <HighlightOffIcon color='error' />
                                                </IconButton>
                                            </ConfirmeDeletion>

                                        </Stack>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FilePresentIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={file.name || file.file}
                                    />
                                </ListItem>
                            </Card>
                        ))
                    }
                </Stack>

            }
            <ModalProvider>
                <OpenModal>
                    <Button variant='outlined' fullWidth sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        Ajouter <AttachmentIcon fontSize="small" />
                    </Button>
                </OpenModal>
                <MyModal>
                    <AddModelInstance
                        onceDone={() => setQueryHasChanged(true)}
                        model={model}
                        formComponent={<AddUpdateAttchmentForm id_parent={id_parent} />}
                        extra_headers={{ 'Content-Type': 'multipart/form-data' }}
                    />
                </MyModal>
            </ModalProvider>
        </>
    )
}




