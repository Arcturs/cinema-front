import React from "react";
import {
    Alert,
    Button,
    Link as LinkMui, Link,
    Snackbar, StyledEngineProvider,
    TextField,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import orderAPI from "../API/OrderAPI";

const ConfirmBookingComponent = () => {
    const [state, setState] = React.useState({
        orderId: "",
        cardNumber: ""
    });
    const [validationError, setValidationError] = React.useState({
        orderId: "",
        cardNumber: ""
    });
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const [accessMessage, setAccessMessage] = React.useState(null);
    const [openAccess, setOpenAccess] = React.useState(false);
    const navigation = useNavigate();

    const confirmBooking = (event: any) => {
        event.preventDefault();
        let data = {
            cardNumber: state.cardNumber
        }
        setErrorMessage(null);
        setAccessMessage(null);
        setValidationError({
            orderId: "",
            cardNumber: ""
        });
        orderAPI.confirmBooking(successConfirmBooking, failureConfirmBooking, state.orderId, data);
    }

    const successConfirmBooking = () => {
        setState({
            orderId: "",
            cardNumber: ""
        });
        navigation("/home");
        navigation(0);
    }

    const failureConfirmBooking = (error: any) => {
        if (error.response.status === 404) {
            setValidationError({
                ...validationError,
                orderId: error.response.data.message
            });
            return;
        }
        if (error.response.data.message) {
            setOpenError(true);
            setErrorMessage(error.response.data.message);
            return;
        }
        if (error.response.status === 403) {
            setOpenAccess(true);
            setAccessMessage(error.response.data);
            localStorage.setItem('token', "");
            localStorage.setItem('refreshToken', "");
            return;
        }
        setValidationError(error.response.data);
    }

    const change = (event: any) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
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
                                        Confirm Booking
                                    </Typography>

                                    <form onSubmit={confirmBooking}>

                                        {validationError.orderId
                                            ? <TextField error className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Order ID" variant="outlined"
                                                         type="text" value={state.orderId}
                                                         helperText={validationError.orderId} name="orderId"
                                                         onChange={change}/>
                                            : <TextField className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Order ID" variant="outlined"
                                                         type="text" value={state.orderId} name="orderId"
                                                         onChange={change}/>}

                                        {validationError.cardNumber
                                            ? <TextField error className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Card number" variant="outlined"
                                                         type="text" value={state.cardNumber}
                                                         helperText={validationError.cardNumber} name="cardNumber"
                                                         onChange={change}/>
                                            : <TextField className="text-field d-flex justify-content-center"
                                                         id="outlined-basic" label="Card number" variant="outlined"
                                                         type="text" value={state.cardNumber} name="cardNumber"
                                                         onChange={change}/>}

                                        <div className="d-flex justify-content-center">
                                            <Button type="submit"
                                                    className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
                                                Confirm booking
                                            </Button>
                                        </div>

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

                                    {accessMessage
                                        ? <Snackbar open={openAccess} autoHideDuration={10000}
                                                    onClose={() => setOpenAccess(false)}>
                                            <Alert className="alert" variant="filled" severity="error">
                                                Access denied! Visit <LinkMui href="/login" color="inherit">login page</LinkMui>
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

export default ConfirmBookingComponent;