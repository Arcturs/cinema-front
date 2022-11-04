import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import {useNavigate} from "react-router-dom";
import movieAPI from "../API/MovieAPI";

const CreateMovieComponent = (setErrorMessage: any, setOpenError: any, setAccessMessage: any, setOpenAccess: any) => {

    const [movie, setMovie] = React.useState(new FormData());
    const [validationError, setValidationError] = React.useState({
        title: "",
        description: "",
        duration: "",
        poster: ""
    });
    const [openCreate, setOpenCreate] = React.useState(false);
    const navigation = useNavigate();

    const createMovie = () => {
        setValidationError({
            title: "",
            description: "",
            duration: "",
            poster: ""
        });
        setErrorMessage(null);
        movieAPI.createMovie(successCreate, failCreate, movie);
    }

    const successCreate = (response: any) => {
        setMovie(new FormData());
        setOpenCreate(false);
        navigation(`/movie`);
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

    const change = (event: any) => {
        movie.set(event.target.name, event.target.value);
        if (event.target.files) {
            movie.set(event.target.name, event.target.files[0]);
        }
    }

    return (
        <div>
            <Fab variant="extended" size="medium" color="info" aria-label="add"
                 onClick={() => setOpenCreate(true)} className="fab">
                <AddIcon sx={{mr: 1}}/>
                Create movie
            </Fab>
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth>
                <DialogTitle className="dialog-title">Create movie</DialogTitle>
                <form encType="multipart/form-data">
                    <DialogContent>
                        {validationError.title
                            ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Title" variant="outlined" type="text" defaultValue={movie.get('title')}
                                         helperText={validationError.title} name="title" onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Title" variant="outlined" type="text" defaultValue={movie.get('title')}
                                         name="title" onChange={change}/>}

                        {validationError.description
                            ? <TextField error className="text-field d-flex justify-content-center"
                                         id="outlined-multiline-static" label="Description" variant="outlined"
                                         type="text" multiline rows={7} defaultValue={movie.get('description')}
                                         helperText={validationError.description} name="description" onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-multiline-static"
                                         label="Description" variant="outlined" type="text" multiline rows={7}
                                         defaultValue={movie.get('description')} name="description" onChange={change}/>}

                        {validationError.duration
                            ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Duration" variant="outlined" type="text"
                                         defaultValue={movie.get('duration')}
                                         helperText={validationError.duration} name="duration" onChange={change}/>
                            : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                         label="Duration" variant="outlined" type="text"
                                         defaultValue={movie.get('duration')} helperText="In minutes or in HH:MM form"
                                         name="duration" onChange={change}/>}

                        <input accept="image/*" id="contained-button-file" type="file" name="poster"
                               onChange={change}/>
                        {validationError.poster ?
                            <Alert severity="warning" className="alert">{validationError.poster}</Alert>
                            : null}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                        <Button onClick={createMovie}>Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default CreateMovieComponent;