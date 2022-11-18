import {
    Alert,
    Box,
    Checkbox, Link as LinkMui, Snackbar, StyledEngineProvider,
    Typography
} from "@mui/material";
import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import screenAPI from "../API/ScreenAPI";
import EventSeatIcon from '@mui/icons-material/EventSeat';

const ScreenComponent = () => {

    const screenId = useParams().screenId;
    const [state, setState] = React.useState({
        screenId: "",
        screenNumber: "",
        rows: "",
        seats: "",
        seatsSet: [] as any
    });
    const [keys, setKeys] = React.useState([] as any);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [accessMessage, setAccessMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const [openAccess, setOpenAccess] = React.useState(false);
    const navigation = useNavigate();

    const getScreen = () => {
        screenAPI.getScreenInfo(success, failure, screenId);
    }

    const success = (response: any) => {
        setState(response.data);
        setKeys([...Object.getOwnPropertyNames(response.data.seatsSet)]);
    }

    const failure = (error: any) => {
        if (error.response.status == 404) {
            navigation('/error');
            navigation(0);
            return;
        }
        setErrorMessage(error.response.data.message);
    }

    React.useEffect(() => getScreen(), []);

    return (
        <StyledEngineProvider injectFirst>
            <div className="container py-4">
                <div className="p-5 mb-4 bg-light rounded-3">
                    <div className="container-fluid py-5">
                        <Typography variant="h3">Screen Info</Typography>
                        <br/>
                        {errorMessage
                            ? <Snackbar open={openError} autoHideDuration={10000}
                                        onClose={() => setOpenError(false)}>
                                <Alert className="alert" variant="filled" severity="error">
                                    {errorMessage}
                                </Alert>
                            </Snackbar> : null}

                        <Box className="box h-100 p-5 bg-light border rounded-3">
                            <Typography variant="h5">Screen number: {state.screenNumber}</Typography>
                            <Typography variant="body1">Rows: {state.rows}</Typography>
                            <Typography variant="body1" sx={{marginBottom: '15px'}}>
                                Seats in a row: {state.seats}
                            </Typography>

                            {accessMessage
                                ? <Snackbar open={openAccess} autoHideDuration={10000}
                                            onClose={() => setOpenAccess(false)}>
                                    <Alert className="alert" variant="filled" severity="error">
                                        Access denied! Visit <LinkMui href="/login" color="inherit">login page</LinkMui>
                                    </Alert>
                                </Snackbar> : null}
                        </Box>
                    </div>
                </div>

                {keys.map((key: any) => {
                    return (
                        <div className="p-5 mb-4 bg-light rounded-3">
                            <div style={{display: 'inline-block'}}>
                                <Typography variant="h5" sx={{marginRight: '10px'}} display="inline-block"
                                            color="primary">
                                    {key}
                                </Typography>
                                {state.seatsSet[key]
                                    .sort((a: any, b: any) => a.seatId > b.seatId ? -1 : 1)
                                    .map((seat: { [key: string]: any }) => {
                                        return (
                                            <Checkbox icon={<EventSeatIcon/>} disabled
                                                      sx={{marginRight: '30px'}} value={seat.seatId}/>
                                        );
                                    })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </StyledEngineProvider>
    );
}

export default ScreenComponent;