import axios from "axios";
import { AuthService } from "./AuthService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export const serverApi = axios.create(
    {baseURL: "http://localhost:8080/api"}
)

export const paymentApi = axios.create(
    {baseURL: 'http://localhost:8080/create-payment-intent'}
)


paymentApi.interceptors.request.use(
    (config) => {
        const currentUser = AuthService.getCurrentUser()

        if(currentUser && currentUser.jwtToken){
            config.headers.Authorization = `Bearer ${currentUser.jwtToken}`
        }
        
        return config;
    },
    (error) => {
        Promise.reject(error)
    }
)

paymentApi.interceptors.response.use(
    axRes => {
        return axRes
    },
    axErr => {
        console.log("axios error intercepted")
        if(axErr.response.data === "session expired\r\n"){
            localStorage.setItem("sessionExpired", true)
            logout()
            window.history.pushState("Session expired, please login", '', "/login")
            window.location.reload()
            // window.history.pushState("Session expired, please login", '', "/login")
        }
        return Promise.reject(axErr)
    }
)



serverApi.interceptors.request.use(
    (config) => {
        const currentUser = AuthService.getCurrentUser()

        if(currentUser && currentUser.jwtToken){
            config.headers.Authorization = `Bearer ${currentUser.jwtToken}`
        }
        
        return config;
    },
    (error) => {
        Promise.reject(error)
    }
)

serverApi.interceptors.response.use(
    axRes => {
        // if(axRes.data.details[0] === "expired jwt"){
        //     console.log("expired jwt")
        // }
        // console.log("axios resolve")
        return axRes
    },
    axErr => {
        console.log("axios error")
        if(axErr.response.data === "session expired\r\n"){
            localStorage.setItem("sessionExpired", true)
            logout()
            window.history.pushState("Session expired, please login", '', "/login")
            window.location.reload()
            // window.history.pushState("Session expired, please login", '', "/login")
        }
        return Promise.reject(axErr)
    }
)


function logout(){
    localStorage.setItem("user", null)
}