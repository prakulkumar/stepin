import React from "react";
import PropTypes from "prop-types";
import { Dialog } from "@material-ui/core";

const CustomDialog = ({ open, onClose, children, size }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={size}>
      {children}
    </Dialog>
  );
};

CustomDialog.prototype = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CustomDialog;
