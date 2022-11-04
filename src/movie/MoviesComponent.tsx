import React from "react";
import {
    Alert,
    InputBase,
    Radio,
    Paper,
    Typography,
    Link as LinkMui,
    IconButton,
    Box,
    Grid,
    StyledEngineProvider,
    Snackbar,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel, Checkbox, FormGroup, Button

} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {Link, useLocation, useNavigate} from "react-router-dom";
import querystring from "query-string";
import movieAPI from "../API/MovieAPI";
import urlBuilder from "../helpers/UrlBuilder";
import tokenHelper from "../helpers/TokenHelper";
import PaginationComponent from "../main/PaginationComponent";
import CreateMovieComponent from "./CreateMovieComponent";

const MoviesComponent = () => {
    const [state, setState] = React.useState({
        data: [],
        paging: {
            pageNumber: 1,
            pageSize: 2,
            totalPages: 1
        }
    });
    const [titleToSearch, setTitleToSearch] = React.useState("");
    const [sort, setSort] = React.useState("BY_RATING");
    const [isAsc, setIsAsc] = React.useState("true");

    const [errorMessage, setErrorMessage] = React.useState(null);
    const navigation = useNavigate();
    const location = useLocation();
    const [accessMessage, setAccessMessage] = React.useState(null);
    const [openError, setOpenError] = React.useState(false);
    const [openAccess, setOpenAccess] = React.useState(false);

    const getAllMovies = () => {
        let parsed = querystring.parse(location.search);
        let params = {
            title: parsed.title ? parsed.title : titleToSearch,
            pageNumber: parsed.pageNumber ? parsed.pageNumber : state.paging.pageNumber,
            size: parsed.size ? parsed.size : state.paging.pageSize,
            sort: parsed.sort ? parsed.sort : sort,
            isAsc: parsed.isAsc ? parsed.isAsc : isAsc
        };
        setTitleToSearch(`${params.title}`);
        setSort(`${params.sort}`);
        setIsAsc(`${params.isAsc}`);

        setErrorMessage(null);
        movieAPI.getAllMovies(successGet, failureGet, params);
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
            },
            {
                name: 'title',
                value: titleToSearch,
                default: ""
            },
            {
                name: 'sort',
                value: sort,
                default: "BY_RATING"
            },
            {
                name: 'isAsc',
                value: isAsc,
                default: "true"
            }
        ];
        let link = `/movie?${urlBuilder.buildQueryParams(params)}`;
        navigation(link);
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
        setErrorMessage(error.response.data.message);
        setOpenError(true);
    }

    const searchTitle = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setTitleToSearch(event.target.value);
    }

    const searchMovieByTitle = () => {
        state.paging.pageNumber = 1;
        adjustQueryString();
    }

    const sortBy = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSort((event.target as HTMLInputElement).value);
    };

    const setAsc = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAsc(isAsc === "true" ? "false" : "true");
    }

    const sortAndArrange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        state.paging.pageNumber = 1;
        adjustQueryString();
    };

    React.useEffect(() => getAllMovies(), []);

    const createMovieComponent = CreateMovieComponent(setErrorMessage, setOpenError, setAccessMessage, setOpenAccess);
    const paginationComponent = PaginationComponent(state.paging, adjustQueryString);

    return (
        <StyledEngineProvider injectFirst>
            <div className="container py-4">
                <div className="p-5 mb-4 bg-light rounded-3">
                    <div className="container-fluid py-5">
                        <Typography variant="h3" className="display-5 fw-bold">Movies</Typography>
                        <br/>
                        <Paper className="search">
                            <InputBase sx={{ml: 1, flex: 1}} placeholder="Search Movie" onChange={searchTitle}
                                       value={titleToSearch}/>
                            <IconButton sx={{p: '10px'}} aria-label="Search Movie" onClick={searchMovieByTitle}>
                                <SearchIcon/>
                            </IconButton>
                        </Paper>
                        <br/>
                        <form onSubmit={sortAndArrange}>
                            <div className="row">
                                <div className="col">
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Sort by</FormLabel>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="row-radio-buttons-group" value={sort} onChange={sortBy}>
                                            <FormControlLabel value="BY_RATING" control={<Radio/>} label="By Rating" />
                                            <FormControlLabel value="BY_TITLE" control={<Radio/>} label="By Title" />
                                            <FormControlLabel value="BY_DURATION" control={<Radio/>} label="By Duration" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <div className="col">
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={JSON.parse(isAsc)} onChange={setAsc}/>}
                                                          label="Is Ascending"/>
                                    </FormGroup>
                                </div>
                                <div className="col-6">
                                    <Button variant="outlined" type="submit">Sort</Button>
                                </div>
                            </div>
                        </form>
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

                        {tokenHelper.isAdmin() ? createMovieComponent : null}

                        <Box className="box h-100 p-5 bg-light border rounded-3">
                            {state.data.map((movie: any) => {
                                return (
                                    <Grid className="grid" key={movie.movieId}>
                                        <Grid item>
                                            <Typography variant="h5" className="link-element-in-grid">
                                                <Link to={`/movie/${movie.movieId}`} className="link">
                                                    {movie.title}
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

export default MoviesComponent;