import React from "react";
import {Link, Typography} from "@mui/material";

const ErrorComponent = () => {
    return (
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                        <div className="card">
                            <div className="col-md-12">
                                <div className="main-verification-input-wrap">
                                    <ul>
                                        <Typography className="text-center text-muted mt-5 mb-0"
                                                    variant="h4">Page not found</Typography>
                                        <Typography className="text-center text-muted mt-5 mb-0">
                                            Go to <Link href="/home" className="fw-bold text-body">Home page</Link>
                                        </Typography>
                                        <Typography className="text-center text-muted mt-5 mb-0">
                                            Go to <Link href="/login" className="fw-bold text-body">Login
                                            page</Link>
                                        </Typography>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorComponent;