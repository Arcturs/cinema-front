import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuComponent from "./main/MenuComponent";
import ErrorComponent from "./main/ErrorComponent";
import LoginComponent from "./user/LoginComponent";
import SignUpComponent from "./user/SignUpComponent";

//TODO: fix home to movies page

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const pathname = window.location.pathname;

root.render(
    <BrowserRouter>
        {pathname.includes('/login') || pathname.includes('/sign-up') || pathname.includes('/error')
            ? null : <MenuComponent/>}
        <Routes>
            <Route path="error" element={<ErrorComponent/>}/>

            <Route path="login" element={<LoginComponent/>}/>
            <Route path="sign-up" element={<SignUpComponent/>}/>

            <Route element={<ErrorComponent/>}/>
        </Routes>
    </BrowserRouter>
);
