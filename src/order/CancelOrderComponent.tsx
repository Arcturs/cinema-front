import React from "react";
import {useNavigate} from "react-router-dom";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import orderAPI from "../API/OrderAPI";

const CancelOrderComponent = (orderId: any, setErrorMessage: any, setOpenError: any, setAccessMessage: any,
                              setOpenAccess: any) => {
    const [openCancel, setOpenCancel] = React.useState(false);
    const navigation = useNavigate();

    const cancelOrder = () => {
        orderAPI.cancelOrder(successCancel, failureCancel, orderId);
    }

    const successCancel = () => {
        setOpenCancel(false);
        navigation('/home');
        navigation(0);
    }

    const failureCancel = (error: any) => {
        setOpenCancel(false);
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

    return (
        <div>
            <Button aria-label="delete" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                    onClick={() => setOpenCancel(true)}>
                Cancel order
            </Button>
            <Dialog open={openCancel} onClose={() => setOpenCancel(false)} fullWidth>
                <DialogTitle className="dialog-title">Cancel Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This order will be canceled, are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCancel(false)}>No</Button>
                    <Button onClick={cancelOrder}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CancelOrderComponent;