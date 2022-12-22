import React from "react";
import {Alert, Link as LinkMui, Link, Snackbar, Typography, StyledEngineProvider} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import orderAPI from "../API/OrderAPI";
import tokenHelper from "../helpers/TokenHelper";
import CancelOrderComponent from "./CancelOrderComponent";
import BookOrderComponent from "./BookOrderComponent";
import PaymentComponent from "./PaymentComponent";

const OrderComponent = () => {

    const orderId = useParams().orderId;
    const [state, setState] = React.useState([{
        ticketId: "",
        session: {
            sessionId: "",
            startTime: "",
            endTime: "",
            price: "",
            screen: {
                screenNumber: ""
            },
            movie: {
                title: ""
            }
        },
        seat: {
            row: "",
            seatNumber: ""
        },
        orderId: "",
        isPaid: "",
        transactionEndTimestamp: ""
    }]);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const [accessMessage, setAccessMessage] = React.useState(null);
    const [openAccess, setOpenAccess] = React.useState(false);
    const navigation = useNavigate();

    const getOrderDetails = () => {
        orderAPI.getOrderDetails(successGet, failureGet, orderId);
    }

    const successGet = (response: any) => {
        setState(response.data);
    }

    const failureGet = (error: any) => {
        if (error.response.status === 404) {
            navigation('/error');
            navigation(0);
            return;
        }
        if (error.response.status === 403) {
            setAccessMessage(error.response.data);
            setOpenAccess(true);
            localStorage.setItem('token', "");
            localStorage.setItem('refreshToken', "");
            return;
        }
        setErrorMessage(error.response.data.message);
    }

    const cancelOrderComponent = CancelOrderComponent(orderId, setErrorMessage, setOpenError, setAccessMessage,
        setOpenAccess);
    const bookOrderComponent = BookOrderComponent(orderId, setErrorMessage, setOpenError, setAccessMessage,
        setOpenAccess);
    const paymentComponent = PaymentComponent(orderId, setErrorMessage, setOpenError, setAccessMessage,
        setOpenAccess);

    React.useEffect(() => getOrderDetails(), []);

    return (
        <StyledEngineProvider injectFirst>
            <div className="d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card">
                                <div className="card-body p-5">
                                    <Typography variant="h4" className="text-uppercase text-center mb-5">
                                        Order Details
                                    </Typography>
                                    <div className="main-verification-input-wrap">

                                        <div>
                                            <Typography variant="h5">Order ID: {state[0].orderId}</Typography>
                                            <Typography variant="h5">Price: {state[0].session.price}</Typography>
                                            <br/>
                                            <Typography variant="h5">Session details:</Typography>
                                            <Typography variant="h6">Title: {state[0].session.movie.title}</Typography>
                                            <Typography variant="h6">Screen number: {state[0].session.screen.screenNumber}</Typography>
                                            <Typography variant="h6">
                                                Start date and time: {state[0].session.startTime}
                                            </Typography>
                                            <Typography variant="h6">
                                                End date and time: {state[0].session.endTime}
                                            </Typography>
                                            <br/>
                                            <Typography variant="h5">Seats:</Typography>
                                            {state.map((ticket: any) => {
                                                return (
                                                    <Typography variant="h6">Row: {ticket.seat.row},
                                                        Seat: {ticket.seat.seatNumber}</Typography>
                                                );
                                            })}
                                            <br/>
                                            <Typography variant="h6">
                                                This order will be expired on {state[0].transactionEndTimestamp}
                                            </Typography>
                                        </div>
                                        <br/>

                                        {tokenHelper.isUser()
                                            ? <div>
                                                {cancelOrderComponent}
                                                <br/>
                                                {bookOrderComponent}
                                                <br/>
                                                {paymentComponent}
                                            </div>
                                            : null}

                                        <Typography className="text-center text-muted mt-5 mb-0">
                                            Go to <Link href="/home" className="fw-bold text-body">Home page</Link>
                                        </Typography>
                                    </div>
                                    {accessMessage
                                        ? <Snackbar open={openAccess} autoHideDuration={10000}
                                                    onClose={() => setOpenAccess(false)}>
                                            <Alert className="alert" variant="filled" severity="error">
                                                Access denied! Visit <LinkMui href="/login" color="inherit">login page</LinkMui>
                                            </Alert>
                                        </Snackbar> : null}

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

export default OrderComponent;