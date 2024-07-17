import { serverApi } from "./AxiosConfig"



const getClientByUsername = username => {

    return serverApi.get(`client/${username}`)
}



const updateClient = (originalUsername, firstname, lastname, username, email, postalAddress, image, imageReset) => {

    const userInfo = new FormData()
    userInfo.append("firstname", firstname)
    userInfo.append("lastname", lastname)
    userInfo.append("username", username)
    userInfo.append("email", email)
    userInfo.append("postalAddress", postalAddress)
    userInfo.append("imageReset", imageReset)
    if(image){
        userInfo.append("image", image)
    }
    // console.log(userInfo.get('image'))

    return serverApi.put(`/client/update/${originalUsername}`, userInfo, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}



export const ClientService = {
    getClientByUsername,
    updateClient
}