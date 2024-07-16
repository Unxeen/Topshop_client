import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useUser } from "../Context/UserContext";
import { PaymentService } from "../Services/PaymentIntentService";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../Context/CartContext";
import './Checkout.css'
import { paymentApi } from "../Services/AxiosConfig";
import { useLocation, useParams } from "react-router-dom";



// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51PLNwT076td8p3Y87dNFsimll7hIsFp4lxcLO4OZudf6dQw8UqxbbNf7QRSkubeX3p2ZDwEuaUEaEHwwR0sD9Nkw00bgErElbA");

export default function Checkout() {

    const { type, pid, quantity } = useParams()
    const location = useLocation()
    const [user, setUser] = useUser()
    const [cart, setCart] = useCart()
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {

        const type = location.state.type;
        const pid = location.state.pid;
        const quantity = location.state.quantity

        if(user){
            if(type === "cart"){
                PaymentService.fetchSecretCart(user.username)
                .then(
                    axRes => setClientSecret(axRes.data.clientSecret)
                )
                .catch(
                    axErr => console.log(axErr)
                )
            } else if(type === "unique") {
                PaymentService.fetchSecretUnique(user.username, pid, quantity)
                .then(
                    axRes => setClientSecret(axRes.data.clientSecret)
                )
                .catch(
                    axErr => console.log(axErr)
                )
            }

        } else{
            window.history.pushState("", "", "/login")
            window.location.reload()
        }

    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="payment_form_container">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}