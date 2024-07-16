import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductService } from "../Services/ProductService";
import { useUser } from "./UserContext";


const CartContext = createContext(null)

export const CartProvider = ({children}) => {

    const [user, setUser] = useUser()
    const [cart, setCart] = useState(null)

    useEffect(() => {
        if(user){
            ProductService.getCart(user.username)
            .then(
              axRes => {
                setCart(axRes.data)
              }
            )
            .catch(
                axErr => console.log(axErr.response.data.details)
            )
        }
    }, [user])

    return (
        <CartContext.Provider value={[cart, setCart]}>
            { children }
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)