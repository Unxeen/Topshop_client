import React, { useEffect, useRef, useState } from 'react'
import { MinusIcon, PlusIcon } from '../../assets/icons';
import './QtyController.css'
import { ProductService } from '../Services/ProductService';
import { useCart } from '../Context/CartContext';
import { useUser } from '../Context/UserContext';

export default function QtyController({ handler, value, id}) {

    const inputRef = useRef()
    const [cart, setCart] = useCart()
    const [user, setUser] = useUser()
    const [stock, setStock] = useState(null)

    function autoResize(){
        inputRef.current.style.width = inputRef.current.value.length+'ch'
    }



    // GET PRODUCT ASSOCIATED WITH LP
    useEffect(() => {
        
        ProductService.getLineProductById(id)
        .then(
            axRes => setStock(axRes.data.product.stock)
        )
        .catch(
            axErr => console.log(axErr.response.data.details)
        )
    }, [])





    function updateCart(){

        if(value[id]){
            console.log(value[id])
            ProductService.updateLp(value[id], id)
            .then(
                axRes => {
                    // console.log("updated in server!")
                    const username = user ? user.username : "";
                    ProductService.getCart(username)
                    .then(
                        axRes => {
                            setCart(axRes.data)
                        }
                    )
                    .catch(
                        axErr => {
                            console.log(axErr.response.data.details)
                        }
                    )
                }
            )
            .catch(
                axErr => {
                    if(axErr.response.data.details[0] == "Stock is less than selected quantity"){
                        handler(prevQuantities => ({
                            ...prevQuantities,
                            [id]: stock,
                          }));
                    }
                    console.log(axErr.response.data.details)
                }
            )
        }


    }






    useEffect(() => {
        updateCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value[id]])

    



    return (
        <div className="product_details_quantity_controller">
            <i 
                onClick={
                    (e) => {
                        if(value[id] == 1) return null;
                        handler(prevQuantities => ({
                            ...prevQuantities,
                            [id]: --prevQuantities[id],
                          }));
                        // updateCart()
                        autoResize()
                    }}
            >
                {MinusIcon}
            </i>

            <input 
                className='quantity_input'
                type="number" 
                value={value[id] || 1}
                ref={inputRef}
                style={{width: "1ch"}}
                onChange={e => {
                    // const newValue = e.target.value ? parseInt(e.target.value, 10) : 1
                    console.log(e.target.value)
                    if(!e.target.value || e.target.value == 0) {
                        handler(prevQuantities => ({
                            ...prevQuantities,
                            [id]: 1,
                        }));
                        return
                    }
                    handler(prevQuantities => ({
                        ...prevQuantities,
                        [id]: e.target.value,
                    }));
  
                    // updateCart()
                    autoResize()
                }}
            />
            <i 
                onClick={
                    (e) => {
                        // let newValue = value[id]
                        // console.log(newValue)
                        // if (value[id] + 1 > stock) {
                        //     return
                        // } else {
                        //     newValue = newValue + 1
                        // }
                        // console.log(newValue)
                        // console.log(stock)
                        handler(prevQuantities => ({
                            ...prevQuantities,
                            [id]: ++prevQuantities[id],
                          }));
                        // updateCart()
                        autoResize()
                    }}>
                {PlusIcon}
            </i>
        </div>
  )
}
