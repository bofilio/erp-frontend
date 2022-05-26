export const getSelectedValue = (options: any, value: any) => {
    if (value && options) {
        return options.filter((option: any) => option.id === value)[0]
    }
    else return null
}
export const getSelectedValues = (options: any, values: any) => {
    if (values && options) {
        return options.filter((option: any) => values.includes(option.id))
    }
    else return []
}
export const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
}

export function getRondomString(length:number){
    return Math.random().toString(36).slice(2, length);
}

export function parseErrorString(raw_error:string):string{
    if(!raw_error) return ""
    return JSON.parse(raw_error)?.data?.detail || "???"
}