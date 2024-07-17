import { serverApi } from "./AxiosConfig"


const getWeeklySales = (username) => {

    return serverApi.get(`/sales/weekly/${username}`)
}


const getAllSales = (username) => {

    return serverApi.get(`/sales/${username}`)
}


const getAllSalesByDate = (username, date) => {

    return serverApi.get(`/sales/byDate/${username}`, {
        params: {"date": date}
    })
}


export const SalesService = {
    getWeeklySales,
    getAllSales,
    getAllSalesByDate
}