import axios from "axios";
import userAPI from "./UserAPI";

class MovieAPI {

    getAllMovies(onSuccess: any, onFail: any, params: { [key: string]: any }) {
        axios.get(`${process.env.API_URL}/movie`,
            {
                params: params
            })
            .then(onSuccess)
            .catch(onFail);
    }

    getMovieInfo(onSuccess: any, onFail: any, movieId: any) {
        axios.get(`${process.env.API_URL}/movie/${movieId}`)
            .then(onSuccess)
            .catch(onFail);
    }

    createMovie(onSuccess: any, onFail: any, data: {[key: string]: any}) {
        axios.post(`${process.env.API_URL}/movie`, data, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    updateMovie(onSuccess: any, onFail: any, movieId: any, data: {[key: string]: any}) {
        axios.put(`${process.env.API_URL}/movie/${movieId}`, data, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    deleteMovie(onSuccess: any, onFail: any, movieId: any) {
        axios.delete(`${process.env.API_URL}/movie/${movieId}`, {
            headers: {
                Authorization: userAPI.authHeader()
            }
        })
            .then(onSuccess)
            .catch(onFail);
    }

    getPosterUrl(movieId: any) {
        return `${process.env.API_URL}/movie/${movieId}/poster`;
    }

    getSessionsForMovie(onSuccess: any, onFail: any, movieId: any, params: {[key: string]: any}) {
        axios.get(`${process.env.API_URL}/movie/${movieId}/sessions`, {
            params: params
        })
            .then(onSuccess)
            .catch(onFail);
    }
}

let movieAPI = new MovieAPI();
export default movieAPI;