import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import {useNavigate} from "react-router-dom";
import screenAPI from "../API/ScreenAPI";

const CreateScreenComponent = (setErrorMessage: any, setOpenError: any, setAccessMessage: any, setOpenAccess: any) => {

    const [openCreate, setOpenCreate] = React.useState(false);
    const [validationError, setValidationError] = React.useState({
        rows: "",
        seats: ""
    });
    const [screen, setScreen] = React.useState({
        rows: "",
        seats: ""
    });
    const navigation = useNavigate();

    const createScreen = () => {
        setValidationError({
            rows: "",
            seats: ""
        })
        setErrorMessage(null);
        screenAPI.createScreen(successCreate, failCreate, screen);
    }

    const successCreate = (response: any) => {
        setScreen({
            rows: "",
            seats: ""
        });
        setOpenCreate(false);
        navigation(`screen/${response.data.screenId}`);
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
            setOpenAccess(false);
            setAccessMessage(error.response.data);
            localStorage.setItem('token', "");
            localStorage.setItem('refreshToken', "");
            return;
        }
        setValidationError(error.response.data);
    }

    const change = (event: any) => {
        setScreen({
            ...screen,
            [event.target.name]: event.target.value
        });
    }

    return (
        <div>
            <Fab variant="extended" size="medium" color="info" aria-label="add"
                 onClick={() => setOpenCreate(true)} className="fab">
                <AddIcon sx={{mr: 1}}/>
                Create screen
            </Fab>
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth>
                <DialogTitle className="dialog-title">Create screen</DialogTitle>
                <DialogContent>
                    {validationError.rows
                        ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                     label="Rows" variant="outlined" type="number" value={screen.rows}
                                     helperText={validationError.rows} name="rows" onChange={change}/>
                        : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                     label="Rows" variant="outlined" type="number" value={screen.rows} name="rows"
                                     onChange={change}/>}

                    {validationError.seats
                        ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                     label="Seats in a row" variant="outlined" type="number" value={screen.seats}
                                     helperText={validationError.seats} name="seats" onChange={change}/>
                        : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                     label="Seats in a row" variant="outlined" type="number" value={screen.seats}
                                     name="seats" onChange={change}/>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                    <Button onClick={createScreen}>Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateScreenComponent;