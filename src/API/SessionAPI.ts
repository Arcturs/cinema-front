import axios from "axios";
import userAPI from "./UserAPI";

class SessionAPI {

    getActualSessions(onSuccess: any, onFail: any, params: { [key: string]: any }) {
        axios.get(`${process.env.API_URL}/session`,
            {
                params: params
            })
            .then(onSuccess)
            .catch(onFail);
    }

    getSessionInfo(onSuccess: any, onFail: any, sessionId: any) {
        axios.get(`${process.env.API_URL}/session/${sessionId}`)
            .then(onSuccess)
            .catch(onFail);
    }

    createSession(onSuccess: any, onFail: any, data: {[key: string]: any}) {
        axios.post(`${process.env.API_URL}/session`, data, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    updateSession(onSuccess: any, onFail: any, sessionId: any, data: {[key: string]: any}) {
        axios.put(`${process.env.API_URL}/session/${sessionId}`, data, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    deleteSession(onSuccess: any, onFail: any, sessionId: any) {
        axios.delete(`${process.env.API_URL}/session/${sessionId}`, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }
}

let sessionAPI = new SessionAPI();
export default sessionAPI;