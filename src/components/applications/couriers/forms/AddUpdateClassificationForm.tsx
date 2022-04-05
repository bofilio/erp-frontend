import { Box, Button, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useContext } from 'react'
import * as Yup from 'yup';
import { ModalContext } from '../../../../contexts/ModalContext';
import { AddUpdateFormProps } from './types';

const validationSchema = Yup.object({
    name: Yup.string().required("saisir le nom de la classification"),
});

type ClassificationType = {
    id?: string,
    name: string,
}

export const AddUpdateClassificationForm:React.FC<AddUpdateFormProps> = (props) => {
    const {value,operation,insertMutation,updateMutation}=props
    const { toggleModal } = useContext(ModalContext)
    const formik = useFormik({
        initialValues: value || {
            name: "",
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values: ClassificationType) => {

            switch (operation) {
                case "insert":
                    insertMutation.mutate(values)
                    break;
                case "update":
                    updateMutation.mutate(values)
                    break
                default: break
            }

            toggleModal(false)
        },
    });

    return (
        <Box sx={{ width: '100%', padding: 4 }}>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Classification"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <Button color="success" variant="contained" type="submit">
                        save
                    </Button>
                </Stack>
            </form>
        </Box>
    )
}
