import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import orderAPI from "../API/OrderAPI";

const PaymentComponent = (orderId: any, setErrorMessage: any, setOpenError: any, setAccessMessage: any,
                          setOpenAccess: any) => {
    const [openPayment, setOpenPayment] = React.useState(false);
    const [cardNumber, setCardNumber] = React.useState("");
    const [validationError, setValidationError] = React.useState({
        cardNumber: ""
    });
    const navigation = useNavigate();

    const payForOrder = () => {
        let data = {
            cardNumber: cardNumber
        }
        setValidationError({
            cardNumber: ""
        });
        orderAPI.payOrder(successPayment, failurePayment, orderId, data);
    }

    const successPayment = () => {
        setCardNumber("");
        setOpenPayment(false);
        navigation("/home");
        navigation(0);
    }

    const failurePayment = (error: any) => {
        if (error.response.data.message) {
            setOpenPayment(false);
            setOpenError(true);
            setErrorMessage(error.response.data.message);
            return;
        }
        if (error.response.status === 403) {
            setOpenPayment(false);
            setOpenAccess(true);
            setAccessMessage(error.response.data);
            localStorage.setItem('token', "");
            localStorage.setItem('refreshToken', "");
            return;
        }
        setValidationError(error.response.data);
    }

    const change = (event: any) => {
        setCardNumber(event.target.value);
    }

    return (
        <div>
            <Button aria-label="delete" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                    onClick={() => setOpenPayment(true)}>
                Pay for seat/seats
            </Button>
            <Dialog open={openPayment} onClose={() => setOpenPayment(false)} fullWidth>
                <DialogTitle className="dialog-title">Pay for order</DialogTitle>
                <DialogContent>
                    {validationError.cardNumber
                        ? <TextField error className="text-field d-flex justify-content-center" id="outlined-basic"
                                     label="Card number" variant="outlined" type="text" value={cardNumber}
                                     helperText={validationError.cardNumber} name="cardNumber" onChange={change}/>
                        : <TextField className="text-field d-flex justify-content-center" id="outlined-basic"
                                     label="Card number" variant="outlined" type="text" value={cardNumber}
                                     name="cardNumber" onChange={change}/>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
                    <Button onClick={payForOrder}>Pay</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PaymentComponent;