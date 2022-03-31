export type CouriesModels="courier"|"expediteur"|"types_courier"|"classification"|"statu"|"attachment"
export type CourierType = {
    id:string;
    objet: string;
    direction: "arrivee"|"depart"|"";
    n_enregistrement: number|"";
    referance_exp: number|"";
    date_arrivee: Date|null;
    date_expedition: Date|null;
    expediteur: string,
    type: string,
    classification: string,
    exige_reponse: boolean,
    reponse: string,
    instructions: string,
    status: string,
    destinataires?: string[]|null,
    visible_a?: string[]|null,
    attachments?:string[]|null
}


