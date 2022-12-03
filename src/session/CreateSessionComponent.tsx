import React from "react";
import {
    Alert, Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ruLocale from 'date-fns/locale/ru';
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import screenAPI from "../API/ScreenAPI";
import sessionAPI from "../API/SessionAPI";
import movieAPI from "../API/MovieAPI";

const CreateSessionComponent = (setErrorMessage: any, setOpenError: any, setAccessMessage: any,
                                     setOpenAccess: any,) => {

    const [session, setSession] = React.useState({
        movieId: "",
        screenId: "",
        startDate: format(new Date(), "dd.MM.yyyy"),
        startTime: "",
        price: ""
    });
    const [date, setDate] = React.useState(new Date());
    const [validationError, setValidationError] = React.useState({
        movieId: "",
        screenId: "",
        startDate: "",
        startTime: "",
        price: ""
    });
    const [screens, setScreens] = React.useState([]);
    const [openCreate, setOpenCreate] = React.useState(false);
    const [optionsMovie, setOptionsMovie] = React.useState<readonly any[]>([]);
    const [loadedMovie, setLoadedMovie] = React.useState(false);
    const navigation = useNavigate();

    React.useEffect(() => getScreens(), []);

    const getScreens = () => {
        screenAPI.getAllScreens(getScreensSuccess, failCreate, {
            pageNumber: 1,
            size: 20
        });
    }

    const getScreensSuccess = (response: any) => {
        setScreens(response.data.data);
    }

    const createMovieSession = () => {
        setValidationError({
            movieId: "",
            screenId: "",
            startDate: "",
            startTime: "",
            price: ""
        });
        setErrorMessage(null);
        sessionAPI.createSession(successCreate, failCreate, session);
    }

    const successCreate = (response: any) => {
        setSession({
            movieId: "",
            screenId: "",
            startDate: "",
            startTime: "",
            price: ""
        });
        setOpenCreate(false);
        navigation(`/session`);
        navigation(0);
    }

    const failCreate = (error: any) => {
        if (error.response.data.message) {
            setOpenCreate(false);
            setOpenError(true);
            setErrorMessage(error.response.data.message);
            return;
        }
        if (error.response.status === 403) {
            setOpenCreate(false);
            setOpenAccess(true);
            setAccessMessage(error.response.data);
            localStorage.setItem('token', "");
            localStorage.setItem('refreshToken', "");
            return;
        }
        setValidationError(error.response.data);
    }

    const getMovies = (title: any) => {
        movieAPI.getAllMovies(successGetMovies, failCreate, {
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
        setSession({
            ...session,
            movieId: newValue.movieId
        });
    }

    const changeScreenId = (event: any, newValue: any) => {
        setSession({
            ...session,
            screenId: newValue.screenId
        });
    }

    const change = (event: any) => {
        setSession({
            ...session,
            [event.target.name]: event.target.value
        });
    }

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                <Fab variant="extended" size="medium" color="info" aria-label="add"
                     onClick={() => setOpenCreate(true)} className="fab">
                    <AddIcon sx={{mr: 1}}/>
                    Create session
                </Fab>
                <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth>
                    <DialogTitle className="dialog-title">Create session</DialogTitle>
                    <DialogContent>

                        <Autocomplete id="auditorium-select" getOptionLabel={(option: any) => option.screenNumber}
                                      isOptionEqualToValue={(option: any, value: any) => option.screenNumber === value.screenNumber}
                                      options={screens} onChange={changeScreenId}
                                      className="text-field d-flex justify-content-center"
                                      renderInput={(params) => (
                                          <TextField {...params} label="Screen number"/>
                                      )}/>
                        {validationError.screenId
                            ? <Alert severity="warning" className="alert">{validationError.screenId}</Alert>
                            : null}

                        <Autocomplete id="movie-select" getOptionLabel={(option: any) => option.title}
                                      isOptionEqualToValue={(option: any, value: any) => option.title === value.title}
                                      options={optionsMovie} onChange={changeMovieId}
                                      className="text-field d-flex justify-content-center"
                                      renderInput={(params) => (
                                          <TextField {...params} label="Movie" onChange={loadMovies}/>
                                      )}/>
                        {validationError.movieId
                            ? <Alert severity="warning" className="alert">{validationError.movieId}</Alert>
                            : null}

                        <DatePicker mask={"__.__.____"}
                                    value={date}
                                    label="Start date" onChange={(newValue: any) => {
                            setSession({
                                ...session,
                                startDate: format(newValue, "dd.MM.yyyy")
                            });
                            setDate(newValue);
                        }} renderInput={(params) => <TextField className="text-field d-flex justify-content-center" {...params}/>}/>
                        {validationError.startDate
                            ? <Alert severity="warning" className="alert">{validationError.startDate}</Alert>
                            : null}

                        {validationError.startTime
                            ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Start time" variant="outlined" type="text" name="startTime"
                                         value={session.startTime} helperText={validationError.startTime}
                                         onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                         name="startTime" label="Start time" variant="outlined" type="text"
                                         value={session.startTime} onChange={change}/>}

                        {validationError.price
                            ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Price" variant="outlined" type="number" value={session.price}
                                         name="price"
                                         helperText={validationError.price} onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                         name="price"
                                         label="Price" variant="outlined" type="number" value={session.price}
                                         onChange={change}/>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                        <Button onClick={createMovieSession}>Create</Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </div>
    );
}

export default CreateSessionComponent;