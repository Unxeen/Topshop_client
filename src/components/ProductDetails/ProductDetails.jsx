import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Form, Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../Header/Header'
import { ProductService } from '../Services/ProductService'
import './ProductDetails.css'
import { CheckIcon, ImagePlaceholder, MinusIcon, PlusIcon } from '../../assets/icons'
import Footer from '../Footer/Footer'
import { useUser } from '../Context/UserContext'
import { useCart } from '../Context/CartContext'
import { Box, Button, Divider, IconButton, Input, Snackbar, Stack, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { ClientService } from '../Services/ClientService'
import { FormProvider, useForm } from 'react-hook-form'

export default function ProductDetails() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [inCart, setInCart] = useState(false)
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [commentsLoading, setCommentsLoading] = useState(true)
    const [productReviews, setProductReviews] = useState([])
    const [userImageData, setUserImageData] = useState(null)
    const inputRef = useRef()
    const [user, setUser] = useUser()
    const [cart, setCart] = useCart()
    // const formMethods = useForm()
    const [reviewSubmitInfo, setReviewSubmitInfo] = useState({
        rating: 0,
        comment: '',
        productId: id,
        username: user && user.username,
        header: ''
    })


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



    function autoResize(){
        inputRef.current.style.width = inputRef.current.value.length+'ch'
    }



    function addToCart() {

        if(!user) {
          handleClick()
          return
        }
    
        ProductService.addToCart(user.username, id, quantity, product.price)
        .then(
          axRes => {
            ProductService.getCart(user.username)
            .then(
              axRes => {
                // setInCart(true)
                setCart(axRes.data)
              }
            )
            .catch(
                axErr => console.log(axErr.response.data.details)
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





    function submitReview(){

        if(reviewSubmitInfo.comment && reviewSubmitInfo.rating){
            ProductService.submitReview(
                reviewSubmitInfo.productId,
                reviewSubmitInfo.username,
                reviewSubmitInfo.rating,
                reviewSubmitInfo.header,
                reviewSubmitInfo.comment
            )
            .then(
                axRes => {
                    ProductService.getProductReviews(id)
                    .then(
                        axRes => setProductReviews(axRes.data)
                    )
                    .catch(
                        axErr => console.log(axErr.response.data.details)
                    )
                    setReviewSubmitInfo({comment: '', rating: 0, header: ''})
                }
            )
            .catch(
                axErr => console.log(axErr.response.data.details)
            )
        }
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



    // FETCH USER DETAILS AND SET IMAGE DATA
    useEffect(() => {

        if(user){
            ClientService.getClientByUsername(user.username)
            .then(
                axRes => {
                    // console.log(axRes.data.image.imageData)
                    if(axRes.data.image.imageData){
                        setUserImageData(axRes.data.image.imageData)
                        
                    }
                }
            )
            .catch(
                axErr => console.log(axErr.response.data.details)
            )
        }

    }, [user])




    // FETCH PRODUCT REVIEWS
    useEffect(() => {

        ProductService.getProductReviews(id)
        .then(
            axRes => {
                setCommentsLoading(false)    
                setProductReviews(axRes.data)
            }
        )
        .catch(
            axErr => console.log(axErr.response.data.details)
        )
    }, [])




    // INCREMENT PRODUCT VIEW COUNT
    useEffect(() => {

        ProductService.addView(id)
        .then(
            axRes => console.log("view added")
        )
        .catch(
            axErr => console.log(axErr.response.data.details)
        )
    }, [])



    // SET PRODUCT STATE
    useEffect(() => {
        ProductService.getProductById(id).then(
            axRes => setProduct(axRes.data)
        )
    }, [])

  return (
    <>
        <div className="global_wrapper product_details_page_wrapper">

            <Header />

            <div className="product_details_container">
                <div className="product_details_image_display">

                    <img 
                        className='product_details_main_image' 
                        src={product ? product.image && `data:image/png;base64,${product.image.imageData}` : ""}
                        alt="" 
                    />

                    <img 
                        className='product_details_secondary_image' 
                        src="/src/assets/images/Gaming.png"
                        alt="" 
                    />

                    <img 
                        className='product_details_secondary_image' 
                        src="/src/assets/images/Gaming.png"
                        alt="" 
                    />

                    <img 
                        className='product_details_secondary_image' 
                        src="/src/assets/images/Gaming.png"
                        alt="" 
                    />

                    <img 
                        className='product_details_secondary_image' 
                        src="/src/assets/images/Gaming.png"
                        alt="" 
                    />
                </div>
                <div className="product_details_details">

                    <h1 className="product_details_title">{product && product.label}</h1>
                    <p className="product_details_owner">{product && product.owner.username}</p>
                    <div className="product_details_reviews">
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <Rating
                                size='large'
                                precision={0.5}
                                value={product && product.averageRating}
                                readOnly
                            />
                            <Typography fontSize={'1.5rem'}>
                                ({product && product.reviewsCount})
                            </Typography>
                        </Stack>
                    </div>
                    <div className="product_details_quantity">

                        <span>Quantity</span>
                        <div className="product_details_quantity_controller">
                            <i 
                                onClick={
                                    (e) => {
                                        if(quantity == 1) return null;
                                        setQuantity(value => --value)
                                        autoResize()
                                    }}
                            >
                                {MinusIcon}
                            </i>
                            <input 
                                className='quantity_input'
                                type="number" 
                                value={quantity}
                                ref={inputRef}
                                style={{width: "1ch"}}
                                onChange={e => {
                                    if(!e.target.value || e.target.value == 0) {
                                        setQuantity(1)
                                        return
                                    }
                                    setQuantity(e.target.value)
                                    autoResize()
                                }}
                            />
                            <i 
                                onClick={
                                    (e) => {
                                        setQuantity(value => ++value)
                                        autoResize()
                                    }}>
                                {PlusIcon}
                            </i>
                        </div>
                    </div>
                    <h1 className="product_details_price"><sup>$</sup>{product && product.price}</h1>
                    <p className="product_details_description">{product && product.description}</p>
                    <div className="product_details_buttons">

                        {inCart ? (<Link onClick={deleteLp} className='add_to_cart_added'>{CheckIcon}</Link>) :
                        (<Link onClick={addToCart} className='add_to_cart'>Add to cart</Link>)}

                        <button 
                        onClick={(e) => navigate('/checkout', {
                            state: {
                                type: "unique",
                                pid: id,
                                quantity: quantity
                            }
                        })
                        } 
                        className='buy_now'>
                            Buy now
                        </button>

                    </div>
                </div>
            </div>



            {/* PRODUCT REVIEWS SECTION */}
            <div className='product_reviews_container'>

                <h2 className='product_reviews_header'>
                    Reviews & Ratings
                </h2>


                {/* REVIEW SUBMIT SECTION */}
                <Stack direction={'column'} spacing={'10px'} className="product_reviews_newreview">

                    <div className="user_container">
                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                            <Avatar src={userImageData ?  `data:image/png;base64,${userImageData}` : ''} sx={{ width: 40, height: 40}}/>
                            <Typography fontSize={18} fontWeight={400}>
                                {user ? user.username : "Anonymous"}
                            </Typography>
                        </Stack>
                    </div>
                    <div className="review_rating_input_container">
                        <Stack direction={'row'} alignItems={'center'} spacing={'21px'}>
                            <Typography fontSize={12} fontWeight={400}>
                                Your Rating:
                            </Typography>

                            <Rating
                                name='reviewRating'
                                // {...formMethods.register(
                                //     "rating",
                                //     {
                                //         required: true
                                //     }
                                // )}
                                precision={0.5}
                                value={reviewSubmitInfo.rating}
                                onChange={(e, v) => {
                                    setReviewSubmitInfo({
                                        ...reviewSubmitInfo, rating: v
                                    })
                                }}
                            />
                        </Stack>
                    </div>

                    <Input
                    value={reviewSubmitInfo.header}
                    onChange={e => setReviewSubmitInfo({
                        ...reviewSubmitInfo, header: e.target.value
                    })}
                    sx={{fontSize: '16px', fontFamily: 'Outfit', paddingLeft: '5px', fontWeight: 300}}
                    placeholder='Review title' 
                    />

                    <textarea 
                    className='review_comment_input' 
                    value={reviewSubmitInfo.comment}  
                    placeholder='Write a review...'
                    // {...formMethods.register(
                    //     "comment", 
                    //     {
                    //         required: true
                    //     })
                    // }
                    onChange={e => {
                        setReviewSubmitInfo({
                            ...reviewSubmitInfo, 
                            comment: e.target.value
                        })
                    }}
                    />

                    <button
                    disabled={!user}
                    onClick={submitReview}
                    className='review_submit_button'>
                        Submit
                    </button>


                </Stack>

                <Divider sx={{width: '60%', marginTop: '4rem'}}/>




                {/* PRODUCT REVIEWS LIST SECTION */}
                <Stack marginTop={'4rem'} spacing={'5rem'} width={'50%'}>

                    {productReviews.length > 0 ? productReviews.map((pr, i) => {
                        return (
                        <Stack minWidth={'100%'} key={i} spacing={1} className="product_review" position={'relative'}>

                            {/* <Box position={'absolute'} top={0} right={0}>
                                <Typography variant='h6'>
                                    {pr.createdAt}
                                </Typography>
                            </Box> */}

                            <Stack direction={'row'} alignItems={'center'} spacing={2}>

                                <Avatar 
                                src={pr.user.image.imageData ?  `data:image/png;base64,${pr.user.image.imageData}` : ''} 
                                sx={{ width: 40, height: 40}}
                                />

                                <Typography textTransform={'lowercase'} fontSize={18} fontWeight={400}>
                                    {pr.user.username ? pr.user.username : "Anonymous"}
                                </Typography>

                            </Stack>


                            <Stack direction={'row'} alignItems={'center'} spacing={'21px'}>

                                <Rating
                                    precision={0.5}
                                    value={pr.rating}
                                    readOnly
                                />

                                <Typography fontSize={16} fontWeight={700}>
                                    {pr.header}
                                </Typography>
                            </Stack>

                            <Typography minWidth={'100%'} fontSize={16} maxWidth={'50%'} fontWeight={400}>
                                {pr.comment}
                            </Typography>

                            <Typography fontSize={'12px'} color={'darkblue'}>
                                    {pr.createdAt}
                            </Typography>
                        </Stack>)
                    })
                     :
                    <Box>
                        {commentsLoading ? <CircularProgress/> : (
                            <Typography variant='h4'>
                                Be the first to leave a comment
                            </Typography>
                        )}
                    </Box>
                    }
                    

                </Stack>
            </div>
            <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Please login"
            action={action}
            />
        </div>
        <Footer/>
    </>
  )
}
