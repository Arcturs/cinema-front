import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuComponent from "./main/MenuComponent";
import ErrorComponent from "./main/ErrorComponent";
import LoginComponent from "./user/LoginComponent";
import SignUpComponent from "./user/SignUpComponent";
import MoviesComponent from "./movie/MoviesComponent";
import MovieComponent from "./movie/MovieComponent";
import ScreensComponent from "./screen/ScreensComponent";
import ScreenComponent from "./screen/ScreenComponent";
import SessionsComponent from "./session/SessionsComponent";
import SessionComponent from "./session/SessionComponent";
import OrderComponent from "./order/OrderComponent";
import ConfirmBookingComponent from "./order/ConfirmBookingComponent";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const pathname = window.location.pathname;

root.render(
    <BrowserRouter>
        {pathname.includes('/login') || pathname.includes('/sign-up') || pathname.includes('/error')
            || pathname.includes('/order')
            ? null : <MenuComponent/>}
        <Routes>
            <Route path="/" element={<MoviesComponent/>}/>
            <Route path="home" element={<MoviesComponent/>}/>
            <Route path="error" element={<ErrorComponent/>}/>

            <Route path="login" element={<LoginComponent/>}/>
            <Route path="sign-up" element={<SignUpComponent/>}/>

            <Route path="movie" element={<MoviesComponent/>}/>
            <Route path="movie/:movieId/" element={<MovieComponent/>}/>

            <Route path="screen" element={<ScreensComponent/>}/>
            <Route path="screen/:screenId/" element={<ScreenComponent/>}/>

            <Route path="session" element={<SessionsComponent/>}/>
            <Route path="session/:sessionId/" element={<SessionComponent/>}/>

            <Route path="/order/:orderId" element={<OrderComponent/>}/>
            <Route path="/order/confirm-booking" element={<ConfirmBookingComponent/>}/>

            <Route element={<ErrorComponent/>}/>
        </Routes>
    </BrowserRouter>
);
