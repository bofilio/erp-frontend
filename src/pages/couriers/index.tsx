import React, { useContext, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Checkbox, Divider, FormControlLabel, IconButton, InputBase, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { Attachments } from '../../components/applications/common/abstraction/attachments';
import { getSelectedValue, getSelectedValues, parseErrorString } from '../../helpers';
import { RelatedModel } from '../../components/applications/common/abstraction/RelatedModel';
import { AddUpdateClassificationForm, AddUpdateExpediteurForm, AddUpdateStatutCourierForm, AddUpdateTypeCourierForm } from '../../components/applications/couriers/forms';
import moment from 'moment';
import { ConfirmeDeletion } from '../../components/util';
import { FilterHeader } from '../../components/applications/couriers/headers';
import { useCouriersStateHandler } from '../../components/applications/couriers/hooks';
import { AlertContext } from '../../contexts';
import Zoom from '@mui/material/Zoom';


const columns: GridColDef[] = [
  { field: 'n_enregistrement', headerName: 'N° enrig', width: 150 },
  { field: 'objet', headerName: 'Objet', width: 150 },
  { field: 'date_arrivee', headerName: 'Date arrivée', width: 150 },
];



const index = () => {

  const { formik, localStates, courierApi, expediteurApi, typeApi, statusApi, attachmentsApi, classificationApi,selectionChanged } = useCouriersStateHandler()
  const { setSearch } = localStates.searchState
  const { couriersError, couriers, deleteCouriers, sendCourierByMail, onSelectionChange, resetForm, COURIERS_QUERY_KEY } = courierApi
  const { expediteurs, EXPEDITEURS_QUERY_KEY } = expediteurApi
  const { types_couriers, TYPES_COURIERS_QUERY_KEY } = typeApi
  const { classifications, CLASSIFICATION_QUERY_KEY } = classificationApi
  const { status, STATUS_COURIER_QUERY_KEY } = statusApi
  const { attachements, ATTACHMENTS_QUERY_KEYS } = attachmentsApi
  const { setAlert } = React.useContext(AlertContext)
  
  if (couriersError !== null) {

    //setAlert({ status: "error", message: parseErrorString(couriersError.message) })
    return (
      <div style={{ width: '100%', flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography fontSize={24} color="error" >
          Access Refusé
        </Typography>
      </div>
    )
  }
  return (
    <main style={{ padding: "16px" }}>
      <Stack spacing={3}>
        <FilterHeader updateSearch={(val: string) => setSearch(val)} />
        <Stack direction="row" spacing={2}  >
          <Paper sx={{ width: "30%" }}>
            <DataGrid rows={couriers || []} columns={columns} onSelectionModelChange={(ids: any[]) => {
              ids && onSelectionChange(ids[0])
            }} />
          </Paper>

          <Zoom in={selectionChanged}  >
            <Paper sx={{ width: "66%", padding: 2 }}>
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
                  </Stack>
                  <Stack direction="row" spacing={4}>
                    <DatePicker
                      inputFormat="dd.MM.yyyy"
                      label="Date d'expédition"
                      value={formik.values?.date_expedition}
                      onChange={val => {
                        formik.setFieldValue("date_expedition", moment(val).format("YYYY-MM-DD"));
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
                    appliation="couriers"
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
                      appliation="couriers"
                      model="types_courier"
                      label="Type du courier"
                      formik={formik}
                      variableName="type"
                      value={getSelectedValue(types_couriers, formik.values?.type)}
                      getOptionLabel={(option) => option.name}
                      QUERY_KEYS={TYPES_COURIERS_QUERY_KEY}
                      InsertUpdateForm={<AddUpdateTypeCourierForm />}
                    />

                  </Stack>
                  {/** classification */}
                  <RelatedModel
                    options={classifications}
                    appliation="couriers"
                    model="classification"
                    label="Classification du courier"
                    formik={formik}
                    variableName="classification"
                    value={getSelectedValue(classifications, formik.values?.classification)}
                    getOptionLabel={(option) => option.name}
                    QUERY_KEYS={CLASSIFICATION_QUERY_KEY}
                    InsertUpdateForm={<AddUpdateClassificationForm />}
                  />
                  {/** status courier (traitement) */}
                  <RelatedModel
                    options={status}
                    appliation="couriers"
                    model="statu"
                    label="Statut du courier"
                    formik={formik}
                    variableName="status"
                    value={getSelectedValue(status, formik.values?.status)}
                    getOptionLabel={(option) => option.name}
                    QUERY_KEYS={STATUS_COURIER_QUERY_KEY}
                    InsertUpdateForm={<AddUpdateStatutCourierForm />}
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
                    appliation="couriers"
                    model="courier"
                    label="Réponse"
                    formik={formik}
                    variableName="reponse"
                    value={getSelectedValue(couriers, formik.values?.reponse)}
                    getOptionLabel={(option) => option.objet}
                    QUERY_KEYS={COURIERS_QUERY_KEY}
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
                    appliation="couriers"
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
                    appliation="couriers"
                    model="expediteur"
                    label="Visible pour"
                    formik={formik}
                    variableName="visible_a"
                    value={getSelectedValues(expediteurs, formik.values?.visible_a)}
                    getOptionLabel={(option) => option.name}
                    QUERY_KEYS={EXPEDITEURS_QUERY_KEY}
                    InsertUpdateForm={<AddUpdateExpediteurForm />}
                  />

                  <Divider />
                  <div>
                    {formik.values?.id && <Attachments application='couriers' model='attachment' attachements={attachements} QUERY_NAME={ATTACHMENTS_QUERY_KEYS} id_parent={formik.values?.id} />}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <Button color="success" variant="contained" type="submit">
                        Enregistrer
                      </Button>
                      {formik.values?.id &&
                        <>
                          <Button color="primary" variant="contained" endIcon={<SendIcon />} onClick={sendCourierByMail} >
                            Envoyer
                          </Button>

                          <Button color="info" variant="contained" onClick={() => resetForm()}>
                            Nouveau
                          </Button>

                          <ConfirmeDeletion doDelete={() => deleteCouriers(formik.values?.id)}>
                            <Button color="error" variant="contained">
                              Supprimer
                            </Button>
                          </ConfirmeDeletion>
                        </>

                      }
                    </div>

                  </div>
                </Stack>
              </form>
            </Paper>
          </Zoom>
        </Stack>
      </Stack>
    </main>
  )
}

export default index



