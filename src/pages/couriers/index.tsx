import React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Autocomplete, Button, Checkbox, FormControlLabel, IconButton, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { Formik, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/lab';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';


const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World', col3: new Date().toDateString() },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome', col3: new Date().toDateString() },
  { id: 3, col1: 'MUI', col2: 'is Amazing packages from 1 contributor and audited', col3: new Date().toDateString() },
  { id: 4, col1: 'Hello', col2: 'World', col3: new Date().toDateString() },
  { id: 5, col1: 'DataGridPro', col2: 'is Awesome', col3: new Date().toDateString() },
  { id: 6, col1: 'MUI', col2: 'is Amazing', col3: new Date().toDateString() },
  { id: 7, col1: 'Hello', col2: 'World', col3: new Date().toDateString() },
  { id: 8, col1: 'DataGridPro', col2: 'is Awesome', col3: new Date().toDateString() },
  { id: 9, col1: 'MUI', col2: 'is Amazing packages from 1 contributor and audited', col3: new Date().toDateString() },
  { id: 10, col1: 'Hello', col2: 'World', col3: new Date().toDateString() },
  { id: 11, col1: 'DataGridPro', col2: 'is Awesome', col3: new Date().toDateString() },
  { id: 12, col1: 'MUI', col2: 'is Amazing', col3: new Date().toDateString() },
  { id: 13, col1: 'Hello', col2: 'World', col3: new Date().toDateString() },
  { id: 14, col1: 'DataGridPro', col2: 'is Awesome', col3: new Date().toDateString() },
  { id: 15, col1: 'MUI', col2: 'is Amazing packages from 1 contributor and audited', col3: new Date().toDateString() },
  { id: 16, col1: 'Hello', col2: 'World', col3: new Date().toDateString() },
  { id: 17, col1: 'DataGridPro', col2: 'is Awesome', col3: new Date().toDateString() },
  { id: 18, col1: 'MUI', col2: 'is Amazing', col3: new Date().toDateString() },
];

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'N° enrig', width: 150 },
  { field: 'col2', headerName: 'Objet', width: 150 },
  { field: 'col3', headerName: 'Date arrivée', width: 150 },
];

const validationSchema = Yup.object({
  objet: Yup.string().min(10, "Objet doit etre minimum de 10 caractères").required("L'objet ne peut pas etre vide!"),
  enrig_local: Yup.number().min(3, "Objet doit etre minimum de 3 caractères").required("L'enrigstrement local ne peut pas etre vide!"),
  ref_expediteur: Yup.number().min(3, "Objet doit etre minimum de 3 caractères").required("L'enrigstrement local ne peut pas etre vide!"),
  date_arrivee: Yup.date().required("La date d'arrivée ne peut pas etre vide!"),
  date_expedition: Yup.date().required("La date d'arrivée ne peut pas etre vide!"),
  expediteur: Yup.string().required("Vous devez préciser l'expéditeur de ce courier!"),
});


