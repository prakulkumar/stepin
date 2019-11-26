import React, { useState, useEffect, useContext } from "react";
import SnackBarContext from "./../../context/snackBarContext";
import { DialogActions, DialogContent, Button } from "@material-ui/core";

import bookingService from "../../services/bookingService";
import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import schemas from "../../utils/joiUtils";

import constants from "../../utils/constants";
import "./POS.scss";

const { success, error } = constants.snackbarVariants;
const schema = schemas.POSFormSchema;

const POSForm = ({ allBookings, onClose }) => {
  const [data, setData] = useState({
    roomNumber: "",
    posOption: "",
    date: utils.getDate(),
    amount: "",
    remarks: ""
  });
  const [errors, setErrors] = useState({});
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [posData, setPosData] = useState([]);
  const [maxDate, setMaxDate] = useState(utils.getDate());
  const [roomOptions, setRoomOptions] = useState([]);
  const [disable] = useState(false);
  const minDate = utils.getDate();

  const handleSnackbarEvent = useContext(SnackBarContext);

  const posOptions = [
    { label: "Food", value: "Food" },
    { label: "Transport", value: "Transport" },
    { label: "Laundary", value: "Laundary" },
    { label: "Others", value: "Others" },
    { label: "Agent", value: "Agent" }
  ];

  useEffect(() => {
    let POSData = [];
    const filteredBookings = allBookings.filter(
      booking => booking.status.checkedIn && !booking.status.checkedOut
    );
    filteredBookings.forEach(booking => {
      booking.rooms.forEach(room => {
        POSData.push({ room, booking });
      });
    });
    setPosData(POSData);
  }, [allBookings]);

  useEffect(() => {
    const options = posData.map(data => ({
      label: data.room.roomNumber,
      value: data.room.roomNumber
    }));
    setRoomOptions(options);
  }, [posData]);

  const getInputArgObj = (id, label, type, shouldDisable) => {
    return {
      id,
      label,
      name: id,
      type,
      value: data[id],
      onChange: event => handleInputChange(event, id),
      error: errors[id],
      disabled: shouldDisable
    };
  };

  const getDateArgObj = (id, label, type, minDate, shouldDisable, maxDate) => {
    return {
      id,
      label,
      name: id,
      type,
      value: data[id],
      onChange: handleDatePickerChange,
      error: errors[id],
      minDate,
      disabled: shouldDisable,
      open: openDatePicker,
      maxDate
    };
  };

  const handleInputChange = (event, id) => {
    const updatedState = FormUtils.handleInputChange(
      event.currentTarget,
      data,
      errors,
      schema
    );
    setData(updatedState.data);
    setErrors(updatedState.errors);
  };

  const handleDatePickerChange = event => {
    const posDate = utils.getDate(event);
    setTimeout(() => {
      setData({ ...data, date: posDate });
      setOpenDatePicker(false);
    }, 10);
  };

  const handleDatePicker = () => {
    setOpenDatePicker(true);
  };

  const setPosOptions = ({ target: input }) => {
    let updatedErrors = { ...errors };
    delete updatedErrors[input.name];
    const posOption = input.value;

    setData({ ...data, posOption });
    setErrors(updatedErrors);
  };

  const setBooking = ({ target: input }) => {
    let updatedErrors = { ...errors };
    delete updatedErrors[input.name];

    const roomNo = input.value;
    const filteredObj = posData.find(data => data.room.roomNumber === roomNo);
    const maxDate = utils.getDate(filteredObj.booking.checkOut);
    setMaxDate(maxDate);
    setData({ ...data, roomNumber: roomNo });
    setErrors(updatedErrors);
  };

  const checkForErrors = () => {
    let errors = FormUtils.validate(data, schema);
    errors = errors || {};

    setErrors(errors);
    return Object.keys(errors).length;
  };

  const onFormSubmit = async event => {
    event.preventDefault();
    const errors = checkForErrors();

    if (errors) return;

    const { roomNumber, posOption, date, amount, remarks } = data;
    const filterObj = posData.find(obj => obj.room.roomNumber === roomNumber);
    const booking = { ...filterObj.booking };

    if (booking.pos) {
      let pos = { ...booking.pos };
      pos[posOption] = pos[posOption]
        ? [...pos[posOption], { date, amount, remarks }]
        : [{ date, amount, remarks }];
      booking.pos = pos;
    } else {
      booking.pos = {};
      booking.pos[posOption] = [{ date, amount, remarks }];
    }

    const response = await bookingService.updateBooking(booking);
    if (response.status === 200) openSnackBar("Updated Successfully", success);
    else openSnackBar("Error Occurred", error);
    onClose();
  };

  const openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant, resetBookings: true };
    handleSnackbarEvent(snakbarObj);
  };

  return (
    <form onSubmit={event => onFormSubmit(event)}>
      <DialogContent>
        <div className="form-group">
          {FormUtils.renderSelect({
            id: "roomNumber",
            label: "Room Number",
            name: "roomNumber",
            value: data.roomNumber,
            onChange: event => setBooking(event),
            options: roomOptions,
            error: errors.roomNumber,
            disabled: disable
          })}
          {FormUtils.renderSelect({
            id: "posOption",
            label: "POS Options",
            name: "posOption",
            value: data.posOption,
            onChange: event => setPosOptions(event),
            options: posOptions,
            error: errors.posOption,
            disabled: disable
          })}
        </div>
        <div className="form-group">
          <div style={{ width: "100%" }} onClick={handleDatePicker}>
            {FormUtils.renderDatepicker(
              getDateArgObj("date", "Date", "text", minDate, disable, maxDate)
            )}
          </div>
          {FormUtils.renderInput(
            getInputArgObj("amount", "Amount", "text", disable)
          )}
        </div>
        <div className="form-group">
          {FormUtils.renderInput(
            getInputArgObj("remarks", "Remarks", "text", disable)
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={onFormSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </form>
  );
};

export default POSForm;
