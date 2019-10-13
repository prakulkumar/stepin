import React from "react";
import { IconButton, AppBar, Toolbar, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import HotelIcon from "@material-ui/icons/Hotel";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import moment from "moment";

import useStyles from "./BookingFormStyle";

const BookingFormHeader = props => {
  const classes = useStyles();
  const {
    onEdit,
    onCancel,
    onCheckIn,
    onCheckOut,
    status,
    checkIn,
    checkOut
  } = props;

  return (
    <div className={classes.formHeader}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.formTitle}>
            Booking
          </Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
          {!status.checkedIn && (
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={onCancel}
            >
              <DeleteForeverIcon />
            </IconButton>
          )}
          {moment().toDate() >= moment(checkIn).toDate() && (
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={onCheckIn}
            >
              <HotelIcon />
            </IconButton>
          )}
          {moment().toDate() >= moment(checkOut).toDate() && status.checkedIn && (
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={onCheckOut}
            >
              <MeetingRoomIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default BookingFormHeader;
