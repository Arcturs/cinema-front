import axios from "axios";
import userAPI from "./UserAPI";

class OrderAPI {

    bookSeats(onSuccess: any, onFail: any, data: { [key: string]: any }) {
        axios.post(`${process.env.REACT_APP_API_URL}/order`, data, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    getOrderDetails(onSuccess: any, onFail: any, orderId: any) {
        axios.get(`${process.env.REACT_APP_API_URL}/order/${orderId}`, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    cancelOrder(onSuccess: any, onFail: any, orderId: any) {
        axios.delete(`${process.env.REACT_APP_API_URL}/order/${orderId}`, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    bookOrder(onSuccess: any, onFail: any, orderId: any) {
        axios.post(`${process.env.REACT_APP_API_URL}/order/${orderId}/book`, "",{
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    payOrder(onSuccess: any, onFail: any, orderId: any, data: { [key: string]: any }) {
        axios.post(`${process.env.REACT_APP_API_URL}/order/${orderId}/pay`, data, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    confirmBooking(onSuccess: any, onFail: any, orderId: any, data: { [key: string]: any }) {
        axios.post(`${process.env.REACT_APP_API_URL}/order/${orderId}/confirm-booking`, data, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }
}

let orderAPI = new OrderAPI();
export default orderAPI;