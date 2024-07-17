export const validateUsername = (value, formValues) => {
    if (value.length < 5){
        return "Min 5 characters"
    } else if(value.length > 10){
        return "Max 10 characters"
    } else if(value.includes(" ")){
        return "Cannot contain spaces"
    }
}