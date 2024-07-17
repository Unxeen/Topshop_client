export const validateEmail = (value, formValues) => {

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if (!emailRegex.test(value)) {
        return "Must be a valid email address."
    }
}