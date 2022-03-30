
import { CouriesModels } from "./couriers/types";

export type endPointType = {
    methode: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    application?: "couriers" | "gestion_access";
    model?: CouriesModels;
    url?: string
    params?: any,
    data?: any,
    protected?:boolean
}

export interface IApis {
    get_all(endpoint: endPointType): Promise<any>;
    filter(endpoint: endPointType): Promise<any>;
    get_one(endpoint: endPointType): Promise<any>;
    create_one(endpoint: endPointType): Promise<any>;
    update_one(endpoint: endPointType): Promise<any>;
    delete_one(endpoint: endPointType): Promise<any>;
    login(endpoint: endPointType): Promise<any>;
    logout(endpoint: endPointType): Promise<any>;
}

