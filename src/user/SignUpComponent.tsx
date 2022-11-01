import {Alert, Button, Link, Snackbar, StyledEngineProvider, TextField, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";
import userAPI from "../API/UserAPI";

const SignUpComponent = () => {
    const [state, setState] = React.useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        repeatPassword: ""
    });
    const [validationError, setValidationError] = React.useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        repeatPassword: ""
    });
    const [errorMessage, setErrorMessage] = React.useState(null);
    const navigation = useNavigate();
    const [openError, setOpenError] = React.useState(false);

    const change = (event: any) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }

    const submit = (event: any) => {
        event.preventDefault();
        setValidationError({
            name: "",
            surname: "",
            email: "",
            password: "",
            repeatPassword: ""
        });
        setErrorMessage(null);
        userAPI.signUp(success, failure, state);
    }

    const success = (response: any) => {
        localStorage.setItem('token', response.data.tokens.access_token);
        localStorage.setItem('refresh_token', response.data.tokens.refresh_token);
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
                                        Sign up
                                    </Typography>

                                    <form onSubmit={submit}>

                                        {validationError.email
                                            ? <TextField error className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your email" variant="outlined"
                                                         type="text" value={state.email}
                                                         helperText={validationError.email} name="email" onChange={change}/>
                                            : <TextField className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your email" variant="outlined"
                                                         type="text" value={state.email} name="email" onChange={change}/>}

                                        {validationError.name
                                            ? <TextField error className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your name" variant="outlined"
                                                         type="text" value={state.name} helperText={validationError.name}
                                                         name="name" onChange={change}/>
                                            : <TextField className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your name" variant="outlined"
                                                         type="text" value={state.name} name="name" onChange={change}/>}

                                        {validationError.surname
                                            ? <TextField error className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your surname" variant="outlined"
                                                         type="text" value={state.surname}
                                                         helperText={validationError.surname} name="surname"
                                                         onChange={change}/>
                                            : <TextField className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Your surname" variant="outlined"
                                                         type="text" value={state.surname} name="surname"
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

                                        {validationError.repeatPassword
                                            ? <TextField error className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Repeat your password"
                                                         variant="outlined" type="password" value={state.repeatPassword}
                                                         helperText={validationError.repeatPassword} name="repeatPassword"
                                                         onChange={change}/>
                                            : <TextField className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Repeat your password"
                                                         variant="outlined" type="password" value={state.repeatPassword}
                                                         name="repeatPassword" onChange={change}/>}

                                        <div className="d-flex justify-content-center">
                                            <Button type="submit"
                                                    className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
                                                Sign up
                                            </Button>
                                        </div>

                                        <Typography className="text-center text-muted mt-5 mb-0">
                                            Have already an account? <Link href="/login"
                                                                           className="fw-bold text-body">Login here</Link>
                                        </Typography>

                                        <Typography className="text-center text-muted mt-5 mb-0">
                                            Go to <Link href="/home" className="fw-bold text-body">Home page</Link>
                                        </Typography>
                                    </form>

                                    {errorMessage
                                        ? <Snackbar open={openError} autoHideDuration={10000}
                                                    onClose={() => setOpenError(false)}>
                                            <Alert className="alert" variant="filled" severity="error">
                                                {errorMessage}
                                            </Alert>
                                        </Snackbar> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StyledEngineProvider>
    );
}

export default SignUpComponent;