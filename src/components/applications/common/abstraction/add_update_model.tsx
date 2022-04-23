
import React, { useContext } from 'react'
import { useMutation } from 'react-query'
import { API } from '../../../../DAL/generic'
import { AlertContext } from '../../../../contexts';
import { applicationType, modelType } from '../../../../DAL/types';

type AddUpdateModelProps = {
    value?: any;
    onceDone: () => void;
    application:applicationType;
    model: modelType;
    formComponent: JSX.Element;
    extra_headers?:any;
}



export const AddModelInstance: React.FC<AddUpdateModelProps> = (props) => {
    const { onceDone, value,application, model, formComponent,extra_headers={} } = props
    const {setAlert} =useContext(AlertContext)
    const insertMutation = useMutation<any,Error>((data: any) => API.create_one({
        methode: "POST",
        application: application,
        model: model,
        data: data,
        extra_headers:extra_headers,
    }), {
        onSuccess: (data) =>{
            setAlert({status:"success", message:"sauvgardé"})
            onceDone()
        } ,
       onError:(err)=>{
        const error = JSON.parse(err.message)
        setAlert({ status: "error", message: JSON.stringify(error.data.detail) })
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
    const { onceDone, value,application, model, formComponent,extra_headers } = props
    const {setAlert} =useContext(AlertContext)
    const updateMutation = useMutation((data: any) => API.update_one({
        methode: "PUT",
        application: application,
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