import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import React from "react";
import {
    Alert,
    Box,
    Typography,
    Link as LinkMui,
    ButtonGroup, StyledEngineProvider, Snackbar, Rating
} from "@mui/material";
import movieAPI from "../API/MovieAPI";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import tokenHelper from "../helpers/TokenHelper";
import ResourceRemovalDialogComponent from "../main/ResourceRemovalDialogComponent";
import UpdateMovieComponent from "./UpdateMovieComponent";

const MovieComponent = () => {

    const movieId = useParams().movieId;
    const [state, setState] = React.useState({
        movieId: "",
        title: "",
        description: "",
        duration: "",
        rating: 5.0,
        poster: null
    });
    const [updateForm, setUpdateForm] = React.useState(new FormData());
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [accessMessage, setAccessMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const [openAccess, setOpenAccess] = React.useState(false);
    const navigation = useNavigate();

    const getMovie = () => {
        movieAPI.getMovieInfo(success, failure, movieId);
    }

    const updateFormForUpdate = (data: any) => {
        updateForm.set('title', data.title);
        updateForm.set('description', data.description);
        updateForm.set('duration', data.duration);
    }

    const success = (response: any) => {
        setState(response.data);
        updateFormForUpdate(response.data);
    }

    const failure = (error: any) => {
        if (error.response.status == 404) {
            navigation('/error');
            navigation(0);
            return;
        }
        setErrorMessage(error.response.data.message);
        setOpenError(true);
    }

    React.useEffect(() => getMovie(), []);

    const updateComponent = UpdateMovieComponent(state, setState, updateForm, setErrorMessage, setOpenError,
        setAccessMessage, setOpenAccess, getMovie, movieId);
    const deleteComponent = ResourceRemovalDialogComponent(movieAPI.deleteMovie, movieId, 'movie',
        '/movie', setErrorMessage, setOpenError, setAccessMessage, setOpenAccess);

    return (
        <StyledEngineProvider injectFirst>
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <Typography variant="h3" className="display-5 fw-bold">Movie Info</Typography>
                    <br/>
                    {errorMessage
                        ? <Snackbar open={openError} autoHideDuration={10000}
                                    onClose={() => setOpenError(false)}>
                            <Alert className="error" variant="filled" severity="error">
                                {errorMessage}
                            </Alert>
                        </Snackbar> : null}
                    {accessMessage
                        ? <Snackbar open={openAccess} autoHideDuration={10000}
                                    onClose={() => setOpenAccess(false)}>
                            <Alert className="error" variant="filled" severity="error">
                                Access denied! Visit <LinkMui href="/login" color="inherit">login page</LinkMui>
                            </Alert>
                        </Snackbar> : null}

                    <Box className="box h-100 p-5 bg-light border rounded-3">
                        <div className="row">
                            <div className="col-6">
                                <Typography variant="h5">Movie title: {state.title}</Typography>
                                <br/>
                                <Typography variant="body1" style={{whiteSpace: 'pre-line'}}>
                                    {state.description}
                                </Typography>
                                <br/>
                                <Typography variant="h5"
                                            sx={{marginBottom: '15px'}}>Duration: {state.duration}</Typography>
                                <Typography variant="h5">Rating</Typography>
                                <Rating
                                    name="customized-color"
                                    value={state.rating}
                                    getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
                                    precision={0.5}
                                    icon={<FavoriteIcon fontSize="inherit" />}
                                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                                />

                                <div>
                                    <Link to={`/movie/${movieId}/sessions`} key={movieId}
                                          className="link btn btn-outline-info">
                                        All movie sessions for this movie
                                    </Link>
                                </div>
                                <br/>
                                {tokenHelper.isAdmin() ?
                                    <ButtonGroup variant="text">
                                        {updateComponent}
                                        {deleteComponent}
                                    </ButtonGroup> : null}
                            </div>
                            <div className="col">
                                <img src={movieAPI.getPosterUrl(movieId)} className="img img-responsive"/>
                            </div>
                        </div>
                    </Box>
                </div>
            </div>
            <Outlet/>
        </StyledEngineProvider>
    );
}

export default MovieComponent;
