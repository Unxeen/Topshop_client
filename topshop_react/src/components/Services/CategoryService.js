import axios from "axios";
import { serverApi } from "./AxiosConfig";



const getCategories = () => {
    return serverApi.get("/category/all")
}

export const CategoryService = {
    getCategories
}