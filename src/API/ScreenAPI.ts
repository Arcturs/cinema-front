import axios from "axios";
import userAPI from "./UserAPI";

class ScreenAPI {

    getAllScreens(onSuccess: any, onFail: any, params: {[key: string]: any}) {
        axios.get(`${process.env.REACT_APP_API_URL}/screen`, {
            params: params
        })
            .then(onSuccess)
            .catch(onFail);
    }

    getScreenInfo(onSuccess: any, onFail: any, screenId: any) {
        axios.get(`${process.env.REACT_APP_API_URL}/screen/${screenId}`)
            .then(onSuccess)
            .catch(onFail);
    }

    createScreen(onSuccess: any, onFail: any, data: {[key: string]: any}) {
        axios.post(`${process.env.REACT_APP_API_URL}/screen`, data, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }
}

let screenAPI = new ScreenAPI();
export default screenAPI;