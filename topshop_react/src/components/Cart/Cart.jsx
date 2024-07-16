import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import './Cart.css'
import { useUser } from '../Context/UserContext'
import { useCart } from '../Context/CartContext'
import { ProductService } from '../Services/ProductService'
import QtyController from '../QtyController/QtyController'
import { TrashIcon } from '../../assets/icons'
import { Divider } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {


    const navigate = useNavigate()
    const [cart, setCart] = useCart()
    const [quantities, setQuantities] = useState()
    const [total, setTotal] = useState(null)
    const [user, setUser] = useUser()



    function deleteLp(id){

        ProductService.deleteLp(id)
        .then(
            axRes => {
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
            axErr => console.log(axErr.response.data.details)
        )
    }



    // INITIATE CART ITEM QUANTITIES
    useEffect(() => {
        const initalQties = cart && cart.reduce(
            (acc, lp) => {
                acc[lp.id] = lp.quantity
                return acc
            }, {}
        )
        setQuantities(initalQties)
    }, [cart])



    // CALCULATE CART TOTAL
    useEffect(() => {
        var totalPrice = 0
        if(cart) {
            cart.forEach((lp) => {
                totalPrice += lp.totalPrice
            })
            setTotal(totalPrice)
        }
    }, [cart])



    return (
        <div className='global-wrapper cart_page_wrapper'>

            <Header/>

            <div className="cart_container">

                <div className="cart_items">
                    <h2 className="cart_items_title">My Cart <span>({3})</span></h2>
                    {user && cart && cart.length && quantities && cart.map(
                        lp => (
                            <div className="cart_item_container" key={lp.id}>
                                <div className='cart_item'>
        
                                    <img 
                                        src={lp.product.image ? `data:image/png;base64,${lp.product.image.imageData}` : "src/assets/images/ProductPlaceholder sm PNG.png"} 
                                        alt="" 
                                        className="cart_item_image" 
                                    />
        
                                    <div className="cart_item_details">
                                        <i onClick={(e) => deleteLp(lp.id)} className='cart_item_details_delete'>
                                            {TrashIcon}
                                        </i>
                                        <p className="cart_item_details_owner">{lp.product.owner.username}</p>
                                        <p className="cart_item_details_label">{lp.product.label}</p>
                                        <div className="cart_item_details_extra">
                                            <QtyController handler={setQuantities} value={quantities} id={lp.id}/>
                                            <h2 className='cart_item_details_extra_price'>${lp.product.price}</h2>
                                        </div>
                                    </div>
        
                                </div>
        
                                <Divider className='lp_devider' variant='middle' sx={{margin: "2rem"}}/>
                            </div>
                            )
                    )}

                </div>

                <div className="cart_summary">
                    <h2 className="cart_summary_title">Summary</h2>
                    <p className="cart_summary_subtotal">
                        Subtotal:
                        <span>${total}</span>
                    </p>
                    <button 
                        // to={'/checkout/cart'} 
                        onClick={(e) => navigate('/checkout', {
                            state: {type: "cart"}
                        })}
                        className='checkout_btn cart_summary_checkout'
                    >
                        Checkout
                    </button>
                </div>

            </div>
        </div>
    )
}
