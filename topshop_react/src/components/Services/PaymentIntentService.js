import axios from "axios";
import { paymentApi } from "./AxiosConfig";


export const fetchSecretCart = (username) => {
    return paymentApi.post(`/${username}`)
}


export const fetchSecretUnique = (username, productId, quantity) => {
    return paymentApi.post("", {
        username,
        productId,
        quantity
    })
}


export const PaymentService = {
    fetchSecretCart,
    fetchSecretUnique
}