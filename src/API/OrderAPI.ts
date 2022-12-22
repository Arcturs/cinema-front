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
}

let orderAPI = new OrderAPI();
export default orderAPI;