import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { validateUsername } from '../Validation/ValidateUsername'
import { validatePassword } from '../Validation/ValidatePassword'
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import './Register.css'
import { validateFirstname } from '../Validation/ValidateFirsname'
import { validateLastname } from '../Validation/ValidateLastname'
import { validatePostalAddress } from '../Validation/ValidatePostalAddress'
import { validateEmail } from '../Validation/ValidateEmail'
import { AuthService } from '../Services/AuthService'
import { CloseIcon, ErrorWarning } from '../../assets/icons'

export default function Register() {

  // FORM HANDLING
  const {register, reset, formState: {errors}, handleSubmit} = useForm()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const signup = handleSubmit(data => {
    setLoading(true)
    AuthService.signup(
      data.username, 
      data.firstname, 
      data.lastname, 
      data.password, 
      data.email, 
      data.postalAddress
    ).then(
      axRes => setMessage(axRes.data)
    ).catch(
      axErr => setErrorMessage(axErr.response.data.details)
    )
    reset()
    setLoading(false)
  })

  const passwordRequiredMessage = errors && errors.password && errors.password.type == "required" && errors.password.message
  const passwordValidateMessage = errors && errors.password && errors.password.type == "validate" && errors.password.message


  return (
    <>
      <div className='register_form_container'>
        <form className="register_form" onSubmit={(e) => e.preventDefault()}>

          <h2 className='register_form_header'>
            Register
          </h2>

          <div className="register_form_core">

            {/* FIRSTNAME INPUT */}
            <div className="firstname_input_container input_container">

              <label htmlFor="firstname">

                <span className='firstname_label_text input_text'>Firstname</span>
                <span className='firstname_error input_error'>
                  {errors && errors.firstname && errors.firstname.message}
                </span>

              </label>

              <input 
                type="text" 
                {...register(
                  "firstname", 
                  {
                    required: {
                      value: true,
                      message: "Required"
                    },
                    validate: validateFirstname
                  }
                )} 
                className='firstname_input input' 
                id='firstname'
                placeholder='Firstname'
              />
            </div>


            {/* LASTNAME INPUT */}
            <div className="lastname_input_container input_container">

              <label htmlFor="lastname">

                <span className='lastname_label_text input_text'>Lastname</span>
                <span className='lastname_error input_error'>
                  {errors && errors.lastname && errors.lastname.message}
                </span>

              </label>

              <input 
                type="text" 
                {...register(
                  "lastname", 
                  {
                    required: {
                      value: true,
                      message: "Required"
                    },
                    validate: validateLastname
                  }
                )} 
                className='lastname_input input' 
                id='lastname'
                placeholder='Lastname'
              />
            </div>


            {/* USERNAME INPUT */}
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
                            },
                            validate: validateUsername
                        }
                    )} 
                    className='username_input input' 
                    id='username'
                    placeholder='Username'

                />
            </div>


            {/* PASSWORD INPUT */}
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
                    },
                    validate: validatePassword
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



            {/* POSTAL ADDRESS INPUT */}
            <div className="postaladdress_input_container input_container">
              <label htmlFor="postaladdress">
                <span className='postaladdress_label_text input_text'>Postal Address</span>
                <span className='postaladdress_error input_error'>
                  {errors && errors.postalAddress && errors.postalAddress.message}
                </span>
              </label>
              <input 
                type="text" 
                {...register(
                  "postalAddress",
                  {
                    required: {
                      value: true,
                      message: "Required"
                    },
                    validate: validatePostalAddress
                  })} 
                className='postaladdress_input input' 
                id='postaladdress'
                placeholder='Postal Address'
              />
            </div>



            {/* EMAIL ADDRESS */}
            <div className="email_input_container input_container">
              <label htmlFor="email">
                <span className='email_label_text input_text'>Email Address</span>
                <span className='email_error input_error'>
                  {errors && errors.email && errors.email.message}
                </span>
              </label>
              <input 
                type="text" 
                {...register(
                  "email",
                  {
                    required: {
                      value: true,
                      message: "Required"
                    },
                    validate: validateEmail
                  })} 
                className='email_input input' 
                id='email'
                placeholder='Email'
              />
            </div>

          </div>



          <div className="register_form_bottom">
            <button to={"#"} onClick={signup} disabled={loading ? true : false}>
              {loading ? 
                (<i className='ri-loader-4-line'></i>) :
                "Register"
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
            <p>
              Already have an account?
              <span>
                <Link to={"/login"}>
                  Login
                </Link>
              </span>
            </p>
          </div>
        </form>
      </div>
      <Footer/>
    </>
  )
}
