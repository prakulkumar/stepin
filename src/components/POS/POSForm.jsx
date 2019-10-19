import React, { Component } from "react";
import { DialogActions, DialogContent, Button } from "@material-ui/core";

import bookingService from "../../services/bookingService";
import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import schemas from "../../utils/joiUtils";

import constants from "../../utils/constants";
import "./POS.scss";

const { success, error } = constants.snackbarVariants;
const schema = schemas.POSFormSchema;

class POSForm extends Component {
  state = {
    data: {
      roomNumber: "",
      bookingId: "",
      date: utils.getDate(),
      amount: "",
      remarks: ""
    },
    openDatePicker: false,
    minDate: utils.getDate(),
    posData: [],
    bookingOptions: [],
    errors: {},
    shouldDisable: false
  };

  componentDidMount() {
    this.filterCheckedInBookings();
  }

  filterCheckedInBookings = () => {
    let posData = [];
    const filteredBookings = this.props.allBookings.filter(
      booking => booking.status.checkedIn && !booking.status.checkedOut
    );
    filteredBookings.forEach(booking => {
      booking.rooms.forEach(room => {
        posData.push({ room, booking });
      });
    });
    this.setState({ posData });
  };

  getInputArgObj = (id, label, type, shouldDisable) => {
    return {
      id,
      label,
      name: id,
      type,
      value: this.state.data[id],
      onChange: event => this.handleInputChange(event, id),
      error: this.state.errors[id],
      disabled: shouldDisable
    };
  };

  getDateArgObj = (id, label, type, minDate, shouldDisable) => {
    return {
      id,
      label,
      name: id,
      type,
      value: this.state.data[id],
      onChange: this.handleDatePickerChange,
      error: this.state.errors[id],
      minDate,
      disabled: shouldDisable,
      open: this.state.openDatePicker
    };
  };

  getRoomOptions = () => {
    return this.state.posData.map(data => ({
      label: data.room.roomNumber,
      value: data.room.roomNumber
    }));
  };

  handleInputChange = (event, id) => {
    const { data, errors } = { ...this.state };
    const updatedState = FormUtils.handleInputChange(
      event.currentTarget,
      data,
      errors,
      schema
    );
    this.setState({ data: updatedState.data, errors: updatedState.errors });
  };

  handleDatePickerChange = event => {
    const data = { ...this.state.data };
    data.date = utils.getDate(event);
    setTimeout(() => {
      this.setState({ data, openDatePicker: false });
    }, 10);
  };

  handleDatePicker = () => {
    this.setState({ openDatePicker: true });
  };

  setBookingOptions = ({ target: input }) => {
    let errors = { ...this.state.errors };
    delete errors[input.name];

    const roomNo = input.value;
    const filteredArray = this.state.posData.filter(
      data => data.room.roomNumber === roomNo
    );
    const bookingOptions = filteredArray.map(item => ({
      label: `${item.booking.firstName} ${item.booking.lastName}`,
      value: item.booking.bookingId
    }));
    const data = { ...this.state.data };
    data.roomNumber = roomNo;

    this.setState({ bookingOptions, data, errors });
  };

  setBookingId = ({ target: input }) => {
    const data = { ...this.state.data };
    let errors = { ...this.state.errors };
    delete errors[input.name];

    data.bookingId = input.value;
    const filteredObj = this.state.posData.find(
      item => item.booking.bookingId === data.bookingId
    );

    const minDate = utils.getDate(filteredObj.booking.checkIn);
    data.date = minDate;
    this.setState({ data, minDate, errors });
  };

  checkForErrors = () => {
    let errors = FormUtils.validate(this.state.data, schema);
    errors = errors || {};
    this.setState({ errors });

    return Object.keys(errors).length;
  };

  onFormSubmit = async event => {
    event.preventDefault();
    const errors = this.checkForErrors();
    if (errors) return;

    const { allBookings, title, onClose } = this.props;
    const { bookingId, date, amount, remarks } = this.state.data;
    const booking = {
      ...allBookings.find(booking => booking.bookingId === bookingId)
    };

    if (booking.pos) {
      let pos = { ...booking.pos };
      pos[title] = pos[title]
        ? [...pos[title], { date, amount, remarks }]
        : [{ date, amount, remarks }];
      booking.pos = pos;
    } else {
      booking.pos = {};
      booking.pos[title] = [{ date, amount, remarks }];
    }

    const response = await bookingService.updateBooking(booking);
    if (response.status === 200)
      this.openSnackBar("Updated Successfully", success);
    else this.openSnackBar("Error Occurred", error);
    onClose();
  };

  openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: true };
    this.props.onSnackbarEvent(snakbarObj);
  };

  render() {
    const roomOptions = this.getRoomOptions();
    const { shouldDisable, errors } = this.state;
    return (
      <form onSubmit={event => this.onFormSubmit(event)}>
        <DialogContent>
          <div className="form-group">
            {FormUtils.renderSelect({
              id: "roomNumber",
              label: "Room Number",
              name: "roomNumber",
              value: this.state.data.roomNumber,
              onChange: event => this.setBookingOptions(event),
              options: roomOptions,
              error: errors.roomNumber,
              disabled: shouldDisable
            })}
            {FormUtils.renderSelect({
              id: "bookingId",
              label: "Booking Id",
              name: "bookingId",
              value: this.state.data.bookingId,
              onChange: event => this.setBookingId(event),
              options: this.state.bookingOptions,
              error: errors.bookingId,
              disabled: shouldDisable
            })}
          </div>
          <div className="form-group" onClick={this.handleDatePicker}>
            {FormUtils.renderDatepicker(
              this.getDateArgObj(
                "date",
                "Date",
                "text",
                this.state.minDate,
                shouldDisable
              )
            )}
            {FormUtils.renderInput(
              this.getInputArgObj("amount", "Amount", "text", shouldDisable)
            )}
          </div>
          <div className="form-group">
            {FormUtils.renderInput(
              this.getInputArgObj("remarks", "Remarks", "text", shouldDisable)
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="secondary">
            Close
          </Button>
          <Button onClick={this.onFormSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    );
  }
}

export default POSForm;
