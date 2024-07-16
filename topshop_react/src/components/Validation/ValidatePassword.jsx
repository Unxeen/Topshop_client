

export const validatePassword = (value) => {

    const lowerCaseRegex = /^(?=.*[a-z])/;
    const upperCaseRegex = /^(?=.*[A-Z])/;
    const digitRegex = /^(?=.*\d)/;
    const specialCharRegex = /^(?=.*[@$!%*?&])/;
    const minLengthRegex = /^.{8,}$/;

    if (!lowerCaseRegex.test(value)) {
        return "Password must contain at least one lowercase letter.";
    } 
    else if (!upperCaseRegex.test(value)) {
        return "Password must contain at least one uppercase letter.";
    }
    else if (!digitRegex.test(value)) {
        return "Password must contain at least one digit.";
    }
    else if (!specialCharRegex.test(value)) {
        return "Password must contain at least one special character.";
    }
    else if (!minLengthRegex.test(value)) {
        return "Password must have a minimum length of 8 characters.";
    }
};
