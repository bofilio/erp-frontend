import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { AlertContext, CurrentAppContext, LoadingContext } from "../../../../contexts"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CourierType } from "../../../../DAL/couriers/types";
import { API } from "../../../../DAL/generic";



type operationType = "insert" | "update"

const validationSchema = Yup.object({
    objet: Yup.string().min(10, "Objet doit etre minimum de 10 caractères").required("L'objet ne peut pas etre vide!"),
    n_enregistrement: Yup.number().min(1, "Numero Enregistrement doit etre > 0").required("L'enrigstrement local ne peut pas etre vide!"),
    referance_exp: Yup.number().min(1, "Numero Enregistrement doit etre > 0").required("L'enrigstrement local ne peut pas etre vide!"),
    date_arrivee: Yup.date().required("La date d'arrivée ne peut pas etre vide!"),
    date_expedition: Yup.date().required("La date d'arrivée ne peut pas etre vide!"),
    expediteur: Yup.string().required("Vous devez préciser l'expéditeur de ce courier!"),
    type: Yup.string().required("Vous devez préciser le type de ce courier!"),
    classification: Yup.string().required("Vous devez préciser la classification de ce courier!"),
    destinataires: Yup.array().nullable().min(1, ("Vous devez au moins selectionner un distinataire")),
    visible_a: Yup.array().nullable().when("destinataires", (destinataires: string[], schema: any): any => {
        return schema.test({
            test: (visible_a: string[]) => {
                if (!visible_a) return true
                return visible_a.every(val => destinataires?.includes(val))
            },
            message: "Le courier ne peut etre visible que pour un sous ensemble des destinataires"
        })
    }),
});

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
    destinataires: [],
    visible_a: [],
}

export const useCouriersStateHandler = () => {

    const queryClient = useQueryClient()
    const { setAlert } = useContext(AlertContext)
    const { setLoading } = useContext(LoadingContext)
    const { setCurrentApp } = useContext(CurrentAppContext)
    const [search, setSearch] = useState("")
    const [operation, setOperation] = useState<operationType>("insert")
    /**Query names for caching */
    const COURIERS_QUERY_KEY = ["couriers", search]
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

    const { isLoading: courierLoading, error: couriersError, data: couriers } = useQuery<boolean, Error, CourierType[]>(COURIERS_QUERY_KEY, () => API.filter({
        methode: "GET",
        application: "couriers",
        model: "courier",
        params: { search: search }
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
    const updateCourierMutation = useMutation((data: CourierType) => {
        return API.update_one({
            methode: "PUT",
            application: "couriers",
            model: "courier",
            params: { id: data.id },
            data: data
        })
    }, {
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
                setAlert({ status: "success", message: "email envoyé" })
            } catch (err) {
                setAlert({ status: "error", message: "Erreur d'envoie" })
            }

        }
        setLoading(false)
    }


    const onSelectionChange = (id: any) => {
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
        setCurrentApp("couriers")
    }, [])

    useEffect(() => {
        if (courierLoading) return
        if (!couriers?.length) {
            resetForm()
        }
    }, [couriers])

    useEffect(() => {
        setLoading(courierLoading || exp_Loading || type_courier_Loading || classification_Loading || statu_Loading)
    }, [courierLoading, exp_Loading, type_courier_Loading, classification_Loading, statu_Loading])

    useEffect(() => {
        if (couriersError?.message) {
            const error = JSON.parse(couriersError.message)
            setAlert({ status: "error", message: error.data.detail })
            return
        }
        if (exp_error?.message) {
            const error = JSON.parse(exp_error.message)
            setAlert({ status: "error", message: error.data.detail })
            return
        }
        if (type_courier_error?.message) {
            const error = JSON.parse(type_courier_error.message)
            setAlert({ status: "error", message: error.data.detail })
            return
        }
        if (classification_error?.message) {
            const error = JSON.parse(classification_error.message)
            setAlert({ status: "error", message: error.data.detail })
            return
        }
        if (statu_error?.message) {
            const error = JSON.parse(statu_error.message)
            setAlert({ status: "error", message: error.data.detail })
            return
        }
    }, [couriersError, exp_error, type_courier_error, classification_error, statu_error])

    return {
        formik: formik,
        localStates: { searchState: { search, setSearch } },
        courierApi: { couriersError, couriers, sendCourierByMail, deleteCouriers, onSelectionChange, resetForm, COURIERS_QUERY_KEY },
        expediteurApi: { expediteurs, EXPEDITEURS_QUERY_KEY },
        typeApi: { types_couriers, TYPES_COURIERS_QUERY_KEY },
        classificationApi: { classifications, CLASSIFICATION_QUERY_KEY },
        statusApi: { status, STATUS_COURIER_QUERY_KEY },
        attachmentsApi: { attachements, ATTACHMENTS_QUERY_KEYS },
    }
}
