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
import CreateIcon from "@mui/icons-material/Create";
import React from "react";
import {useNavigate} from "react-router-dom";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {format} from "date-fns";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import screenAPI from "../API/ScreenAPI";
import sessionAPI from "../API/SessionAPI";

const UpdateSessionComponent = (state: {[key: string]: any}, setState: any, sessionId: any, setErrorMessage: any,
                                setOpenError: any, setAccessMessage: any, setOpenAccess: any) => {

    const [validationError, setValidationError] = React.useState({
        screenId: "",
        startDate: "",
        startTime: "",
        price: ""
    });
    const [start, setStart] = React.useState({
        date: "",
        time: ""
    });
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const navigation = useNavigate();
    const [screens, setScreens] = React.useState([]);

    const getScreens = () => {
        screenAPI.getAllScreens(getScreensSuccess, failureUpdate, {
            pageNumber: 1,
            size: 20
        });
    }

    const getScreensSuccess = (response: any) => {
        setScreens(response.data.data);
        setStart({
            date: state.startTime.split(' ')[0],
            time: state.startTime.split(' ')[1]
        })
    }

    const updateSession = () => {
        setValidationError({
            screenId: "",
            startDate: "",
            startTime: "",
            price: ""
        });
        setErrorMessage(null);
        let updateBody = {
            movieId: state.movie.movieId,
            screenId: state.screen.screenId,
            startDate: start.date,
            startTime: start.time,
            price: state.price
        };
        sessionAPI.updateSession(successUpdate, failureUpdate, sessionId, updateBody);
    }

    const successUpdate = () => {
        setOpenUpdate(false);
        navigation(0);
    }

    const failureUpdate = (error: any) => {
        if (error.response.data.message) {
            setErrorMessage(error.response.data.message);
            setOpenUpdate(false);
            setOpenError(true)
            return;
        }
        if (error.response.status === 403) {
            setAccessMessage(error.response.data);
            setOpenAccess(true);
            localStorage.setItem('token', "");
            localStorage.setItem('refreshToken', "");
            setOpenUpdate(false);
            return;
        }
        setValidationError(error.response.data);
    }

    const changeScreenId = (event: any, newValue: any) => {
        setState((prevState: { screen: any; }) => ({
            ...prevState,
            screen: {
                ...prevState.screen,
                screenId: newValue.screenId,
                screenNumber: newValue.screenNumber
            }
        }));
    }

    const change = (event: any) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    const getDate = (dateInString: string) => {
        let dates = dateInString.split(" ")[0].split(".");
        return new Date(+dates[2], +dates[1] - 1, +dates[0]);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
            <div className="admin-component">
                <Fab variant="extended" size="medium" color="inherit" aria-label="add"
                     onClick={() => {
                         setOpenUpdate(true);
                         getScreens();
                     }} className="fab">
                    <CreateIcon sx={{mr: 1}}/>
                    Update session
                </Fab>
                <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} fullWidth>
                    <DialogTitle className="dialog-title">Update session</DialogTitle>
                    <DialogContent>
                        <Autocomplete id="auditorium-select" getOptionLabel={(option: any) => option.screenNumber}
                                      value={state.screen} options={screens} onChange={changeScreenId}
                                      isOptionEqualToValue={(option: any, value: any) => option.screenNumber === value.screenNumber}
                                      className="text-field d-flex justify-content-center"
                                      renderInput={(params) => (
                                          <TextField {...params} label="Screen number"/>
                                      )}/>
                        {validationError.screenId
                            ? <Alert severity="warning" className="alert">{validationError.screenId}</Alert>
                            : null}

                        <DatePicker className="text-field d-flex justify-content-center" mask={"__.__.____"}
                                    value={getDate(start.date)}
                                    label="Start date" onChange={(newValue: any) => setStart({
                            ...start,
                            date: format(newValue,"dd.MM.yyyy")})}
                        renderInput={(params) => <TextField className="text-field d-flex justify-content-center" {...params}/>}/>
                        {validationError.startDate
                            ? <Alert severity="warning" className="alert">{validationError.startDate}</Alert>
                            : null}

                        {validationError.startTime
                            ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Start time" variant="outlined" type="text" name="startTime"
                                         value={start.time} helperText={validationError.startTime}
                                         onChange={(event: any) => setStart({
                                             ...start,
                                             time: event.target.value})}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                         name="startTime" label="Start time" variant="outlined" type="text"
                                         value={start.time}
                                         onChange={(event: any) => setStart({
                                             ...start,
                                             time: event.target.value})}/>}

                        {validationError.price
                            ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Price" variant="outlined" type="number" value={state.price} name="price"
                                         helperText={validationError.price} onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-basic" name="price"
                                         label="Price" variant="outlined" type="number" value={state.price} onChange={change}/>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenUpdate(false);
                            navigation(0);
                        }}>Cancel</Button>
                        <Button onClick={updateSession}>Update</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </LocalizationProvider>
    );
}

export default UpdateSessionComponent;