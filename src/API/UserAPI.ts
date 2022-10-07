import axios from "axios";

class UserAPI{

    login(data: {[key: string]: any}, onSuccess : any, onFail: any) {
        axios.post(`${process.env.REACT_APP_API_URL}/user/login`, data)
            .then(onSuccess)
            .catch(onFail);
    }

    getCredentials(onSuccess: any, onFail: any) {
        axios.get(`${process.env.REACT_APP_API_URL}/user/credentials`, {
            headers: {
                Authorization: this.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    signUp(onSuccess: any, onFail: any, data: {[key: string]: any}) {
        axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data)
            .then(onSuccess)
            .catch(onFail);
    }

    refreshToken(onSuccess: any, onFail: any, token: string) {
        axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {
            params: {
                refreshToken: token
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    authHeader() {
        let token = localStorage.getItem('token');
        return token ? 'Bearer ' + token : '';
    }
}

const userAPI = new UserAPI();
export default userAPI;