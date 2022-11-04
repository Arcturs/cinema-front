import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import React from "react";
import {useNavigate} from "react-router-dom";
import movieAPI from "../API/MovieAPI";

const UpdateMovieComponent = (state: {[key: string]: any}, setState: any, updateForm: any, setErrorMessage: any,
                              setOpenError: any, setAccessMessage: any, setOpenAccess: any, getMovie: any,
                              movieId: any) => {

    const [validationError, setValidationError] = React.useState({
        title: "",
        description: "",
        duration: "",
        poster: ""
    });
    const [openUpdate, setOpenUpdate] = React.useState(false);
    const navigation = useNavigate();

    const updateMovie = () => {
        setValidationError({
            title: "",
            description: "",
            duration: "",
            poster: ""
        });
        setErrorMessage(null);
        movieAPI.updateMovie(successUpdate, failureUpdate, movieId, updateForm);
    }

    const successUpdate = (response: any) => {
        setState(response.data);
        setOpenUpdate(false);
        navigation(0);
    }

    const failureUpdate = (error: any) => {
        if (error.response.data.message) {
            updateForm.set('title', state.title);
            updateForm.set('description', state.description);
            updateForm.set('duration', state.duration);
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

    const change = (event: any) => {
        updateForm.set(event.target.name, event.target.value);
        if (event.target.files) {
            updateForm.set(event.target.name, event.target.files[0]);
        }
    }

    return (
        <div className="admin-component">
            <Fab variant="extended" size="medium" color="inherit" aria-label="update"
                 onClick={() => setOpenUpdate(true)} className="fab">
                <CreateIcon sx={{mr: 1}}/>
                Update movie
            </Fab>
            <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} fullWidth>
                <DialogTitle className="dialog-title">Update movie</DialogTitle>
                <form encType="multipart/form-data">
                    <DialogContent>
                        {validationError.title
                            ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Title" variant="outlined" type="text"
                                         defaultValue={updateForm.get('title')}
                                         helperText={validationError.title} name="title" onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Title" variant="outlined" type="text"
                                         defaultValue={updateForm.get('title')}
                                         name="title" onChange={change}/>}

                        {validationError.description
                            ? <TextField error className="text-field d-flex justify-content-center"
                                         id="outlined-multiline-static" label="Description" variant="outlined"
                                         type="text" multiline rows={7} defaultValue={updateForm.get('description')}
                                         helperText={validationError.description} name="description" onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center"
                                         id="outlined-multiline-static"
                                         label="Description" variant="outlined" type="text" multiline rows={7}
                                         defaultValue={updateForm.get('description')} name="description"
                                         onChange={change}/>}

                        {validationError.duration
                            ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Duration" variant="outlined" type="text"
                                         defaultValue={updateForm.get('duration')} helperText={validationError.duration}
                                         name="duration" onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Duration" variant="outlined" type="text"
                                         helperText="In minutes or in HH:MM form"
                                         defaultValue={updateForm.get('duration')} name="duration" onChange={change}/>}

                        <input accept="image/*" id="contained-button-file" type="file" name="poster"
                               onChange={change}/>
                        {validationError.poster ?
                            <Alert severity="warning" className="alert">{validationError.poster}</Alert>
                            : null}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenUpdate(false);
                            navigation(0);
                        }}>Cancel</Button>
                        <Button onClick={updateMovie}>Update</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default UpdateMovieComponent;