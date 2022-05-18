import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useContext } from 'react'
import * as Yup from 'yup';
import { ModalContext } from '../../../../contexts/ModalContext';
import { useScaner } from '../../../../hooks/useScaner';
import { AddUpdateFormProps } from './types';
import { blue } from '@mui/material/colors';
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
    const { scan, file } = useScaner()
    const formik = useFormik({
        initialValues: value || {
            name: "",
            file: null,
            courier: id_parent
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values: Attachmenttype) => {
            let formData = new FormData();
            if (file != null) {
                formData.append("file", file);
                formData.append("name", file?.name);
            }
            else{
                formData.append("file", values.file);
            }
                

            formData.append("name", values.file?.name || file?.name);
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
                    <Stack direction="row" spacing={3} alignItems='center'>
                        <label htmlFor="contained-button-file">
                            <input
                                style={{ display: 'none' }}
                                onChange={event => {
                                    formik.setFieldValue("file", event.currentTarget.files?.item(0));
                                }}
                                accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                            text/plain, application/pdf, image/*"
                                id="contained-button-file"
                                multiple
                                type="file"
                            />
                            <Button variant="contained" component="span">
                                Upload
                            </Button>
                        </label>
                        <Button variant="contained" color='info' onClick={scan} component="span">
                            Scan
                        </Button>
                    </Stack>
                    <Typography variant="body2" color='secondary'>
                        {formik.values.file?.name}
                        {file?.name}
                        {value?.name}
                    </Typography>
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
