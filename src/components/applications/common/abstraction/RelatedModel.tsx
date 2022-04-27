import { Autocomplete, Box, Button, DialogActions, DialogTitle, IconButton, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { API } from '../../../../DAL/generic';
import { useQueryClient } from 'react-query';
import { CloseModal, ModalProvider, MyModal, OpenModal } from '../../../../contexts/ModalContext';
import { AlertContext } from '../../../../contexts';
import { AddModelInstance, UpdateModelInstance } from './add_update_model';
import { ConfirmeDeletion } from '../../../util';
import { applicationType, modelType } from '../../../../DAL/types';

type RelatedModelProps = {
    formik: any;
    options: any;
    multiple?: boolean;
    label: string;
    value: any;
    variableName: string;
    appliation: applicationType;
    model: modelType;
    getOptionLabel: (option: any) => string;
    QUERY_KEYS: string;
    InsertUpdateForm?: JSX.Element;
}
export const RelatedModel: React.FC<RelatedModelProps> = (props) => {
    const { formik, options, multiple = false, label, value, variableName, appliation, model, getOptionLabel, QUERY_KEYS, InsertUpdateForm } = props
    const [queryHasChanged, setQueryHasChanged] = useState(false)
    const queryClient = useQueryClient()
    const { setAlert } = useContext(AlertContext)
    const deleteInstance = (id: any) => {
        API.delete_one({
            methode: "DELETE",
            application: appliation,
            model: model,
            params: {
                id: id
            }
        }).then(res => {
            setQueryHasChanged(true)
            setAlert({ status: "success", message: "supprimé " })
        }).catch(err => {
            setAlert({ status: "error", message: "Erreur de supprission " })
        })
    }
    useEffect(() => {
        if (queryHasChanged) {
            queryClient.invalidateQueries(QUERY_KEYS)
            setQueryHasChanged(false)
        }
    }, [queryHasChanged === true])

    return (
        <>
            {options &&
                <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
                    <Autocomplete
                        multiple={multiple}
                        disablePortal
                        id={`combo-box-${variableName}`}
                        options={options}
                        sx={{ flexGrow: 1 }}
                        getOptionLabel={getOptionLabel}
                        value={value}
                        onChange={(e, vals: any) => formik.setFieldValue(variableName, multiple ?vals?.map((val: any) => val.id) : vals?.id || null)}
                        onBlur={formik.handleBlur}
                        renderInput={
                            (params: any) =>
                                <TextField
                                    label={label}
                                    fullWidth
                                    {...params}
                                    error={formik.touched[variableName] && Boolean(formik.errors[variableName])}
                                    helperText={formik.touched[variableName] && formik.errors[variableName]}
                                />
                        }
                    />
                    {InsertUpdateForm &&
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {/**add instance */}
                            <ModalProvider>
                                <OpenModal>
                                    <IconButton>
                                        <AddOutlinedIcon color='secondary' />
                                    </IconButton>
                                </OpenModal>
                                <MyModal>
                                    <AddModelInstance
                                        onceDone={() => setQueryHasChanged(true)}
                                        application={appliation}
                                        model={model}
                                        formComponent={InsertUpdateForm}
                                    />
                                </MyModal>

                            </ModalProvider>
                            {/**update instance */}
                            {value && !multiple &&
                                <>
                                    {/**update icon */}
                                    <ModalProvider>
                                        <OpenModal>
                                            <IconButton>
                                                <AutoFixNormalOutlinedIcon color='primary' />
                                            </IconButton>
                                        </OpenModal>
                                        <MyModal>
                                            <UpdateModelInstance
                                                value={value}
                                                onceDone={() => setQueryHasChanged(true)}
                                                application={appliation}
                                                model={model}
                                                formComponent={InsertUpdateForm}
                                            />
                                        </MyModal>
                                    </ModalProvider>

                                    {/**delete icon with confirmation context */}
                                    <ConfirmeDeletion doDelete={() => deleteInstance(value?.id)}>
                                        <IconButton>
                                            <HighlightOffIcon color='error' />
                                        </IconButton>
                                    </ConfirmeDeletion>
                                </>

                            }
                        </div>
                    }

                </Stack>
            }

        </>
    )
}
