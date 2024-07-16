import React, { Fragment, useEffect, useState } from 'react'
import { CheckIcon, FastCheckout } from '../../assets/icons'
import './Product.css'
import { Link, useNavigate } from 'react-router-dom'
import { ProductService } from '../Services/ProductService'
import { useUser } from '../Context/UserContext'
import { useCart } from '../Context/CartContext'
import { Button, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import Rating from '@mui/material/Rating';

export default function Product({ image, price, id, label, owner, stock, reviewsCount, averageRating}) {

  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  // const [inStock, setInStock] = useState(true)
  const [user, setUser] = useUser()
  const [cart, setCart] = useCart()
  const [inCart, setInCart] = useState(false)


  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );


  function addToCart() {

    if(!user) {
      handleClick()
      return
    }

    ProductService.addToCart(user.username, id, 1, price)
    .then(
      axRes => {
        ProductService.getCart(user.username)
        .then(
          axRes => {
            // setInCart(true)
            setCart(axRes.data)
          }
        )
      }
    ).catch(
      axErr => console.log(axErr.response.data.details)
    )
  }





  function deleteLp(){

    let lpId;
    if(cart){
      cart.forEach(
        lp => {
          if(lp.product.id == id){
            lpId = lp.id
          }
        }
      )
    }
    ProductService.deleteLp(lpId)
    .then(
        axRes => {
            const username = user ? user.username : "";
            ProductService.getCart(username)
            .then(
                axRes => {
                    setInCart(false)
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






  useEffect(() => {
    if(cart){
      let exist = false
      cart.forEach(
        lp => {
          if(lp.product.id == id) {
            setInCart(true)
            exist = true
          }
        }
      )
      if(exist == false){
        setInCart(false)
      }
    }
  }, [cart])



  return (
    <div className="product" key={id}>

      <div className="product_disabler"></div>

      <img src={image ? `data:image/png;base64,${image.imageData}` : ""} className='product_image' alt="" />

      <div className="product_details">

      <p className='product_price'>${price}</p>

      <Link to={`/product/${id}`} className='product_label'>{label}</Link>

      <p className='product_seller'>{owner.username}</p>

      <div className="product_extra"> 

          {inCart ? (<Link onClick={deleteLp} className='product_addtocart_added'>{CheckIcon}</Link>) : (
            <Link 
            onClick={(e) => {
              stock ? addToCart() : null
            }} className='product_addtocart'>Add to cart
            </Link>
          )} 

          <span 
            onClick={(e) => {
              stock ? navigate('/checkout', {
                state: {type: "unique", pid: id, quantity: 1}
              }) : null
            }} 
            className='product_checkout'
          >
            {FastCheckout}
          </span>

          <span className={`product_stock ${!stock && 'no_stock'}`}>
            IN STOCK
          </span>

          <Stack direction={'row'} alignItems={'center'} className='product_reviews'>
            <Rating
            max={1}
            size='large'
            value={1}
            readOnly
            />
            <Typography fontSize={'14px'}>{averageRating}</Typography>
            <Typography fontSize={'14px'}>({reviewsCount})</Typography>

          </Stack>

      </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Please login"
        action={action}
      />
    </div>
  )
}
