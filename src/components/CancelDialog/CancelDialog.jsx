import React from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  // Typography,
  Button
  // makeStyles
} from "@material-ui/core";

const CancelDialog = ({ onClose, onCancel }) => {
  return (
    <React.Fragment>
      <DialogTitle>Cancel</DialogTitle>
      <DialogContent>
        Are you sure, you want to cancel this booking ?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={onCancel} color="secondary">
          Yes
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default CancelDialog;
