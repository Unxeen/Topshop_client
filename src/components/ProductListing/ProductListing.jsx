import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header/Header'
import './ProductListing.css'
import { FormProvider, useForm } from 'react-hook-form'
import Input from '../Inputs/Input'
import { CheckIcon, CloseIcon, ErrorWarning, ImagePlaceholder } from '../../assets/icons'
import { ProductService } from '../Services/ProductService'
import { CategoryService } from '../Services/CategoryService'
import { AuthService } from '../Services/AuthService'
import { useUser } from '../Context/UserContext'
import ValdidateMaxLength from '../Validation/ValdidateMaxLength'

export default function ProductListing() {

  const [categories, setCategories] = useState(null)
  const [user, setUser] = useUser()
  const inputContainer = useRef(null)
  const [loading, setLoading] = useState(false) 
  const [selected, setSelected] = useState(false)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const formMethods = useForm()
  const submit = formMethods.handleSubmit(
    data => {
      ProductService.saveProduct(
        data.label,
        data.description,
        data.price,
        data.image[0],
        data.stock,
        user.username,
        data.cat
      ).then(
        axRes => {
          // console.log(axRes)
          // if(axRes.data)
          setMessage("Product listed successfully.")
        }
      ).catch(
        axErr => {
          console.log(axErr)
          setErrorMessage(axErr.response.data.details)
        }
      )
      setLoading(false)
    },
    data => {
      console.log(formMethods.formState.errors)
      setLoading(false)
    }
  )





  // IMAGE BG SETTER FOR THE IMAGE INPUT  
  function replaceBg(event){
    const fileInput = event.target;
    const files = fileInput.files;

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = function(e) {
        inputContainer.current.style.backgroundImage = `url(${e.target.result})`;
      };

      reader.readAsDataURL(file);
    }
  }



  // INITIALIZING CATEGORIES LIST FROM SERVER
  useEffect(() => {
    CategoryService.getCategories().then(
      axRes => setCategories(axRes.data)
    ).catch(
      axErr => console.log(axErr.response.data.details)
    )
  }, [])



  
  return (
    <>
      <div className="wrapper-global product_listing_page_wrapper">
        <Header/>
        <div className="product_listing_container header_offset">
          <h2 className="product_listing_header">
            Create a listing
          </h2>

          <FormProvider {...formMethods}>
            <form 
                onSubmit={(e) => e.preventDefault()} 
                className="product_listing_form"
              >

                <h2 className='product_listing_form_header'>Item details</h2>
                
                <div className="product_listing_form_core">

                  {/* PRODUCT IMAGE INPUT */}
                  <div className="file_input_container" ref={inputContainer}>

                    <div className="file_input_logo">
                      {selected ? CheckIcon : (
                        <>
                          {ImagePlaceholder}
                          <p>Select an image</p>
                        </>
                      )}
                    </div>
                    <input
                      className='file_input' 
                      type="file" 
                      {...formMethods.register("image", {
                        required: {
                          value: true,
                          message: "Required"
                        }
                      })}
                      id="product_image_input"
                      onChange={(e) => {
                        setSelected(true)
                        replaceBg(e)
                      }}
                    />
                    
                  </div>




                  {/* PRODUCT LABEL INPUT */}
                  <Input
                    containerClass={"product_listing_product_name_container"}
                    label={"Name"}
                    id={"product_listing_label"}
                    inputClass={"product_listing_product_name_container"}
                    name={"label"}
                    placeholder={"Product name..."}
                    required={true}
                    type={"text"}
                    validation={ValdidateMaxLength}
                  />




                  {/* PRODUCT PRICE INPUT */}
                  <Input
                    containerClass={"product_listing_product_price_container"}
                    inputClass={"product_listing_product_price_input"}
                    label={"Price"}
                    id={"product_listing_price"}
                    name={"price"}
                    placeholder={"Name a price..."}
                    required={true}
                    type={"number"}
                  />




                  {/* PRODUCT QUANTITY INPUT */}
                  <Input
                    containerClass={"product_listing_product_quantity_container"}
                    inputClass={"product_listing_product_quantity_input"}
                    label={"Quantity"}
                    id={"product_listing_quantity"}
                    name={"stock"}
                    placeholder={"Name a quantity..."}
                    required={true}
                    type={"number"}
                  />





                  {/* PRODUCT CATEGORY INPUT */}
                  <div className="product_listing_product_category_container input_container">

                    <label htmlFor="product_listing_category">
                        <span className='category_label_text input_text'>Category</span>
                        <span className='category_error input_error'>
                          {
                          formMethods.formState.errors && 
                          formMethods.formState.errors.category && 
                          formMethods.formState.errors.category.message
                          }
                        </span>
                    </label>

                    <select 
                      className='product_listing_product_category_input input'
                      defaultValue={""}
                      {...formMethods.register(
                        "cat",
                        {
                          required: {
                            value: true,
                            message: "Required"
                          }
                        }
                      )}
                    >

                      <option value={""} disabled>Category...</option>
                      {categories && categories.map(
                        category => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        )
                      )}

                    </select>

                  </div>





                  {/* PRODUCT DESCRIPTION INPUT */}
                  <Input
                    containerClass={"product_listing_product_description_container"}
                    inputClass={"product_listing_product_description_input"}
                    label={"Description"}
                    id={"product_listing_description"}
                    name={"description"}
                    placeholder={"Name a description..."}
                    required={true}
                    type={"textarea"}
                  />



                </div>




                <div className="product_listing_form_bottom">

                        <button 
                          onClick={() => {
                              setLoading(true)
                              submit()
                          }} 
                          disabled={loading ? true : false}
                         >

                          {loading ? 
                          (<i className='ri-loader-4-line'></i>) :
                          "List item"
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
                    </div>

              </form>
          </FormProvider>
        </div>
      </div>
    </>
  )
}
