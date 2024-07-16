import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import '../Login/Login.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { validateUsername } from '../Validation/ValidateUsername'
import { validatePassword } from '../Validation/ValidatePassword'
import Footer from '../Footer/Footer'
import { useUser } from '../Context/UserContext'
import { CloseIcon, ErrorWarning, ProfileIcon } from '../../assets/icons'
import { AuthService } from '../Services/AuthService'
import { AnimatePresence, motion } from 'framer-motion'

export default function Login() {

    // HOOKS
    const [user, setUser] = useUser()
    const location = useLocation()
    const [sessionIsExpired, setSessionIsExpired] = useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false) 
    const [message, setMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const {register, formState: {errors}, handleSubmit} = useForm()

    const passwordRequiredMessage = errors && errors.password && errors.password.type == "required" && errors.password.message
    const passwordValidateMessage = errors && errors.password && errors.password.type == "validate" && errors.password.message



    // HANDLE LOGIN SUBMITION HERE
    const login = handleSubmit(data => {
        AuthService.signin(data.username, data.password)
        .then(
            axRes => {
                localStorage.setItem("sessionExpired", false)
                setSessionIsExpired(false)
                if(axRes.data){
                    setUser(axRes.data)
                    navigate("/")
                }

            }
        ).catch(
            axErr => {
                setErrorMessage(axErr.response.data.details)
            }
        )
        setLoading(false)
    })


    useEffect(() => {
        // setSessionIsExpired(false)
        // console.log(typeof localStorage.getItem("sessionExpired"))
        if(localStorage.getItem("sessionExpired") == "true"){
            setSessionIsExpired(true)
            localStorage.setItem("sessionExpired", false)
        }

    }, [])
    
  return (
    <>
        <div className='login_form_container'>
            {sessionIsExpired && (
                <AnimatePresence>
                    <motion.p
                        className='session_expired_message'
                        animate={{opacity: 0}}
                        // exit={{opacity: 0}}
                        transition={{duration: 4}}
                        onAnimationEnd={() => setSessionIsExpired(false)}
                    >
                        Session expired, please login.
                    </motion.p>
                </AnimatePresence>
            )}
            <form className="login_form" onSubmit={(e) => e.preventDefault()}>

                    <div className="login_form_top">
                        {ProfileIcon}
                        <h2 className="login_form_header">
                            Login
                        </h2>
                    </div>

                    <div className="login_form_middle">

                        <div className="username_input_container input_container">
                            <label htmlFor="username">
                                <span className='username_label_text input_text'>Username</span>
                                <span className='username_error input_error'>
                                    {errors && errors.username && errors.username.message}
                                </span>
                            </label>
                            <input 
                                type="text" 
                                {...register(
                                    "username", 
                                    {
                                        required: {
                                            value: true,
                                            message: "Required"
                                        }
                                    }
                                )} 
                                className='username_input input' 
                                id='username'
                                placeholder='Username'

                            />
                        </div>

                        <div className="password_input_container input_container">
                            <label htmlFor="password">
                                <span className='password_label_text input_text'>Password</span>
                                <span className='password_error input_error'>
                                    {passwordRequiredMessage && passwordRequiredMessage}
                                </span>
                            </label>
                            <input 
                                type="password" 
                                {...register(
                                    "password",
                                    {
                                        required: {
                                            value: true,
                                            message: "Required"
                                        }
                                    })} 
                                className='password_input input' 
                                id='password'
                                placeholder='Password'
                            />
                            {passwordValidateMessage && (
                                <span className='password_error input_error input_error_under'>
                                    {passwordValidateMessage}
                                </span>
                            )}

                        </div>

                        <div className="login_form_middle_extra">

                            <div className="remember_check">
                                <input 
                                    type="checkbox" 
                                    {...register('remember')} 
                                    id='remember' 
                                    className='remember_check'
                                    
                                />
                                <span>Remember me</span>
                            </div>

                            <div className="forgot_password_link">
                                <Link>Forgot password ?</Link>
                            </div>
                        </div>

                    </div>

                    <div className="login_form_bottom">
                        <button 
                         onClick={() => {
                            setLoading(true)
                            login()
                         }} 
                         disabled={loading ? true : false}>

                            {loading ? 
                            (<i className='ri-loader-4-line'></i>) :
                            "Login"
                            }

                        </button>
                        {message && (
                            <div className='message success_message'>
                                <i>{ErrorWarning}</i>
                                <span className='message_text'>{message}</span>
                                <i onClick={() => {
                                setErrorMessage("")
                                setMessage("")
                                }}>{CloseIcon}</i>
                            </div>
                        )}
                        {errorMessage && (
                            <div className='message error_message'>
                                <i>{ErrorWarning}</i>
                                <span className='message_text'>{errorMessage}</span>
                                <i onClick={() => {
                                setErrorMessage("")
                                setMessage("")
                                }}>{CloseIcon}</i>
                            </div>
                        )}
                        <p>Don't have an account? <span><Link to={"/register"}>Register</Link></span></p>
                    </div>
            </form>
        </div>
        <Footer/>
    </>
  )
}
