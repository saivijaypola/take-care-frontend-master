import React, { useState } from "react";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DialogBox(props) {


    return (
        <Dialog
            open={props.isDialogOpen}
            onClose={() => props.handleClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>
            </DialogContent>
            {props.type==="yes-no"?
            <DialogActions>
                <Button onClick={() => props.handleClickDialog('cancel')} color="primary">
                    No
             </Button>
                <Button onClick={() => props.handleClickDialog('ok')} color="primary" autoFocus>
                    Yes
             </Button>
            </DialogActions>
            :
            <DialogActions>
            <Button onClick={() => props.handleClickDialog('cancel')} color="primary">
                Cancel
         </Button>
            <Button onClick={() => props.handleClickDialog('ok')} color="primary" autoFocus>
                OK
         </Button>
        </DialogActions>
            


}
        </Dialog>
    )
}