import React, { useContext, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Autocomplete, Button, Checkbox, Divider, FormControlLabel, IconButton, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/lab';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API } from '../../DAL/generic';
import { CourierType } from '../../DAL/couriers/types';
import { AlertContext, LoadingContext } from '../../contexts';
import SendIcon from '@mui/icons-material/Send';
import { Attachments } from '../../components/applications/common/abstraction/attachments';
import { getSelectedValue, getSelectedValues } from '../../helpers';
import { RelatedModel } from '../../components/applications/common/abstraction/RelatedModel';
import { AddUpdateExpediteurForm } from '../../components/applications/couriers/forms';
import moment from 'moment';

type operationType = "insert" | "update"

const columns: GridColDef[] = [
  { field: 'n_enregistrement', headerName: 'N° enrig', width: 150 },
  { field: 'objet', headerName: 'Objet', width: 150 },
  { field: 'date_arrivee', headerName: 'Date arrivée', width: 150 },
];

const validationSchema = Yup.object({
  objet: Yup.string().min(10, "Objet doit etre minimum de 10 caractères").required("L'objet ne peut pas etre vide!"),
  n_enregistrement: Yup.number().min(3, "Objet doit etre minimum de 3 caractères").required("L'enrigstrement local ne peut pas etre vide!"),
  referance_exp: Yup.number().min(3, "Objet doit etre minimum de 3 caractères").required("L'enrigstrement local ne peut pas etre vide!"),
  date_arrivee: Yup.date().required("La date d'arrivée ne peut pas etre vide!"),
  date_expedition: Yup.date().required("La date d'arrivée ne peut pas etre vide!"),
  expediteur: Yup.string().required("Vous devez préciser l'expéditeur de ce courier!"),
});


const index = () => {
  const queryClient = useQueryClient()
  const { setAlert } = useContext(AlertContext)
  const COURIERS_QUERY_KEY = "couriers"
  const EXPEDITEURS_QUERY_KEY = "expediteurs"
  const TYPES_COURIERS_QUERY_KEY = "types_couriers"
  const CLASSIFICATION_QUERY_KEY = "classifications"
  const STATUS_COURIER_QUERY_KEY = "status"
  const { isLoading: courierLoading, error: couriersError, data: couriers } = useQuery(COURIERS_QUERY_KEY, () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "courier",
  }))
  const { isLoading: exp_Loading, error: exp_error, data: expediteurs } = useQuery(EXPEDITEURS_QUERY_KEY, () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "expediteur",
  }))
  const { isLoading: type_courier_Loading, error: type_courier_error, data: types_couriers } = useQuery(TYPES_COURIERS_QUERY_KEY, () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "types_courier",
  }))
  const { isLoading: classification_Loading, error: classification_error, data: classifications } = useQuery(CLASSIFICATION_QUERY_KEY, () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "classification",
  }))
  const { isLoading: statu_Loading, error: statu_error, data: status } = useQuery("status", () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "statu",
  }))

  const insertCourierMutation = useMutation((data: CourierType) => API.create_one({
    methode: "POST",
    application: "couriers",
    model: "courier",
    data: data
  }), {
    onSuccess: (data) => {
      setAlert({ status: "success", message: "le courier a été Enregisteré" })
      formik.setValues(data)
      queryClient.invalidateQueries(COURIERS_QUERY_KEY)
      setOperation("update")
    },
    onError: () => {
      setAlert({ status: "error", message: "Erreur de sauvgard du courier!" })
    }
  })
  const updateCourierMutation = useMutation((data: CourierType) => API.update_one({
    methode: "PUT",
    application: "couriers",
    model: "courier",
    params: { id: data.id },
    data: data
  }), {
    onSuccess: () => {
      setAlert({ status: "success", message: "le courier a été modifié" })
      queryClient.invalidateQueries(COURIERS_QUERY_KEY)
    },
    onError: () => {
      setAlert({ status: "error", message: "Erreur de modification du courier!" })
    }
  })
  const deleteCouriers = (id?: string) => {
    if (!id) return
    API.delete_one({
      methode: "DELETE",
      application: "couriers",
      model: "courier",
      params: {
        id: id
      }
    }).then(res => {
      setAlert({ status: "success", message: "supprimé " })
      queryClient.invalidateQueries(COURIERS_QUERY_KEY)
      formik.setValues(initialValues)
    }).catch(err => {
      setAlert({ status: "error", message: "vous ne pouvez pas supprimer ce courier, il se peut qu'il est utilisé comme réponse à un autre courier . oOu vous n'avez pas les autorisations pour le supprimer " })
    })
  }

  const [operation, setOperation] = useState("insert" as operationType)


  if (couriersError || exp_error) {
    setAlert({ status: "error", message: "erreur de communication avec le serveur!" })
  }



  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,


    onSubmit: (values: CourierType) => {
      switch (operation) {
        case "insert":
          insertCourierMutation.mutate(values)
          break;
        case "update":
          updateCourierMutation.mutate(values)
          break;
        default: break
      }
    },
  });


  const OnSelectionChange = (id: any) => {
    const selectedCourier = couriers.filter((item: any) => item.id === id)[0]
    formik.setValues(selectedCourier)
    setOperation("update")
  }
  const resetForm = () => {
    formik.resetForm()
    setOperation("insert")
  }


  return (
    <div style={{ display: "flex" }} >
      <Paper sx={{ width: "33%", margin: 1, padding: 1 }}>
        <DataGrid rows={couriers || []} columns={columns} onSelectionModelChange={(ids) => {
          ids && OnSelectionChange(ids[0])
        }} />
      </Paper>
      <Paper sx={{ width: "66%", margin: 1, padding: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="objet"
              name="objet"
              label="Objet"
              type="text"
              value={formik.values?.objet}
              onChange={formik.handleChange}
              error={formik.touched.objet && Boolean(formik.errors.objet)}
              helperText={formik.touched.objet && formik.errors.objet}
            />
            <Stack direction="row" spacing={4}>
              <TextField
                fullWidth
                id="n_enregistrement"
                name="n_enregistrement"
                label="enrigestrement local"
                type="number"
                value={formik.values?.n_enregistrement}
                onChange={formik.handleChange}
                error={formik.touched.n_enregistrement && Boolean(formik.errors.n_enregistrement)}
                helperText={formik.touched.n_enregistrement && formik.errors.n_enregistrement}
              />
              <TextField
                fullWidth
                id="referance_exp"
                name="referance_exp"
                label="Référence expéditeur"
                type="number"
                value={formik.values?.referance_exp}
                onChange={formik.handleChange}
                error={formik.touched.referance_exp && Boolean(formik.errors.referance_exp)}
                helperText={formik.touched.referance_exp && formik.errors.referance_exp}
              />
              <DatePicker
                inputFormat="dd.MM.yyyy"
                label="Date d'expédition"
                value={formik.values?.date_expedition}
                onChange={val => {
                  formik.setFieldValue("date_expedition", moment(val).format("YYYY-MM-DD"));
                  console.log(val?.getDate());

                }}
                renderInput={(params) =>
                  <TextField
                    {...params}
                    fullWidth
                    id="date_expedition"
                    name="date_expedition"
                    error={formik.touched.date_expedition && Boolean(formik.errors.date_expedition)}
                    helperText={formik.touched.date_expedition && formik.errors.date_expedition}
                  />
                }
              />
              <DatePicker
                inputFormat="dd.MM.yyyy"

                label="Date d'arrivée"
                value={formik.values?.date_arrivee}
                onChange={val => {
                  formik.setFieldValue("date_arrivee", moment(val).format("YYYY-MM-DD"));
                }}
                renderInput={(params) =>
                  <TextField
                    {...params}
                    fullWidth
                    id="date_arrivee"
                    name="date_arrivee"
                    error={formik.touched.date_arrivee && Boolean(formik.errors.date_arrivee)}
                    helperText={formik.touched.date_arrivee && formik.errors.date_arrivee}
                  />
                }
              />



            </Stack>
            {/**expediteurs */}
            <RelatedModel
              options={expediteurs}
              model="expediteur"
              label="Expediteur"
              formik={formik}
              variableName={"expediteur"}
              value={getSelectedValue(expediteurs, formik.values?.expediteur)}
              getOptionLabel={(option) => option.name}
              QUERY_KEYS={EXPEDITEURS_QUERY_KEY}
              InsertUpdateForm={<AddUpdateExpediteurForm />}
            />



            <Stack direction="row" spacing={1}>
              <div style={{ width: '25%' }}>
                <TextField
                  fullWidth
                  id="direction"
                  name="direction"
                  select
                  label="Direction"
                  value={formik.values?.direction}
                  onChange={formik.handleChange}
                  error={formik.touched.direction && Boolean(formik.errors.direction)}
                  helperText={formik.touched.direction && formik.errors.direction}
                >
                  {["arrivee", "depart", ""].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              {/**Types de courier */}
              <RelatedModel
                options={types_couriers}
                model="types_courier"
                label="Type du courier"
                formik={formik}
                variableName="type"
                value={getSelectedValue(types_couriers, formik.values?.type)}
                getOptionLabel={(option) => option.name}
                QUERY_KEYS={TYPES_COURIERS_QUERY_KEY}
                InsertUpdateForm={<AddUpdateExpediteurForm />}
              />

            </Stack>
            {/** classification */}
            <RelatedModel
              options={classifications}
              model="classification"
              label="Classification du courier"
              formik={formik}
              variableName="classification"
              value={getSelectedValue(classifications, formik.values?.classification)}
              getOptionLabel={(option) => option.name}
              QUERY_KEYS={CLASSIFICATION_QUERY_KEY}
              InsertUpdateForm={<AddUpdateExpediteurForm />}
            />
            {/** status courier (traitement) */}
            <RelatedModel
              options={status}
              model="statu"
              label="Statut du courier"
              formik={formik}
              variableName="status"
              value={getSelectedValue(status, formik.values?.status)}
              getOptionLabel={(option) => option.name}
              QUERY_KEYS={STATUS_COURIER_QUERY_KEY}
              InsertUpdateForm={<AddUpdateExpediteurForm />}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values?.exige_reponse}
                  onChange={(e) => {
                    formik.setFieldValue("exige_reponse", e.target.checked);
                  }} />
              }
              label="Exige une réponse"
            />

            {/** réponse ( c'est un courier aussi) */}
            <RelatedModel
              options={couriers}
              model="courier"
              label="Réponse"
              formik={formik}
              variableName="reponse"
              value={getSelectedValue(couriers, formik.values?.reponse)}
              getOptionLabel={(option) => option.objet}
              QUERY_KEYS={COURIERS_QUERY_KEY}
              InsertUpdateForm={<></>}
            />

            <TextField
              fullWidth
              id="instructions"
              name="instructions"
              label="instructions"
              type="text"
              value={formik.values?.instructions}
              onChange={formik.handleChange}
              error={formik.touched.instructions && Boolean(formik.errors.instructions)}
              helperText={formik.touched.instructions && formik.errors.instructions}
            />

            {/** destinataires (expediteurs) */}
            <RelatedModel
              multiple
              options={expediteurs}
              model="expediteur"
              label="Destinataires"
              formik={formik}
              variableName="destinataires"
              value={getSelectedValues(expediteurs, formik.values?.destinataires)}
              getOptionLabel={(option) => option.name}
              QUERY_KEYS={EXPEDITEURS_QUERY_KEY}
              InsertUpdateForm={<AddUpdateExpediteurForm />}
            />
            {/** visible à  (expediteurs) */}
            <RelatedModel
              multiple
              options={expediteurs}
              model="expediteur"
              label="Visible à"
              formik={formik}
              variableName="visible_a"
              value={getSelectedValues(expediteurs, formik.values?.visible_a)}
              getOptionLabel={(option) => option.name}
              QUERY_KEYS={EXPEDITEURS_QUERY_KEY}
              InsertUpdateForm={<AddUpdateExpediteurForm />}
            />

            <Divider />
            <div>
              {formik.values?.id && <Attachments model='attachment' id_parent={formik.values?.id} />}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button color="success" variant="contained" type="submit">
                  Enregistrer
                </Button>
                {formik.values?.id &&
                  <>
                    <Button color="primary" variant="contained" endIcon={<SendIcon />} >
                      Envoyer par Mail
                    </Button>

                    <Button color="error" variant="contained" onClick={() => deleteCouriers(formik.values?.id)}>
                      Supprimer
                    </Button>
                  </>
                }
              </div>
              {formik.values?.id &&
                <div>
                  <Button color="info" variant="contained" onClick={() => resetForm()}>
                    Nouveau
                  </Button>
                </div>
              }
            </div>

          </Stack>

        </form>
      </Paper>
    </div>

  )
}

export default index


const initialValues: CourierType = {
  objet: "",
  direction: "",
  n_enregistrement: "",
  referance_exp: "",
  date_arrivee: null,
  date_expedition: null,
  expediteur: "",
  type: "",
  classification: "",
  exige_reponse: false,
  reponse: "",
  instructions: "",
  status: "",
  destinataires: null,
  visible_a: null,
}