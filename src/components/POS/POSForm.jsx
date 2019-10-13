import React, { Component } from "react";

import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import bookingService from "../../services/bookingService";
import { DialogActions, DialogContent, Button } from "@material-ui/core";

import "./POS.scss";

class POSForm extends Component {
  state = {
    data: {
      roomNumber: "",
      bookingId: "",
      date: "",
      amount: "",
      remarks: ""
    },
    posData: [],
    bookingOptions: [],
    errors: {},
    shouldDisable: false
  };

  handleInputChange = (event, id) => {
    const data = { ...this.state.data };
    data[id] = event.currentTarget.value;
    this.setState({ data });
  };

  getInputArgObj = (id, label, type, shouldDisable) => {
    return {
      id,
      label,
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
      type,
      value: this.state.data[id],
      onChange: () => console.log("on date change"),
      error: this.state.errors[id],
      minDate,
      disabled: shouldDisable
    };
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

  getRoomOptions = () => {
    return this.state.posData.map(data => ({
      label: data.room.roomNumber,
      value: data.room.roomNumber
    }));
  };

  setBookingOptions = event => {
    const roomNo = event.target.value;
    const filteredArray = this.state.posData.filter(
      data => data.room.roomNumber === roomNo
    );
    const bookingOptions = filteredArray.map(item => ({
      label: `${item.booking.firstName} ${item.booking.lastName}`,
      value: item.booking.bookingId
    }));
    const data = { ...this.state.data };
    data.roomNumber = roomNo;

    this.setState({ bookingOptions, data });
  };

  setBookingId = event => {
    const data = { ...this.state.data };
    data.bookingId = event.target.value;
    const filteredObj = this.state.posData.find(
      item => item.booking.bookingId == data.bookingId
    );

    data.date = utils.getDate(filteredObj.booking.checkIn);
    this.setState({ data });
  };

  onFormSubmit = async () => {
    const { allBookings, title, onClose } = this.props;
    const { bookingId, date, amount, remarks } = this.state.data;
    const booking = {
      ...allBookings.find(booking => booking.bookingId === bookingId)
    };
    booking.pos = {};
    booking.pos[title] = { date, amount, remarks };
    const response = await bookingService.updateBooking(booking);
    if (response.status === 200) onClose();
  };

  render() {
    const roomOptions = this.getRoomOptions();
    const { shouldDisable } = this.state.shouldDisable;
    return (
      <form onSubmit={event => this.onFormSubmit(event)}>
        <DialogContent>
          <div className="form-group">
            {FormUtils.renderSelect({
              id: "roomNumber",
              label: "Room Number",
              value: this.state.data.roomNumber,
              onChange: event => this.setBookingOptions(event),
              options: roomOptions,
              disabled: shouldDisable
            })}
            {FormUtils.renderSelect({
              id: "booking",
              label: "Booking",
              value: this.state.data.bookingId,
              onChange: event => this.setBookingId(event),
              options: this.state.bookingOptions,
              disabled: shouldDisable
            })}
          </div>
          <div className="form-group">
            {FormUtils.renderDatepicker(
              this.getDateArgObj(
                "date",
                "Date",
                "text",
                this.state.data.date,
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
