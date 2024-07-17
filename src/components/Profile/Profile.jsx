import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header/Header'
import './Profile.css'
import { Box, Button, Divider, IconButton, Toolbar } from '@mui/material'
import { Link } from 'react-router-dom'
import Input from '../Inputs/Input'
import { FormProvider, useForm } from 'react-hook-form'
import { validateUsername } from '../Validation/ValidateUsername'
import { validateFirstname } from '../Validation/ValidateFirsname'
import { validateLastname } from '../Validation/ValidateLastname'
import { validateEmail } from '../Validation/ValidateEmail'
import { validatePostalAddress } from '../Validation/ValidatePostalAddress'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from '../Context/UserContext'
import { ClientService } from '../Services/ClientService'

export default function Profile() {

    const [user, setUser] = useUser()
    const [userDetails, setUserDetails] = useState(null)
    const [userImage, setUserImage] = useState(null)
    const [editModeEnabled, setEditModeEnabled] = useState(false)
    const [resetImage, setResetImage] = useState(false)
    const imageHolder = useRef()
    const formMethods = useForm()
    const setValue = formMethods.setValue


    function replaceBg(event){
        const fileInput = event.target;
        const files = fileInput.files;
    
        if (files.length > 0) {
          const file = files[0];
          const reader = new FileReader();
    
          reader.onload = function(e) {
            imageHolder.current.style.backgroundImage = `url(${e.target.result})`;
          };
    
          reader.readAsDataURL(file);
        }
    }




    const saveChanges = formMethods.handleSubmit(
        values => {
            // console.log(values)
            const userImage = values.userImage ? values.userImage[0] : null
            const username = user.username
            ClientService.updateClient(
                username,
                values.firstname,
                values.lastname,
                values.username,
                values.email,
                values.postalAddress,
                userImage,
                resetImage
            )
            .then(
                axRes => {
                    console.log("updated with immaculate success")
                    setUser(axRes.data)
                    setEditModeEnabled(false)
                    setValue('userImage', '')
                }
            )
            .catch(
                axErr => console.log(axErr.response.data.details)
            )
        }
    )


    function cancelEditMode(){

        setValue('username', userDetails.username)
        setValue('firstname', userDetails.firstname)
        setValue('lastname', userDetails.lastname)
        setValue('email', userDetails.email)
        setValue('postalAddress', userDetails.postalAddress)
        setValue('userImage', '')
        setUserImage(userDetails.image)

        setEditModeEnabled(false)

        // console.log(imageInput.current.files)
    }



    function deleteImage(){
        setValue('userImage', '')
        setResetImage(true)
        if(userImage){
            setUserImage(null)
            return
        }
        imageHolder.current.style.backgroundImage = null;
    }



    // INITIALIZE USER INFO
    useEffect(() => {

        if(userDetails){

            // console.log(imageInput.current.files)  

            setValue('username', userDetails.username)
            setValue('firstname', userDetails.firstname)
            setValue('lastname', userDetails.lastname)
            setValue('email', userDetails.email)
            setValue('postalAddress', userDetails.postalAddress)

            setUserImage(userDetails.image)

        }
    }, [userDetails])




    // FETCH USER DETAILS
    useEffect(() => {
        if(user){
            ClientService.getClientByUsername(user.username)
            .then(
                axRes => {
                    // console.log(axRes.data)
                    setUserDetails(axRes.data)
                }
            )
            .catch(
                axErr => console.log(axErr.response.data.details)
            )
        }
    }, [user])



    

    return (
        <div className='wrapper-global profile_page_wrapper'>

        <Header/>

        <div className="profile_container">

            <h1 className="profile_title">Profile</h1>

            <div className="profile_inner_container">
                <div className="profile_links_container">
                    <ul className="profile_links">
                        <li>
                            <Link>
                                My Account
                            </Link>
                        </li>

                        <Divider className='lp_devider' variant='fullWidth' sx={{borderColor: 'rgb(224 224 224)'}}/>

                        <li>
                            <Link>
                                My Purchases
                            </Link>
                        </li>

                        <Divider className='lp_devider' variant='fullWidth' sx={{borderColor: 'rgb(224 224 224)'}}/>

                        <li>
                            <Link>
                                Change Password
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="profile_details_container">
                    
                    <Toolbar
                        className='profile_details_title'
                        sx={{
                            fontSize: "2rem",
                            borderBottom: '1px solid rgb(224, 224, 224)',
                            overflow: 'hidden',
                            padding: '0px !important',
                            marginBottom: '2rem'
                        }}
                    >
                        Personal information
                    </Toolbar>

                    <div className="profile_details">
                        <div className="profile_details_info_edit_container">

                            <Box 
                            display={'flex'}
                            gap={1} 
                            alignItems={'center'} 
                            justifyContent={'space-between'}
                            className={`${!editModeEnabled && 'hidden'}`}
                            >
                                <Button
                                color='primary'
                                variant='contained'
                                size='large'
                                onClick={(e) => saveChanges()}
                                >
                                    Save
                                </Button>


                                <Button
                                size='large'
                                color='warning'
                                variant='outlined'
                                onClick={cancelEditMode}
                                >
                                    Cancel
                                </Button>
                            </Box>

                            <p
                            onClick={(e) => setEditModeEnabled(true)}
                            className={`profile_details_info_edit ${editModeEnabled && 'hidden'}`}
                            >

                                <ModeEditIcon fontSize='large' htmlColor='blue'/>
                                <span>Change profile information</span>

                            </p>
                        </div>


                        <div className="profile_user_image_container">

                            {userDetails && userImage && userImage.imageData ? (
                                <img
                                className="profile_user_image"
                                src={`data:image/png;base64,${userImage.imageData}`} alt="" />
                            ): (
                                <div 
                                className="profile_user_image_placeholder"
                                ref={imageHolder}
                                >
                                    
                                </div>
                            )}

                            <IconButton className={`image_edit_icon ${!editModeEnabled && 'hidden'}`}>
                                <ModeEditIcon htmlColor='blue' sx={{fontSize: '20px'}}/>
                                <input
                                    type="file" 
                                    className='image_edit_file_input'
                                    {...formMethods.register('userImage')}
                                    onChange={(e) => {
                                        setResetImage(false)
                                        if(!userImage.imageData){
                                            replaceBg(e)
                                        } else{
                                            setUserImage(null)
                                            replaceBg(e)
                                        }
                                    }}
                                />
                            </IconButton>

                            <IconButton onClick={deleteImage} className={`image_delete_icon ${!editModeEnabled && 'hidden'}`}>
                                <CloseIcon 
                                htmlColor='red'
                                sx={{fontSize: '20px'}}
                                />
                            </IconButton>
                        </div>
                        <div className="profile_user_info">
                            <FormProvider {...formMethods}>

                                <form className="profile_user_info_form">

                                    <Input
                                        containerClass={"profile_user_info_firstname_container"}
                                        id={"profile_user_info_firstname_input"}
                                        inputClass={"profile_user_info_firstname_input"}
                                        label={"Firstname"}
                                        name={"firstname"}
                                        readOnly={!editModeEnabled}
                                        required={true}
                                        type={'text'}
                                        validation={validateFirstname}

                                    />

                                    <Input
                                        containerClass={"profile_user_info_lastname_container"}
                                        id={"profile_user_info_lastname_input"}
                                        inputClass={"profile_user_info_lastname_input"}
                                        label={"Lastname"}
                                        name={"lastname"}
                                        readOnly={!editModeEnabled}
                                        required={true}
                                        type={'text'}
                                        validation={validateLastname}

                                    />

                                    <Input
                                        containerClass={"profile_user_info_username_container"}
                                        id={"profile_user_info_username_input"}
                                        inputClass={"profile_user_info_username_input"}
                                        label={"Username"}
                                        name={"username"}
                                        readOnly={!editModeEnabled}
                                        required={true}
                                        type={'text'}
                                        validation={validateUsername}

                                    />

                                    <Input
                                        containerClass={"profile_user_info_email_container"}
                                        id={"profile_user_info_email_input"}
                                        inputClass={"profile_user_info_email_input"}
                                        label={"Email Address"}
                                        name={"email"}
                                        readOnly={true}
                                        required={true}
                                        type={'text'}
                                        validation={validateEmail}

                                    />

                                    <Input
                                        containerClass={"profile_user_info_postaladdress_container"}
                                        id={"profile_user_info_postaladdress_input"}
                                        inputClass={"profile_user_info_postaladdress_input"}
                                        label={"Postal Address"}
                                        name={"postalAddress"}
                                        readOnly={!editModeEnabled}
                                        required={true}
                                        type={'text'}
                                        validation={validatePostalAddress}

                                    />


                                </form>
                            </FormProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
