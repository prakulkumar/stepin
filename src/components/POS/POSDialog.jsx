import React from "react";

import POSForm from "./POSForm";

import { DialogTitle } from "@material-ui/core";

const POSDialog = ({ allBookings, onClose }) => {
  return (
    <React.Fragment>
      <DialogTitle>POS-Detail</DialogTitle>
      <POSForm allBookings={allBookings} onClose={onClose} />
    </React.Fragment>
  );
};

export default POSDialog;
