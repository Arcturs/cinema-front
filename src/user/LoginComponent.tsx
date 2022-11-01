import React from "react";
import {Alert, Button, Link, Snackbar, StyledEngineProvider, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import userAPI from "../API/UserAPI";

const LoginComponent = () => {

    const [state, setState] = React.useState({
        email: "",
        password: ""
    })
    const [validationError, setValidationError] = React.useState({
        email: "",
        password: ""
    })
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const navigation = useNavigate();

    const change = (event: any) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    const submit = (event: any) => {
        event.preventDefault();
        setValidationError({
            email: "",
            password: ""
        });
        setErrorMessage(null);
        userAPI.login(state, success, failure);
    }

    const success = (response: any) => {
        localStorage.setItem('token', response.data.tokens.access_token);
        localStorage.setItem('refreshToken', response.data.tokens.refresh_token);
        navigation('/home');
        navigation(0);
    }

    const failure = (error: any) => {
        if (error.response.data.message) {
            setErrorMessage(error.response.data.message);
            setOpenError(true);
            return;
        }
        setValidationError(error.response.data);
    }

    return (
        <StyledEngineProvider injectFirst>
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-7">
                            <div className="card">
                                <div className="card-body p-5">

                                    <Typography variant="h4" className="text-uppercase text-center mb-5">
                                        Login
                                    </Typography>

                                    <form onSubmit={submit}>

                                        {validationError.email
                                            ? <TextField error className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your email" variant="outlined"
                                                         type="text" value={state.email}
                                                         helperText={validationError.email} name="email"
                                                         onChange={change}/>
                                            : <TextField className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your email" variant="outlined"
                                                         type="text" value={state.email} name="email"
                                                         onChange={change}/>}

                                        {validationError.password
                                            ? <TextField error className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your password" variant="outlined"
                                                         type="password" value={state.password}
                                                         helperText={validationError.password} name="password"
                                                         onChange={change}/>
                                            : <TextField className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your password" variant="outlined"
                                                         type="password" value={state.password} name="password"
                                                         onChange={change}/>}

                                        <div className="d-flex justify-content-center">
                                            <Button type="submit"
                                                    className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
                                                Login
                                            </Button>
                                        </div>

                                        <Typography className="text-center text-muted mt-5 mb-0">Are you new here? <Link
                                            href="/sign-up" className="fw-bold text-body">Register here</Link>
                                        </Typography>

                                        <Typography className="text-center text-muted mt-5 mb-0">
                                            Go to <Link href="/home" className="fw-bold text-body">Home page</Link>
                                        </Typography>
                                    </form>

                                    <Snackbar open={openError} autoHideDuration={10000}
                                              onClose={() => setOpenError(false)}>
                                        <Alert className="alert" variant="filled" severity="error">
                                            {errorMessage}
                                        </Alert>
                                    </Snackbar>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StyledEngineProvider>
    );
}

export default LoginComponent;
