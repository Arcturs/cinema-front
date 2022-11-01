import React from "react";
import {Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import UserAPI from "../API/UserAPI";

const MenuComponent = () => {

    const navigation = useNavigate();
    const [user, setUser] = React.useState({
        name: "",
        roles: [
            {
                roleId: 0,
                roleName: ""
            }
        ]
    });

    React.useEffect(() => {
        if (!Boolean(user.name)) {
            getCredentials();
        }
    });

    const getCredentials = () => {
        UserAPI.getCredentials(success, failure);
    }

    const success = (response: any) => {
        setUser(response.data);
    }

    const failure = (error: any) => {
        console.log(error.response.status)
        if (error.response.status === 403) {
            //refresh token
            return;
        }
        navigation('/error');
        navigation(0);
    }

    const logout = () => {
        localStorage.setItem('token', "");
        localStorage.setItem('refreshToken', "");
        navigation('/home');
        navigation(0);
    }

    const unauthorizedComponent =
        <>
            <Button variant="outlined" size="small" className="btn btn-outline-primary me-2"
                    href="/login">Login</Button>
            <Button variant="contained" size="small" className="btn btn-primary" href="/sign-up">Sign-up</Button>
        </>

    const authorizedComponent =
        <>
            <Typography variant="button">Welcome {user.name}</Typography>
            <Button variant="contained" size="small" className="btn btn-primary" onClick={logout}
                    sx={{marginLeft: '20px'}}>
                Logout
            </Button>
        </>

    const adminComponent =
        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li><Button variant="contained" size="small" className="btn btn-primary" onClick={logout}
                        sx={{marginLeft: '20px'}}>
                Logout
            </Button></li>
            <br/>
            <li><Typography variant="button" display="inline-block">Welcome {user.name}</Typography></li>
        </ul>

    return (
        <div className="container">
            <header
                className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li><Button href="/movie" className="nav-link px-2 link-dark">Movies</Button></li>
                    <li><Button href="/session" className="nav-link px-2 link-dark">Actual sessions</Button></li>
                </ul>

                <div className="col-md-3 text-end">
                    {user.roles && user.roles.some(element => JSON.stringify(element) === JSON.stringify({
                        roleId: 1,
                        roleName: "USER"
                    }))
                        ? user.roles && user.roles.some(element => JSON.stringify(element) === JSON.stringify({
                            roleId: 2,
                            roleName: "ADMIN"
                        }))
                            ? adminComponent
                            : authorizedComponent
                        : unauthorizedComponent}
                </div>
            </header>
        </div>
    );

}

export default MenuComponent;