import React from 'react';
import {
    Alert,
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Fab,
    FormControl,
    Grid,
    IconButton,
    InputBase,
    InputLabel, Link as LinkMui,
    MenuItem,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent, Snackbar, StyledEngineProvider, TextField,
    Typography
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import querystring from 'query-string';
import auditoriumApi from "../../server/AuditoriumApi";
import urlBuilder from "../../server/UrlBuilder";
import CreateAuditoriumComponent from "./CreateAuditoriumComponent";
import PaginationComponent from "../../menu/PaginationComponent";
import screenAPI from "../API/ScreenAPI";
import tokenHelper from "../helpers/TokenHelper";

const ScreensComponent = () => {
    const [state, setState] = React.useState({
        data: [],
        paging: {
            pageNumber: 1,
            pageSize: 2,
            totalPages: 1
        }
    });
    const [errorMessage, setErrorMessage] = React.useState(null);
    const navigation = useNavigate();
    const location = useLocation();
    const [accessMessage, setAccessMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const [openAccess, setOpenAccess] = React.useState(false);

    const getAllScreens = () => {
        let parsed = querystring.parse(location.search);
        let params = {
            pageNumber: parsed.pageNumber ? parsed.pageNumber : state.paging.pageNumber,
            size: parsed.size ? parsed.size : state.paging.pageSize
        };

        setErrorMessage(null);
        screenAPI.getAllScreens(successGet, failureGet, params);
    }

    const adjustQueryString = () => {
        let params = [
            {
                name: 'pageNumber',
                value: state.paging.pageNumber,
                default: 1
            },
            {
                name: 'size',
                value: state.paging.pageSize,
                default: 2
            }
        ];
        navigation(`/screen?${urlBuilder.buildQueryParams(params)}`);
        navigation(0);
    }

    const successGet = (response: any) => {
        const data = response.data.data;
        const paging = response.data.paging;
        setState({data, paging});
    }

    const failureGet = (error: any) => {
        if (error.response.status == 404) {
            navigation('/error');
            navigation(0);
            return;
        }
        setErrorMessage(error.response.data.error.message);
        setOpenError(true);
    }

    React.useEffect(() => {
        getAllScreens()
    }, []);

    const createScreenComponent = CreateScreenComponent(setErrorMessage, setOpenError, setAccessMessage,
        setOpenAccess);
    const paginationComponent = PaginationComponent(state.paging, adjustQueryString);

    return (
        <StyledEngineProvider injectFirst>
            <div className="container py-4">
                <div className="p-5 mb-4 bg-light rounded-3">
                    <div className="container-fluid py-5">
                        <Typography variant="h3" className="display-5 fw-bold">Screens</Typography>
                        <br/>
                        {errorMessage
                            ? <Snackbar open={openError} autoHideDuration={10000} onClose={() => setOpenError(false)}>
                                <Alert className="alert" variant="filled" severity="error">
                                    {errorMessage}
                                </Alert>
                            </Snackbar> : null}

                        {accessMessage
                            ? <Snackbar open={openAccess} autoHideDuration={10000}
                                        onClose={() => setOpenAccess(false)}>
                                <Alert className="alert" variant="filled" severity="error">
                                    Access denied! Visit <LinkMui href="/login" color="inherit">login page</LinkMui>
                                </Alert>
                            </Snackbar> : null}

                        {tokenHelper.isAdmin() ? createScreenComponent : null}

                        <Box className="box h-100 p-5 bg-light border rounded-3">
                            {state.data.map((screen: any) => {
                                return (
                                    <Grid className="grid" key={screen.screenId}>
                                        <Grid item>
                                            <Typography variant="h5" className="link-element-in-grid">
                                                <Link to={`screen/${screen.screenId}`}
                                                      className="link">
                                                    Screen {screen.screenNumber}
                                                </Link>
                                            </Typography>
                                        </Grid>
                                    </Grid>);
                            })}
                        </Box>
                        {paginationComponent}
                    </div>
                </div>
            </div>
        </StyledEngineProvider>
    );
}

export default ScreensComponent;