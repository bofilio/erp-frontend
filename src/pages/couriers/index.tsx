import React, { useContext, useState } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Autocomplete, Button, Checkbox, Divider, FormControlLabel, IconButton, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/lab';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API } from '../../DAL/generic';
import { CourierType } from '../../DAL/couriers/types';
import { AlertContext, LoadingContext } from '../../contexts';
import SendIcon from '@mui/icons-material/Send';
import { Attachments } from './models/attachment';

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
  const { isLoading: courierLoading, error: couriersError, data: couriers } = useQuery("couriers", () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "courier",
  }))
  const { isLoading: exp_Loading, error: exp_error, data: expediteurs } = useQuery("expediteurs", () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "expediteur",
  }))
  const { isLoading: type_courier_Loading, error: type_courier_error, data: types_couriers } = useQuery("types_couriers", () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "types_courier",
  }))
  const { isLoading: classification_Loading, error: classification_error, data: classifications } = useQuery("classifications", () => API.get_all({
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
  }))
  const updateCourierMutation = useMutation((data: CourierType) => API.update_one({
    methode: "PUT",
    application: "couriers",
    model: "courier",
    params: { id: data.id },
    data: data
  }))

  const [operation, setOperation] = useState("insert" as operationType)


  const { setAlert } = useContext(AlertContext)
  if (couriersError || exp_error) {
    setAlert({ status: "error", message: "erreur de communication avec le serveur!" })
  }



  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values: CourierType) => {
      console.log(values);
      switch (operation) {
        case "insert":
          insertCourierMutation.mutate(values)
          break;
        case "update":
          updateCourierMutation.mutate(values)
          break
        default: break
      }
      queryClient.refetchQueries("couriers")

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
  const getSelectedValue = (options: any, value: any) => {
    if (value && options) {
      return options.filter((option: any) => option.id === value)[0]
    }
    else return null
  }
  const getSelectedValues = (options: any, values: any) => {
    if (values && options) {
      return options.filter((option: any) => values.includes(option.id))
    }
    else return []
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
              value={formik.values.objet}
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
                value={formik.values.n_enregistrement}
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
                value={formik.values.referance_exp}
                onChange={formik.handleChange}
                error={formik.touched.referance_exp && Boolean(formik.errors.referance_exp)}
                helperText={formik.touched.referance_exp && formik.errors.referance_exp}
              />
              <DatePicker

                label="Date d'expédition"
                value={formik.values.date_expedition}
                onChange={val => {
                  formik.setFieldValue("date_expedition", val);
                  console.log(val);

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
                label="Date d'arrivée"
                value={formik.values.date_arrivee}
                onChange={val => {
                  formik.setFieldValue("date_arrivee", val);
                  console.log(val);

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

            {expediteurs &&

              <Stack direction="row" spacing={1}>
                <Autocomplete
                  disablePortal
                  id="combo-box-expediteur"
                  options={expediteurs}
                  sx={{ flexGrow: 1 }}
                  getOptionLabel={(option) => option.name}
                  value={getSelectedValue(expediteurs, formik.values.expediteur)}
                  onChange={(e, val: any) => formik.setFieldValue("expediteur", val?.id || null)}
                  onBlur={formik.handleBlur}
                  renderInput={
                    (params: any) =>
                      <TextField
                        label="Expediteur"
                        fullWidth
                        {...params}
                        error={formik.touched.expediteur && Boolean(formik.errors.expediteur)}
                        helperText={formik.touched.expediteur && formik.errors.expediteur}
                      />
                  }
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton>
                    <AddOutlinedIcon color='primary' />
                  </IconButton>
                  <IconButton>
                    <AutoFixNormalOutlinedIcon color='secondary' />
                  </IconButton>
                </div>
              </Stack>
            }


            <Stack direction="row" spacing={1}>
              <div style={{ width: '25%' }}>
                <TextField
                  fullWidth
                  id="direction"
                  name="direction"
                  select
                  label="Direction"
                  value={formik.values.direction}
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
              {types_couriers &&
                <Stack direction="row" sx={{flexGrow:1}}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-type"
                    options={types_couriers}
                    sx={{ flexGrow: 1 }}
                    getOptionLabel={(option) => option.name}
                    value={getSelectedValue(types_couriers, formik.values.type)}
                    onChange={(e, val) => formik.setFieldValue("type", val?.id || null)}
                    onBlur={formik.handleBlur}
                    renderInput={
                      (params: any) =>
                        <TextField
                          label="type"
                          fullWidth
                          {...params}
                          error={formik.touched.type && Boolean(formik.errors.type)}
                          helperText={formik.touched.type && formik.errors.type}
                        />
                    }
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton>
                      <AddOutlinedIcon color='primary' />
                    </IconButton>
                    <IconButton>
                      <AutoFixNormalOutlinedIcon color='secondary' />
                    </IconButton>
                  </div>
                </Stack>
              }

            </Stack>

            {classifications &&
              <Stack direction="row" spacing={1}>
                <Autocomplete
                  disablePortal
                  id="combo-box-classification"
                  options={classifications}
                  sx={{ flexGrow: 1 }}
                  getOptionLabel={(option) => option.name}
                  value={getSelectedValue(classifications, formik.values.classification)}
                  onChange={(e, val) => formik.setFieldValue("classification", val?.id || null)}
                  onBlur={formik.handleBlur}
                  renderInput={
                    (params: any) =>
                      <TextField
                        label="Classification"
                        fullWidth
                        {...params}
                        error={formik.touched.classification && Boolean(formik.errors.classification)}
                        helperText={formik.touched.classification && formik.errors.classification}
                      />
                  }
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton>
                    <AddOutlinedIcon color='primary' />
                  </IconButton>
                  <IconButton>
                    <AutoFixNormalOutlinedIcon color='secondary' />
                  </IconButton>
                </div>
              </Stack>
            }
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.exige_reponse}
                  onChange={(e) => {
                    formik.setFieldValue("exige_reponse", e.target.checked);
                  }} />
              }
              label="Exige une réponse"
            />
            {couriers &&
              <Stack direction="row" spacing={1}>
                <Autocomplete
                  disablePortal
                  id="combo-box-reponse"
                  options={couriers}
                  sx={{ flexGrow: 1 }}
                  getOptionLabel={(option) => option.objet}
                  value={getSelectedValue(couriers, formik.values.reponse)}
                  onChange={(e, val) => formik.setFieldValue("reponse", val?.id || null)}
                  onBlur={formik.handleBlur}
                  renderInput={
                    (params: any) =>
                      <TextField
                        label="reponse"
                        fullWidth
                        {...params}
                        error={formik.touched.reponse && Boolean(formik.errors.reponse)}
                        helperText={formik.touched.reponse && formik.errors.reponse}
                      />
                  }
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton>
                    <AddOutlinedIcon color='primary' />
                  </IconButton>
                  <IconButton>
                    <AutoFixNormalOutlinedIcon color='secondary' />
                  </IconButton>
                </div>
              </Stack>
            }
            <TextField
              fullWidth
              id="instructions"
              name="instructions"
              label="instructions"
              type="text"
              value={formik.values.instructions}
              onChange={formik.handleChange}
              error={formik.touched.instructions && Boolean(formik.errors.instructions)}
              helperText={formik.touched.instructions && formik.errors.instructions}
            />
            {status &&
              <Stack direction="row" spacing={1}>
                <Autocomplete
                  disablePortal
                  id="combo-box-status"
                  options={status}
                  sx={{ flexGrow: 1 }}
                  getOptionLabel={(option) => option.name}
                  value={getSelectedValue(status, formik.values.status)}
                  onChange={(e, val) => formik.setFieldValue("status", val?.id || null)}
                  onBlur={formik.handleBlur}
                  renderInput={
                    (params: any) =>
                      <TextField
                        label="status"
                        fullWidth
                        {...params}
                        error={formik.touched.status && Boolean(formik.errors.status)}
                        helperText={formik.touched.status && formik.errors.status}
                      />
                  }
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton>
                    <AddOutlinedIcon color='primary' />
                  </IconButton>
                  <IconButton>
                    <AutoFixNormalOutlinedIcon color='secondary' />
                  </IconButton>
                </div>
              </Stack>
            }
            {expediteurs &&
              <Stack direction="row" spacing={1}>
                <Autocomplete
                  multiple
                  disablePortal
                  id="combo-box-destinataires"
                  options={expediteurs}
                  sx={{ flexGrow: 1 }}
                  getOptionLabel={(option) => option.name}
                  value={getSelectedValues(expediteurs, formik.values.destinataires)}
                  onChange={(e, vals) => formik.setFieldValue("destinataires", vals?.map(val => val.id) || null)}
                  onBlur={formik.handleBlur}
                  renderInput={
                    (params: any) =>
                      <TextField
                        label="destinataires"
                        fullWidth
                        {...params}
                        error={formik.touched.destinataires && Boolean(formik.errors.destinataires)}
                        helperText={formik.touched.destinataires && formik.errors.destinataires}
                      />
                  }
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton>
                    <AddOutlinedIcon color='primary' />
                  </IconButton>
                  <IconButton>
                    <AutoFixNormalOutlinedIcon color='secondary' />
                  </IconButton>
                </div>
              </Stack>
            }

            {expediteurs &&
              <Stack direction="row" spacing={1}>
                <Autocomplete
                  multiple
                  disablePortal
                  id="combo-box-visible_a"
                  options={expediteurs}
                  sx={{ flexGrow: 1 }}
                  getOptionLabel={(option) => option.name}
                  value={getSelectedValues(expediteurs, formik.values.visible_a)}
                  onChange={(e, vals) => formik.setFieldValue("visible_a", vals?.map(val => val.id) || null)}
                  onBlur={formik.handleBlur}
                  renderInput={
                    (params: any) =>
                      <TextField
                        label="Visible par"
                        fullWidth
                        {...params}
                        error={formik.touched.visible_a && Boolean(formik.errors.visible_a)}
                        helperText={formik.touched.visible_a && formik.errors.visible_a}
                      />
                  }
                />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton>
                    <AddOutlinedIcon color='primary' />
                  </IconButton>
                  <IconButton>
                    <AutoFixNormalOutlinedIcon color='secondary' />
                  </IconButton>
                </div>
              </Stack>
            }
            <Divider/>
            <div>
            {formik.values?.id && <Attachments id_courier={formik.values.id}/>}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button color="success" variant="contained" type="submit">
                  Enregistrer
                </Button>
                <Button color="primary" variant="contained" endIcon={<SendIcon />} >
                  Envoyer par Mail
                </Button>
                <Button color="error" variant="contained" >
                  Supprimer
                </Button>
              </div>
              <div>
                <Button color="info" variant="contained" onClick={() => resetForm()}>
                  Nouveau
                </Button>
              </div>

            </div>

          </Stack>

        </form>
      </Paper>
    </div>

  )
}

export default index


const initialValues: CourierType = {
  id: "",
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