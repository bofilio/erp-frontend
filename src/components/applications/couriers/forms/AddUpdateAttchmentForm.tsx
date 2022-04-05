import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useContext } from 'react'
import * as Yup from 'yup';
import { ModalContext } from '../../../../contexts/ModalContext';
import { AddUpdateFormProps } from './types';

const validationSchema = Yup.object({
    /* file: Yup.object().test("FileSize", "La taille du fichier doit etre < 20Mo", (value) => {
         return value.size <= 2000000
     }),*/
});
type Attachmenttype = {
    id?: string,
    name: string,
    file: any,
    courier: string,
}
export const AddUpdateAttchmentForm: React.FC<AddUpdateFormProps> = (props) => {
    const { value, id_parent, operation, insertMutation, updateMutation } = props
    const { toggleModal } = useContext(ModalContext)
    const formik = useFormik({
        initialValues:value || {
            name: "",
            file: null,
            courier: id_parent
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values: Attachmenttype) => {
            var formData = new FormData();
            formData.append("file", values.file);
            formData.append("name", values.file?.name || values.name);
            formData.append("courier", values.courier);
            
            switch (operation) {
                case "insert":
                    insertMutation.mutate(formData)
                    break;
                case "update":
                    updateMutation.mutate(formData)
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
                    <label htmlFor="contained-button-file">

                        <input
                            style={{ display:'none' }}
                            onChange={event => {
                                formik.setFieldValue("file", event.currentTarget.files?.item(0));
                            }}
                            accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                            text/plain, application/pdf, image/*"
                            id="contained-button-file"
                            multiple
                            type="file"
                        />


                        <Stack direction="row" gap={1} alignItems='center'>
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                            <Typography variant="body2" color='secondary'>
                                {formik.values.file?.name}
                            </Typography>
                        </Stack>

                    </label>
                    <Typography variant="caption" color="error">
                        {formik.touched.file && formik.errors.file}
                    </Typography>
                    <Button color="success" variant="contained" type="submit">
                        save
                    </Button>
                </Stack>
            </form>
        </Box>
    )
}
