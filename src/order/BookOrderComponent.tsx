import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import orderAPI from "../API/OrderAPI";

const BookOrderComponent = (orderId: any, setErrorMessage: any, setOpenError: any, setAccessMessage: any,
                            setOpenAccess: any) => {
    const [openBook, setOpenBook] = React.useState(false);
    const navigation = useNavigate();

    const bookOrder = () => {
        orderAPI.bookOrder(successBooking, failureBooking, orderId);
    }

    const successBooking = () => {
        setOpenBook(false);
        navigation("/home");
        navigation(0);
    }

    const failureBooking = (error: any) => {
        setOpenBook(false);
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
                    onClick={() => setOpenBook(true)}>
                Book order
            </Button>
            <Dialog open={openBook} onClose={() => setOpenBook(false)} fullWidth>
                <DialogTitle className="dialog-title">Cancel Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Remember, if you do not pay for your seats before specific time (30 minutes before film starts),
                        you will lose your reservation! Would you like to book your order?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBook(false)}>No</Button>
                    <Button onClick={bookOrder}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default BookOrderComponent;