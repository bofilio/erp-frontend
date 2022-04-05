
import React, { useContext } from 'react'
import { useMutation } from 'react-query'
import { API } from '../../../../DAL/generic'
import { modelType } from '../../../../DAL/common/query';
import { AlertContext } from '../../../../contexts';

type AddUpdateModelProps = {
    value?: any;
    onceDone: () => void;
    model: modelType;
    formComponent: JSX.Element;
    extra_headers?:any;
}



export const AddModelInstance: React.FC<AddUpdateModelProps> = (props) => {
    const { onceDone, value, model, formComponent,extra_headers={} } = props
    const {setAlert} =useContext(AlertContext)
    const insertMutation = useMutation((data: any) => API.create_one({
        methode: "POST",
        application: "couriers",
        model: model,
        data: data,
        extra_headers:extra_headers,
    }), {
        onSuccess: () =>{
            setAlert({status:"success", message:"sauvgardé"})
            onceDone()
        } ,
       onError:(err)=>{
        setAlert({status:"error", message:`Erreur de sauvgarde`})
       }
    }) 

    return (
        <>
            {
                React.cloneElement(
                    formComponent,
                    {
                        value: value,
                        operation: "insert",
                        insertMutation: insertMutation
                    }
                )
            }

        </>

    )
}
export const UpdateModelInstance: React.FC<AddUpdateModelProps> = (props) => {
    const { onceDone, value, model, formComponent,extra_headers } = props
    const {setAlert} =useContext(AlertContext)
    const updateMutation = useMutation((data: any) => API.update_one({
        methode: "PUT",
        application: "couriers",
        model: model,
        data: data,
        params: { id: value?.id },
        extra_headers:extra_headers
    }), {
        onSuccess: () =>{
            setAlert({status:"success", message:"la modification est faite"})
            onceDone()
        } ,
       onError:(err)=>{
        setAlert({status:"error", message:`Erreur de modification ${err}`})
       }
    })


    return (
        <>
            {
                React.cloneElement(
                    formComponent,
                    {
                        value: value,
                        operation: "update",
                        updateMutation: updateMutation
                    }
                )
            }

        </>

    )
}