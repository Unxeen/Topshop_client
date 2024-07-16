import axios from "axios";

const authApi = axios.create({baseURL: "http://localhost:8080/auth"})

const signup = (username, fisrtname, lastname, password, email, postalAddress) => {
    return authApi.post("/signup", {
        fisrtname,
        lastname,
        username,
        password,
        email,
        postalAddress
    })
}

const signin = (username, password) => {
    return authApi.post("/signin", {
        username,
        password
    })
}


const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"))
}

const getCurrentUsername = () => {
    return JSON.parse(localStorage.getItem("user")).username
}


export const AuthService = {
    signup,
    signin,
    getCurrentUser,
    getCurrentUsername
}