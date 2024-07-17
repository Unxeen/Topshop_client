import axios from "axios";
import { serverApi } from "./AxiosConfig";


// PRODUCT RELATED

const searchProducts = (label, price1, price2, category, index, size) => {

    return serverApi.post("/product/search", {
        label,
        price1,
        price2,
        category,
        index,
        size
    })
}

const searchPopularProducts = () => {
    return serverApi.post("/product/search", {
        index: 0,
        size: 4
    })
}


const getAllByUsername = username => {

    return serverApi.get(`/product/all/${username}`)
}


const getProductById = (id) => {
    return serverApi.get("/product/byId/" + id)
}

const saveProduct = (label, description, price, image, stock, username, cat) => {
    
    const formData = new FormData();
    formData.append('label', label);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image); // Ensure 'image' is a File object
    formData.append('stock', stock);
    formData.append('username', username);
    formData.append('cat', cat);
    return serverApi.post("/product/save", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}


const updateProduct = (id, label, description, price, stock, cat) => {

    return serverApi.put(`/product/update/${id}`, {
        label,
        description,
        price,
        stock,
        cat
    })
}


const deleteProduct = (id) => {
    return serverApi.delete(`/product/delete/${id}`)
}



// CART RELATED
const addToCart = (username, productId, quantity, totalPrice) => {

    return serverApi.post("/cart/add", {
        username,
        productId,
        quantity,
        totalPrice
    })
}


const getLineProductById = id => {

    return serverApi.get(`/cart/lp/${id}`)
}


const getCart = (username) => {
    
    return serverApi.get("/cart", {
        params: {
            username
        }
    })
}



const deleteLp = (id) => {

    return serverApi.delete(`/cart/delete/${id}`)
}




const updateLp = (quantity, id) => {

    return serverApi.put(`/cart/update/${id}`, {
        quantity
    })
}






// VIEW RELATED
const addView = (id) => {

    return serverApi.get(`/product/addView/${id}`)
}





// PRODUCT REVIEW RELATED
const submitReview = (productId, username, rating, header, comment) => {

    return serverApi.post("/product/reviews/save", {
        productId,
        username,
        rating,
        header,
        comment
    })
}

const getProductReviews = id => {

    return serverApi.get(`/product/reviews/${id}`)
}



export const ProductService = {
    searchProducts,
    searchPopularProducts,
    saveProduct,
    getProductById,
    addToCart,
    getCart,
    deleteLp,
    updateLp,
    addView,
    getLineProductById,
    getAllByUsername,
    updateProduct,
    deleteProduct,
    submitReview,
    getProductReviews
}