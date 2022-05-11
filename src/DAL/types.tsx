
import { CouriesModels } from "./couriers/types";
import { GrhModels } from "./grh/types";

export type modelType=CouriesModels | GrhModels;
export type applicationType="couriers" | "grh" | "common";

export type endPointType = {
    methode: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    application?: applicationType
    model?: modelType
    id?: string;
    url?: string
    params?: any,
    data?: any,
    protected?: boolean,
    extra_headers?: any,
}

export type EmailBodyType = {
    subject: string;
    message:string;
    source: string;
    to: string[],
    cc?: string[]
    attachments?:string[] 
}


export interface IApis {
    get_all(endpoint: endPointType): Promise<any>;
    filter(endpoint: endPointType): Promise<any>;
    get_one(endpoint: endPointType): Promise<any>;
    create_one(endpoint: endPointType): Promise<any>;
    update_one(endpoint: endPointType): Promise<any>;
    delete_one(endpoint: endPointType): Promise<any>;
    send_email(emailBody: EmailBodyType): Promise<any>;
    login(endpoint: endPointType): Promise<any>;
    logout(endpoint: endPointType): Promise<any>;
    getMe(endpoint: endPointType): Promise<any>;
}

