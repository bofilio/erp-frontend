import { Box, Button, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useContext } from 'react'
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import { ModalContext } from '../../../../contexts/ModalContext';
import { API } from '../../../../DAL/generic';
import { getSelectedValue } from '../../../../helpers';
import { RelatedModel } from '../../common/abstraction/RelatedModel';
import { AddUpdateFormProps } from './types';

const validationSchema = Yup.object().shape({
    'structure': Yup.string().when("employe", (employe: string): any => {
        if (employe)
            return Yup.string().nullable(true).max(0,"Selctionner Structure ou employe , pas les deux")
        return Yup.string().required("Selctionner Structure ou employe")
    }),
    'employe': Yup.string().when("structure", (structure: string): any => {
        if (structure)
            return Yup.string().nullable(true).max(0,"Selctionner Structure ou employe , pas les deux")
        return Yup.string().required("Selctionner Structure ou employe")
    })
}, [['structure', 'employe']])


type ExpediteurType = {
    id?: string,
    structure: string,
    employe: string,
}

export const AddUpdateExpediteurForm: React.FC<AddUpdateFormProps> = (props) => {
    const { value, operation, insertMutation, updateMutation } = props
    const { toggleModal } = useContext(ModalContext)
    const STRUCTURES_QUERY_KEY = "structures"
    const EMPLOYE_QUERY_KEY = "employes"
    const { isLoading: structureLoading, error: structuresError, data: structures } = useQuery<boolean, Error, any[]>(STRUCTURES_QUERY_KEY, () => API.get_all({
        methode: "GET",
        application: "grh",
        model: "structure",
    }), { retry: false })

    const { isLoading: employeLoading, error: employeError, data: employes } = useQuery<boolean, Error, any[]>(EMPLOYE_QUERY_KEY, () => API.get_all({
        methode: "GET",
        application: "grh",
        model: "employe",
    }), { retry: false })

    const formik = useFormik({
        initialValues: value || {
            structure: "",
            employe: "",
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values: ExpediteurType) => {
            console.log(values);
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
                    <RelatedModel
                        options={structures}
                        appliation="grh"
                        model="structure"
                        label="Structure"
                        formik={formik}
                        variableName={"structure"}
                        value={getSelectedValue(structures, formik.values?.structure)}
                        getOptionLabel={(option) => option.lebel}
                        QUERY_KEYS={STRUCTURES_QUERY_KEY}

                    />
                    <div style={{ alignSelf: "center" }}>OU</div>
                    <RelatedModel
                        options={employes}
                        appliation="grh"
                        model="employe"
                        label="Employe"
                        formik={formik}
                        variableName={"employe"}
                        value={getSelectedValue(employes, formik.values?.employe)}
                        getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                        QUERY_KEYS={EMPLOYE_QUERY_KEY}

                    />

                    <Button color="success" variant="contained" type="submit">
                        save
                    </Button>
                </Stack>
            </form>
        </Box>
    )
}