const index = () => {
  const formik = useFormik({
    initialValues: {
      objet: null,
      direction: null,
      enrig_local: null,
      ref_expediteur: null,
      date_arrivee: null,
      date_expedition: null,
      expediteur: null,
      type_courier: null,
      classification: null,
      exige_reponse: false,
      repense: null,
      instructions: null,
      traitement: null,
      destinataires: null,
      visible_pr: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('====================================');
      console.log(values);
      console.log('====================================');
    },
  });

  return (
    <div style={{ display: "flex" }} >
      <Paper sx={{ width: "33%", margin: 1, padding: 1 }}>
        <DataGrid rows={rows} columns={columns} />
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
                id="enrig_local"
                name="enrig_local"
                label="enrigestrement local"
                type="number"
                value={formik.values.enrig_local}
                onChange={formik.handleChange}
                error={formik.touched.enrig_local && Boolean(formik.errors.enrig_local)}
                helperText={formik.touched.enrig_local && formik.errors.enrig_local}
              />
              <TextField
                fullWidth
                id="ref_expediteur"
                name="ref_expediteur"
                label="Référence expéditeur"
                type="number"
                value={formik.values.ref_expediteur}
                onChange={formik.handleChange}
                error={formik.touched.ref_expediteur && Boolean(formik.errors.ref_expediteur)}
                helperText={formik.touched.ref_expediteur && formik.errors.ref_expediteur}
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

            <Stack direction="row" spacing={1}>
              <Autocomplete
                disablePortal
                id="combo-box-expediteur"
                options={top100Films}
                sx={{ flexGrow: 1 }}
                onChange={(e, val) => formik.setFieldValue("expediteur", val?.id || null)}
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
                  {["Entrant", "Sortant"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <Autocomplete
                disablePortal
                id="combo-box-type_courier"
                options={top100Films}
                sx={{ flexGrow: 1 }}
                onChange={(e, val) => formik.setFieldValue("type_courier", val?.id || null)}
                onBlur={formik.handleBlur}
                renderInput={
                  (params: any) =>
                    <TextField
                      label="type_courier"
                      fullWidth
                      {...params}
                      error={formik.touched.type_courier && Boolean(formik.errors.type_courier)}
                      helperText={formik.touched.type_courier && formik.errors.type_courier}
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
            <Stack direction="row" spacing={1}>
              <Autocomplete
                disablePortal
                id="combo-box-classification"
                options={top100Films}
                sx={{ flexGrow: 1 }}
                onChange={(e, val) => formik.setFieldValue("classification", val?.id || null)}
                onBlur={formik.handleBlur}
                renderInput={
                  (params: any) =>
                    <TextField
                      label="classification"
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
            <Stack direction="row" spacing={1}>
              <Autocomplete
                disablePortal
                id="combo-box-repense"
                options={top100Films}
                sx={{ flexGrow: 1 }}
                onChange={(e, val) => formik.setFieldValue("repense", val?.id || null)}
                onBlur={formik.handleBlur}
                renderInput={
                  (params: any) =>
                    <TextField
                      label="repense"
                      fullWidth
                      {...params}
                      error={formik.touched.repense && Boolean(formik.errors.repense)}
                      helperText={formik.touched.repense && formik.errors.repense}
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
            <Stack direction="row" spacing={1}>
              <Autocomplete
                disablePortal
                id="combo-box-traitement"
                options={top100Films}
                sx={{ flexGrow: 1 }}
                onChange={(e, val) => formik.setFieldValue("traitement", val?.id || null)}
                onBlur={formik.handleBlur}
                renderInput={
                  (params: any) =>
                    <TextField
                      label="traitement"
                      fullWidth
                      {...params}
                      error={formik.touched.traitement && Boolean(formik.errors.traitement)}
                      helperText={formik.touched.traitement && formik.errors.traitement}
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
            <Stack direction="row" spacing={1}>
              <Autocomplete
                multiple
                disablePortal
                id="combo-box-destinataires"
                options={top100Films}
                sx={{ flexGrow: 1 }}
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
            <Stack direction="row" spacing={1}>
              <Autocomplete
                multiple
                disablePortal
                id="combo-box-visible_pr"
                options={top100Films}
                sx={{ flexGrow: 1 }}
                onChange={(e, vals) => formik.setFieldValue("visible_pr", vals?.map(val => val.id) || null)}
                onBlur={formik.handleBlur}
                renderInput={
                  (params: any) =>
                    <TextField
                      label="Visible par"
                      fullWidth
                      {...params}
                      error={formik.touched.visible_pr && Boolean(formik.errors.visible_pr)}
                      helperText={formik.touched.visible_pr && formik.errors.visible_pr}
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

            <div style={{ display: "flex", gap: "1rem" }}>
              <Button color="success" variant="contained" type="submit">
                Enregistrer
              </Button>
              <Button color="primary" variant="contained" >
                Envoyer par Mail
              </Button>
              <Button color="error" variant="contained" >
                Supprimer
              </Button>
            </div>

          </Stack>

        </form>
      </Paper>
    </div>

  )
}

export default index

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994, id: "1" },
  { label: 'The Godfather', year: 1972, id: "50" },
  { label: 'The Godfather: Part II', year: 1974, id: "12" },
];
