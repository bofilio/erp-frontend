import axios from "axios";
import { CouriesModels } from "../couriers/types";

export type modelType= CouriesModels

export function getAll(model:modelType){
    return axios.get("")
}