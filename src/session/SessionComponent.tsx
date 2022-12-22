import {
    Alert,
    Box, Button, ButtonGroup, Checkbox, Link as LinkMui, Snackbar, StyledEngineProvider,
    Typography
} from "@mui/material";
import React from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import sessionAPI from "../API/SessionAPI";
import ResourceRemovalDialogComponent from "../main/ResourceRemovalDialogComponent";
import tokenHelper from "../helpers/TokenHelper";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import UpdateSessionComponent from "./UpdateSessionComponent";
import orderAPI from "../API/OrderAPI";

const SessionComponent = () => {

    const sessionId = useParams().sessionId;
    const [state, setState] = React.useState({
        sessionId: "",
        startTime: "",
        endTime: "",
        price: "",
        screen: {
            screenNumber: ""
        },
        movie: {
            description: "",
            title: ""
        },
        seatPlan: [
            {
                seatPlanForSessionId: "",
                seat: {
                    seatId: "",
                    row: "",
                    seatNumber: ""
                },
                isAvailable: true
            }
        ]
    });
    const [keys, setKeys] = React.useState([] as any);
    const [seats, setSeats] = React.useState([] as any);
    const [bookedSeats, setBookedSeats] = React.useState([] as any);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [accessMessage, setAccessMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const [openAccess, setOpenAccess] = React.useState(false);
    const navigation = useNavigate();

    const getSession = () => {
        sessionAPI.getSessionInfo(success, failure, sessionId);
    }

    const success = (response: any) => {
        setState(response.data);
        let map = response.data.seatPlan.reduce(function (r: { [x: string]: any[]; }, a: { seat: any }) {
            r[a.seat.row] = r[a.seat.row] || [];
            r[a.seat.row].push(a);
            return r;
        }, Object.create(null));
        setSeats(map);
        setKeys([...Object.getOwnPropertyNames(map)]);
    }

    const failure = (error: any) => {
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
        setOpenError(true);
    }

    const chooseSeat = (event: any) => {
        if (seats.includes(event.target.value)) {
            let index = bookedSeats.indexOf(event.target.value, 0);
            bookedSeats.splice(index, 1);
        } else {
            bookedSeats.push(event.target.value);
        }
    }

    const bookSeats = (event: any) => {
        event.preventDefault();
        setBookedSeats(bookedSeats);
        let seatPlan = {
            sessionId: sessionId,
            seatPlanForSessionIds: seats
        }
        orderAPI.bookSeats(bookSuccess, failure, seatPlan);
    }

    const bookSuccess = (response: any) => {
        setSeats([] as any);
        navigation(`/order/${response.data.orderId}`);
        navigation(0);
    }

    React.useEffect(() => getSession(), []);

    const updateComponent = UpdateSessionComponent(state, setState, sessionId, setErrorMessage, setOpenError,
        setAccessMessage, setOpenAccess);
    const deleteComponent = ResourceRemovalDialogComponent(sessionAPI.deleteSession, sessionId,
        'session', '/session', setErrorMessage, setOpenError, setAccessMessage, setOpenAccess);

    const seatPLanComponent =
        <form onSubmit={bookSeats}>

            {tokenHelper.isUser()
                ? <Button type="submit" className="btn btn-outline-secondary">Choose seat/seats</Button>
                : null}

            {keys.map((key: any) => {
                return (
                    <div className="p-5 mb-4 bg-light rounded-3">
                        <div style={{display: 'inline-block'}}>
                            <Typography variant="h5" sx={{marginRight: '10px'}} display="inline-block" color="primary">
                                {key}
                            </Typography>
                            {seats[key]
                                .sort((a: any, b: any) => a.seat.seatId > b.seat.seatId ? -1 : 1)
                                .map((seat: { [key: string]: any }) => {
                                    return (
                                        <Checkbox icon={<EventSeatIcon/>} checkedIcon={<EventSeatIcon color="primary"/>}
                                                  sx={{marginRight: '20px'}} disabled={!seat.isAvailable}
                                                  value={seat.seatPlanForSessionId} onChange={chooseSeat}/>
                                    );
                                })}
                        </div>
                    </div>
                );
            })}
        </form>

    return (
        <StyledEngineProvider injectFirst>
            <div className="container py-4">
                <div className="p-5 mb-4 bg-light rounded-3">
                    <div className="container-fluid py-5">
                        <Typography variant="h3">Session Info</Typography>
                        <br/>
                        {errorMessage
                            ? <Snackbar open={openError} autoHideDuration={10000}
                                        onClose={() => setOpenError(false)}>
                                <Alert className="alert" variant="filled" severity="error">
                                    {errorMessage}
                                </Alert>
                            </Snackbar> : null}

                        <Box className="box h-100 p-5 bg-light border rounded-3">
                            <Typography variant="h5">
                                Start date and time: {state.startTime}
                            </Typography>
                            <Typography variant="h5">
                                End date and time: {state.endTime}
                            </Typography>
                            <Typography variant="h6">Price: {state.price}</Typography>
                            <Typography variant="h6">Auditorium number: {state.screen.screenNumber}</Typography>
                            <br/>
                            <Typography variant="body1">Movie title: {state.movie.title}</Typography>
                            <Typography variant="body2">{state.movie.description}</Typography>

                            {accessMessage
                                ? <Snackbar open={openAccess} autoHideDuration={10000}
                                            onClose={() => setOpenAccess(false)}>
                                    <Alert className="alert" variant="filled" severity="error">
                                        Access denied! Visit <LinkMui href="/login" color="inherit">login page</LinkMui>
                                    </Alert>
                                </Snackbar> : null}

                            {seatPLanComponent}

                            <br/>

                            {tokenHelper.isAdmin()
                                ? <ButtonGroup variant="text">
                                    {updateComponent}
                                    {deleteComponent}
                                </ButtonGroup>
                                : null}
                        </Box>
                    </div>
                </div>
            </div>
            <Outlet/>
        </StyledEngineProvider>
    );
}

export default SessionComponent;