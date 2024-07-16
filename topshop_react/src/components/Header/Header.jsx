import React, { useEffect, useRef, useState } from 'react'
import './Header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { BurgerMenu, CartIcon, CloseIcon, NewItemIcon, ProfileIcon, SearchBarIcon, ShopIcon, TrashIcon } from '../../assets/icons'
import { useUser } from '../Context/UserContext'
import ClickOutside from '../Utils/ClickOutside'
import { Badge, Divider, IconButton } from '@mui/material'
import QtyController from '../QtyController/QtyController'
import { useCart } from '../Context/CartContext'
import { ProductService } from '../Services/ProductService'
import PlaceHolderImg from '/src/assets/images/ProductPlaceholder-sm-PNG.png'
import { ClientService } from '../Services/ClientService'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Avatar from '@mui/material/Avatar';

export default function Header({classNames}) {

    const navigate = useNavigate()
    const [cart, setCart] = useCart()
    const [quantities, setQuantities] = useState(null)
    const [total, setTotal] = useState(null)
    const [menuOpened, setMenuOpened] = useState(false)
    const [focused, setFocused] = useState(false)
    const [user, setUser] = useUser()
    const [userImageData, setUserImageData] = useState(null)
    const profilePic = useRef()
    const [hiddenProfile, setHiddenProfile] = useState(true)
    const [hiddenCart, setHiddenCart] = useState(true)
    const {register, formState: { errors }, handleSubmit, setValue} = useForm()
    const onSubmit = handleSubmit((formData) => {console.log(formData)})



    function logout(){
        localStorage.setItem("sessionExpired", false)
        window.history.pushState("", "", "/")
        window.location.reload()
        setUser(null);
        // navigate("/")
    }



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




    // function replaceProfilePic(event){
    //     const fileInput = event.target;
    //     const files = fileInput.files;
    
    //     if (files.length > 0) {
    //       const file = files[0];
    //       const reader = new FileReader();
    
    //       reader.onload = function(e) {
    //         imageHolder.current.style.backgroundImage = `url(${e.target.result})`;
    //       };
    
    //       reader.readAsDataURL(file);
    //     }
    // }




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
    <div className={`header_container ${classNames}`}>
        <header className={`header ${menuOpened && "menu_bg"}`}>

            <div className={`logo_container`}>
                <Link className='logo' to={"/"}>TOPSHOP</Link>
            </div>


            <div className={`search_bar_container invisible_sm ${menuOpened && 'hide_search'}`}>
                <form className={`search_bar ${focused && "focused"}`} onSubmit={(e) => e.preventDefault()}>

                    <input 
                    type="text" 
                    id="search_bar_input" 
                    className='search_bar_input' 
                    placeholder='Search an item...'
                    {...register("searchExp")}
                    onFocus={(e) => setFocused(true)}
                    onBlur={(e) => setFocused(false)}
                    onKeyDown={(e) => e.key === "Enter" ? onSubmit() : null}
                    />

                    <i className='search_bar_icon'>
                        {SearchBarIcon}
                    </i>

                </form>
            </div>



            <div onClick={(e) => setMenuOpened(!menuOpened)} className={`menu_icon_container invisible_lg`}>
                {menuOpened ? 
                (<i className='close_menu'>{CloseIcon}</i>) : 
                (<i className='burger_menu'>{BurgerMenu}</i>)
                }
            </div>




            {/* HEADER MENU */}
            <div className={`menu_container ${menuOpened && "active"}`}>
                <ul className={`menu`}>

                    <li className="menu_item">
                        <Link to={'/browse'} className='menu_link'>
                            <i className='invisible_lg'>{ShopIcon}</i>
                            <span>Browse</span>
                        </Link>
                    </li>

                    <li className="menu_item">
                        <Link to={"/listitem"} className='menu_link'>
                            <i className='invisible_lg'>{NewItemIcon}</i>
                            <span>List an item</span>
                        </Link>
                    </li>

                    <li className="menu_item">
                        <div className='menu_link'>
                            <ClickOutside onClickOutside={() => setHiddenCart(true)}>
                                
                                <Badge 
                                className='cart_badge'  
                                badgeContent={cart && cart.length} 
                                color='primary'
                                variant='standard'
                                onClick={(e) => setHiddenCart(!hiddenCart)}
                                >
                                    <i className='cart_icon'>
                                        <ShoppingBagIcon/>
                                    </i>
                                </Badge>
                                

                                {!user ? (
                                    <p className={`header_cart_container ${hiddenCart && 'hidden'}`}>
                                        Login first
                                    </p>
                                ): cart && cart.length > 0 && quantities ? (
                                    <div className={`header_cart_container ${hiddenCart && 'hidden'}`}>
                                        
                                        <h2 className="header_cart_title">
                                            Cart
                                            <span>({cart.length})</span>
                                        </h2>

                                        <div className="header_cart_lp_list">

                                            {cart.map(
                                                lp => (
                                                        <div className="header_cart_lp_container" key={lp.id}>
                                                            <div className='header_cart_lp'>

                                                                <img 
                                                                    src={lp.product.image ? `data:image/png;base64,${lp.product.image.imageData}` : PlaceHolderImg}  
                                                                    alt="" 
                                                                    className="header_cart_lp_image" 
                                                                />

                                                                <div className="header_cart_lp_details">
                                                                    <i onClick={(e) => deleteLp(lp.id)} className='header_cart_lp_details_delete'>
                                                                        {TrashIcon}
                                                                    </i>
                                                                    <p className="header_cart_lp_details_owner">{lp.product.owner.username}</p>
                                                                    <p className="header_cart_lp_details_label">{lp.product.label}</p>
                                                                    <div className="header_cart_lp_details_extra">
                                                                        {quantities && <QtyController handler={setQuantities} value={quantities} id={lp.id}/>}
                                                                        <h2 className='header_cart_lp_details_extra_price'>${lp.product.price}</h2>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <Divider className='lp_devider' variant='middle' sx={{margin: "2rem"}}/>
                                                        </div>
                                                    )
                                            )}

                                        </div>

                                        <p className="header_cart_total">
                                            Total:
                                            <span>${total}</span>
                                        </p>

                                        <div className="header_cart_btn_group">

                                            <Link to={'/cart'} className='view_cart_btn'>
                                                View cart
                                            </Link>

                                            {/* 
                                            <Link to={'/checkout'} className='checkout_btn'>
                                                Checkout
                                            </Link> */}

                                        </div>

                                    </div>
                                ): (
                                    <p className={`header_cart_container ${hiddenCart && 'hidden'}`}>No items currently in cart</p>
                                )}
                            </ClickOutside>
                            <span className='invisible_lg'>Cart</span>
                        </div>
                    </li>

                    {user ? (
                        <li className="menu_item menu_auth">
                            <ClickOutside onClickOutside={() => setHiddenProfile(true)}>
                                <Link onClick={(e) => setHiddenProfile(!hiddenProfile)} className='menu_link profile_link'>
                                    {userImageData ? (
                                        <img
                                        className=""
                                        src={`data:image/png;base64,${userImageData}`} alt="" />
                                    )
                                    : ProfileIcon
                                    }
                                </Link>
                                <div className={`profile_options ${hiddenProfile && 'hidden'}`}>

                                    <div className="profile_options_profile profile_option">
                                        <Link to={'/profile'}>Profile</Link>
                                    </div>
                                    <Divider className='lp_devider' variant='fullWidth' sx={{borderColor: 'rgb(224 224 224)'}}/>
                                    <div className="profile_options_manage profile_option">
                                        <Link to={'/manage'}>Manage</Link>
                                    </div>
                                    <Divider className='lp_devider' variant='fullWidth' sx={{borderColor: 'rgb(224 224 224)'}}/>
                                    <div className="profile_options_dashboard profile_option">
                                        <Link to={'/dashboard'}>Dashboard</Link>
                                    </div>
                                    <Divider className='lp_devider' variant='fullWidth' sx={{borderColor: 'rgb(224 224 224)'}}/>
                                    <div className="profile_options_logout profile_option">
                                        <Link onClick={logout}>Logout</Link>
                                    </div>
                                    
                                </div>
                            </ClickOutside>                

                            
                        </li>
                    ) : (
                        <li className="menu_item menu_auth">
                            <Link to={"/login"} className='menu_link menu_login'>
                                Login
                            </Link>
                        </li>

                    )}

                    <li className="menu_item search_bar_item invisible_lg invisible_md">
                        <div className="search_bar_container">
                            <form className={`search_bar ${focused && "focused"}`} onSubmit={(e) => e.preventDefault()}>

                                <input 
                                type="text" 
                                id="search_bar_input" 
                                className='search_bar_input' 
                                placeholder='Search an item...'
                                {...register("searchExp")}
                                onFocus={(e) => setFocused(true)}
                                onBlur={(e) => setFocused(false)}
                                onKeyDown={(e) => e.key === "Enter" ? onSubmit() : null}
                                />

                                <i className='search_bar_icon'>
                                    {SearchBarIcon}
                                </i>

                            </form>
                        </div>
                    </li>

                </ul>
            </div>

        </header>
    </div>


  )
}
