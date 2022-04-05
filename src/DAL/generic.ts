import axios, { AxiosResponse } from "axios";
import { baseURL } from "./config";
import { endPointType, IApis } from "./types";

export function getHeaders() {
    return {}
}


export class Apis implements IApis {
    async login(endpoint: endPointType): Promise<AxiosResponse<any, any>> {
        const { methode, url, data } = endpoint
        if (methode !== "POST")
            throw new Error("HTTP Method not supported!.");
        try {
            const response = await axios.post(`${baseURL}${url}`, data, {
                headers: getHeaders(),
            })
            return response
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    async logout(endpoint: endPointType): Promise<any> {
        const { methode, url, data } = endpoint
        if (methode !== "POST")
            throw new Error("HTTP Method not supported!.");
        try {
            const response = await axios.post(`${baseURL}${url}`, data, {
                headers: getHeaders(),
            })
            return response.data
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    async get_all(endpoint: endPointType): Promise<any> {
        const { methode, application, model } = endpoint
        if (methode !== "GET")
            throw new Error("HTTP Method not supported!.");
        try {
            const response = await axios.get(`${baseURL}/${application}/${model}s`, {
                headers: getHeaders(),
            })
            return response.data
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async filter(endpoint: endPointType): Promise<any> {
        const { methode, application, model, params } = endpoint
        if (methode !== "GET")
            throw new Error("HTTP Method not supported!.");
        try {
            const response = await axios.get(`${baseURL}/${application}/${model}s`, {
                params: params,
                headers: getHeaders(),
            })
            return response.data
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    async get_one(endpoint: endPointType): Promise<any> {
        const { methode, application, model, params } = endpoint
        if (methode !== "GET")
            throw new Error("HTTP Method not supported!.");
        try {
            const response = await axios.get(`${baseURL}/${application}/${model}s/${params.id}`, {
                headers: getHeaders(),
            })
            return response.data
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    async create_one(endpoint: endPointType): Promise<any> {
        const { methode, application, model, data,extra_headers } = endpoint
       
        if (methode !== "POST")
            throw new Error("HTTP Method not supported!.");
        try {
            const response = await axios.post(`${baseURL}/${application}/${model}s/`, data, {
                headers: {...getHeaders(),...extra_headers},
            })
            return response.data
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    async update_one(endpoint: endPointType): Promise<any> {
        const { methode, application, model, params, data,extra_headers={} } = endpoint
        
        if (methode !== "PUT")
            throw new Error("HTTP Method not supported!.");
        try {
            const response = await axios.put(`${baseURL}/${application}/${model}s/${params.id}/`, data, {
                headers: {...getHeaders(),...extra_headers},
            })
            return response.data
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
    async delete_one(endpoint: endPointType): Promise<any> {
        const { methode, application, model, params } = endpoint
        if (methode !== "DELETE")
            throw new Error("HTTP Method not supported!.");
        try {
            const response = await axios.delete(`${baseURL}/${application}/${model}s/${params.id}`, {
                headers: getHeaders(),
            })
            return response.data
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export const API = new Apis()