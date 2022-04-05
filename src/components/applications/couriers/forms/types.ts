export type AddUpdateFormProps = {
    value?: any;
    operation?: "insert" | "update";
    insertMutation?:any;
    updateMutation?:any;
    id_parent?:string;
}