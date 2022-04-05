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