import React, { useContext, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Checkbox, Divider, FormControlLabel, IconButton, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/lab';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API } from '../../DAL/generic';
import { CourierType } from '../../DAL/couriers/types';
import { AlertContext, LoadingContext } from '../../contexts';
import SendIcon from '@mui/icons-material/Send';
import { Attachments } from '../../components/applications/common/abstraction/attachments';
import { getSelectedValue, getSelectedValues } from '../../helpers';
import { RelatedModel } from '../../components/applications/common/abstraction/RelatedModel';
import { AddUpdateClassificationForm, AddUpdateExpediteurForm, AddUpdateStatutCourierForm, AddUpdateTypeCourierForm } from '../../components/applications/couriers/forms';
import moment from 'moment';
import { ConfirmeDeletion } from '../../components/util';

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
  const { setLoading } = useContext(LoadingContext)
  const [operation, setOperation] = useState("insert" as operationType)
  /**Query names for caching */
  const COURIERS_QUERY_KEY = "couriers"
  const EXPEDITEURS_QUERY_KEY = "expediteurs"
  const TYPES_COURIERS_QUERY_KEY = "types_couriers"
  const CLASSIFICATION_QUERY_KEY = "classifications"
  const STATUS_COURIER_QUERY_KEY = "status"

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

  const { isLoading: courierLoading, error: couriersError, data: couriers } = useQuery<boolean, Error, CourierType[]>(COURIERS_QUERY_KEY, () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "courier",
  }), { retry: false })
  const { isLoading: exp_Loading, error: exp_error, data: expediteurs } = useQuery<boolean, Error, any>(EXPEDITEURS_QUERY_KEY, () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "expediteur",
  }), { retry: false })

  const { isLoading: type_courier_Loading, error: type_courier_error, data: types_couriers } = useQuery<boolean, Error, any>(TYPES_COURIERS_QUERY_KEY, () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "types_courier",
  }), { retry: false })
  const { isLoading: classification_Loading, error: classification_error, data: classifications } = useQuery<boolean, Error, any[]>(CLASSIFICATION_QUERY_KEY, () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "classification",
  }), { retry: false })
  const { isLoading: statu_Loading, error: statu_error, data: status } = useQuery<boolean, Error, any[]>("status", () => API.get_all({
    methode: "GET",
    application: "couriers",
    model: "statu",
  }), { retry: false })

  const ATTACHMENTS_QUERY_KEYS = ["courier_attachments", formik.values.id]
  const { isLoading: loadingFiles, error: filesError, data: attachements } = useQuery<boolean, Error, any[]>(ATTACHMENTS_QUERY_KEYS, () => API.filter({
    methode: "GET",
    application: "couriers",
    model: "attachment",
    params: {
      id_parent: formik.values.id
    }
  }), { enabled: Boolean(formik.values.id) })

  /**insert courier mutation */
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
  /**update courier mutation */
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
  /**delete courier function */
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
  /**send courier by mail */
  const sendCourierByMail = async () => {
    const courier = formik.values
    if (!courier.id) return
    if (!courier.visible_a) return
    setLoading(true)
    const sender = await API.get_one({
      methode: "GET",
      application: "couriers",
      model: "expediteur",
      params: { id: courier.expediteur }
    })
    const sendto = await API.filter({
      methode: "GET",
      application: "couriers",
      model: "expediteur",
      params: { ids: courier.visible_a.toString() }
    })

    if (sender && sendto) {
      try {
        await API.send_email({
          subject: "Courier pour vous",
          message: courier.objet,
          source: sender.email,
          to: sendto.map((element: any) => element.email),
          attachments: attachements?.map((attachment: any) => attachment.name)
        })
        setAlert({status:"success",message:"email envoyé"})
      }catch(err){
        setAlert({status:"error",message:"Erreur d'envoie"})
      }
      
    }
    setLoading(false)
  }


  const OnSelectionChange = (id: any) => {
    const selectedCourier = couriers?.filter((item: any) => item.id === id)[0]
    if (selectedCourier) {
      formik.setValues(selectedCourier)
      setOperation("update")
    }
  }
  const resetForm = () => {
    formik.resetForm()
    setOperation("insert")
  }
  useEffect(() => {
    setLoading(courierLoading || exp_Loading || type_courier_Loading || classification_Loading || statu_Loading)
  }, [courierLoading, exp_Loading, type_courier_Loading, classification_Loading, statu_Loading])

  useEffect(() => {
    if (couriersError != null) {
      const error = JSON.parse(couriersError.message)
      setAlert({ status: "error", message: error.data.detail })
      return
    }
    if (exp_error != null) {
      const error = JSON.parse(exp_error.message)
      setAlert({ status: "error", message: error.data.detail })
      return
    }
    if (type_courier_error != null) {
      const error = JSON.parse(type_courier_error.message)
      setAlert({ status: "error", message: error.data.detail })
      return
    }
    if (classification_error != null) {
      const error = JSON.parse(classification_error.message)
      setAlert({ status: "error", message: error.data.detail })
      return
    }
    if (statu_error != null) {
      const error = JSON.parse(statu_error.message)
      setAlert({ status: "error", message: error.data.detail })
      return
    }
  }, [couriersError, exp_error, type_courier_error, classification_error, statu_error])




  if (couriersError !== null) return (
    <div>ERROR</div>
  )
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
                      Envoyer par Mail
                    </Button>
                    {/**delete ibuttun with confirmation context */}

                  </>
                }
              </div>
              {formik.values?.id &&
                <div style={{ display: "flex", gap: "2rem" }}>
                  <div>
                    <Button color="info" variant="contained" onClick={() => resetForm()}>
                      Nouveau
                    </Button>
                  </div>

                  <ConfirmeDeletion doDelete={() => deleteCouriers(formik.values?.id)}>
                    <Button color="error" variant="contained">
                      Supprimer
                    </Button>
                  </ConfirmeDeletion>
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