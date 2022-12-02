import React from 'react';
import {
    Alert, Autocomplete,
    Box,
    Grid, IconButton, Link as LinkMui,
    Paper,
    Snackbar, StyledEngineProvider, TextField,
    Typography
} from "@mui/material";
import {Link, useLocation, useNavigate} from "react-router-dom";
import querystring from 'query-string';
import SearchIcon from "@mui/icons-material/Search";
import sessionAPI from "../API/SessionAPI";
import urlBuilder from "../helpers/UrlBuilder";
import movieAPI from "../API/MovieAPI";
import PaginationComponent from "../main/PaginationComponent";
import tokenHelper from "../helpers/TokenHelper";

const SessionsComponent = () => {
    const [state, setState] = React.useState({
        data: [],
        paging: {
            pageNumber: 1,
            pageSize: 2,
            totalPages: 1
        }
    });
    const [movieId, setMovieId] = React.useState<any | null>(null);

    const [errorMessage, setErrorMessage] = React.useState(null);
    const navigation = useNavigate();
    const location = useLocation();
    const [accessMessage, setAccessMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const [openAccess, setOpenAccess] = React.useState(false);

    const [optionsMovie, setOptionsMovie] = React.useState<readonly any[]>([]);
    const [loadedMovie, setLoadedMovie] = React.useState(false);

    const getAllSessions = () => {
        setErrorMessage(null);
        let parsed = querystring.parse(location.search);
        let params = {
            pageNumber: parsed.pageNumber ? parsed.pageNumber : state.paging.pageNumber,
            size: parsed.size ? parsed.size : state.paging.pageSize,
            movieId: parsed.movieId ? parsed.movieId : movieId
        };

        sessionAPI.getActualSessions(successGet, failureGet, params);
    }

    const adjustQueryString = () => {
        let params = [
            {
                name: 'page',
                value: state.paging.pageNumber,
                default: 1
            },
            {
                name: 'size',
                value: state.paging.pageSize,
                default: 2
            },
            {
                name: 'movieId',
                value: movieId,
                default: null
            }
        ];
        navigation(`/session?${urlBuilder.buildQueryParams(params)}`);
        navigation(0);
    }

    const successGet = (response: any) => {
        const data = response.data.data;
        const paging = response.data.paging;
        setState({data, paging});
    }

    const failureGet = (error: any) => {
        if (error.response.status == 404) {
            navigation('/error');
            navigation(0);
            return;
        }
        setErrorMessage(error.response.data.message);
        setOpenError(true);
    }

    const getMovies = (title: any) => {
        movieAPI.getAllMovies(successGetMovies, failureGet, {
            pageNumber: 1,
            size: 20,
            title: title
        });
    }

    const successGetMovies = (response: any) => {
        setOptionsMovie(response.data.data);
    }

    const loadMovies = (event: any) => {
        if (event.target.value.length >= 3 && !loadedMovie) {
            setLoadedMovie(true);
            getMovies(event.target.value);
        }
        if (event.target.value.length < 3) {
            setOptionsMovie([]);
            setLoadedMovie(false);
        }
    }

    const changeMovieId = (event: any, newValue: any) => {
        if (newValue) {
            setMovieId(newValue.movieId);
        } else {
            setMovieId(null);
        }
    }

    const searchSessionByCinemaAndMovie = () => {
        state.paging.pageNumber = 1;
        adjustQueryString();
    }

    React.useEffect(() => getAllSessions(), []);

    const createSessionComponent = createSessionComponent(setErrorMessage, setOpenError,
        setAccessMessage, setOpenAccess);
    const paginationComponent = PaginationComponent(state.paging, adjustQueryString);

    return (
        <StyledEngineProvider injectFirst>
            <div className="container py-4">
                <div className="p-5 mb-4 bg-light rounded-3">
                    <div className="container-fluid py-5">
                        <Typography variant="h3" className="display-5 fw-bold">Sessions</Typography>
                        <br/>
                        <Paper className="search session-search">
                            <Autocomplete id="movie-select" getOptionLabel={(option: any) => option.title} value={movieId}
                                          isOptionEqualToValue={(option: any, value: any) => option.movieId === value}
                                          options={optionsMovie} onChange={changeMovieId} className="autocomplete-search"
                                          renderInput={(params) => (
                                              <TextField {...params} label="Movie" onChange={loadMovies}/>
                                          )}/>
                            <IconButton className="search-icon" onClick={searchSessionByCinemaAndMovie}>
                                <SearchIcon/>
                            </IconButton>
                        </Paper>
                        <br/>

                        {errorMessage
                            ? <Snackbar open={openError} autoHideDuration={10000} onClose={() => setOpenError(false)}>
                                <Alert className="alert" variant="filled" severity="error">
                                    {errorMessage}
                                </Alert>
                            </Snackbar> : null}

                        {accessMessage
                            ? <Snackbar open={openAccess} autoHideDuration={10000}
                                        onClose={() => setOpenAccess(false)}>
                                <Alert className="alert" variant="filled" severity="error">
                                    Access denied! Visit <LinkMui href="/login" color="inherit">login page</LinkMui>
                                </Alert>
                            </Snackbar> : null}

                        {tokenHelper.isAdmin() ? createSessionComponent : null}

                        <Box className="box h-100 p-5 bg-light border rounded-3">
                            {state.data.map((session: any) => {
                                return (
                                    <Grid className="grid" key={session.movieSessionId}>
                                        <Grid item>
                                            <Typography variant="h5" className="link-element-in-grid">
                                                <Link to={`/session/${session.sessionId}`} className="link">
                                                    Movie: {session.movie.title},
                                                    Date and Time: {session.startTime} {session.endTime}
                                                </Link>
                                            </Typography>
                                        </Grid>
                                    </Grid>);
                            })}
                        </Box>
                        {paginationComponent}
                    </div>
                </div>
            </div>
        </StyledEngineProvider>
    );
}

export default SessionsComponent;