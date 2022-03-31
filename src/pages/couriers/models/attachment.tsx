import { Avatar, Card, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { API } from '../../../DAL/generic'
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

type AttachmentProps = {
    id_courier: string
}

export const Attachments = (props: AttachmentProps) => {
    const { id_courier } = props
    const queryClient = useQueryClient()
    const { isLoading, error, data: attchments } = useQuery("attchments", () => API.filter({
        methode: "GET",
        application: "couriers",
        model: "attachment",
        params: {
            id_courier: id_courier
        }
    }))
    return (
        <>
            <Typography variant='body1'>
                Fichiers attachés:
            </Typography>

            {attchments &&
                <Stack gap={1} >
                    {
                        attchments.map((file: any) => (
                            <Card key={file.id}>
                                <ListItem
                                    secondaryAction={
                                        <Stack direction={"row"} gap={2}>
                                            <a href={file.file} target="_blank">
                                                <IconButton edge="end" aria-label="delete">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </a>

                                            <IconButton edge="end" aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>

                                        </Stack>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={file.file}
                                    />
                                </ListItem>
                            </Card>
                        ))
                    }
                </Stack>
            }


        </>
    )
}
