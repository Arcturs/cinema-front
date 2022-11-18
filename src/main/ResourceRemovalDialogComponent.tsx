import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {useNavigate} from "react-router-dom";
const ResourceRemovalDialogComponent = (deleteComponent: any, id: any, component: string, link: string,
                                        setErrorMessage: any, setOpenError: any, setAccessMessage: any,
                                        setOpenAccess: any) => {

    const [openDelete, setOpenDelete] = React.useState(false);
    const navigation = useNavigate();

    const deleteComponentAction = () => {
        deleteComponent(successDelete, failureDelete, id);
    }

    const successDelete = () => {
        setOpenDelete(false);
        navigation(link);
        navigation(0);
    }

    const failureDelete = (error: any) => {
        setOpenDelete(false);
        if (error.response.status === 403) {
            //TODO: refresh token and if failure do this
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
        <div className="admin-component">
            <Fab variant="extended" size="medium" color="error" aria-label="delete"
                 onClick={() => setOpenDelete(true)} className="fab">
                <DeleteIcon sx={{mr: 1}}/>
                Delete {component}
            </Fab>
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullWidth>
                <DialogTitle className="dialog-title">Delete {component}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This {component} will be archived and will not be shown to users. To restore it, contact
                        administrators.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button onClick={deleteComponentAction}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ResourceRemovalDialogComponent;