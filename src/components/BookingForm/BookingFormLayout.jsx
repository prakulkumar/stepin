import React, { useState, useEffect } from "react";

import Card from "../../common/Card/Card";
import BookingForm from "../BookingForm/BookingForm";
import BookingFormHeader from "./BookingFormHeader";
import LoaderDialog from "../../common/LoaderDialog/LoaderDialog";

import utils from "../../utils/utils";
import FormUtils from "../../utils/formUtils";
import constants from "../../utils/constants";
import schemas from "../../utils/joiUtils";
import roomService from "../../services/roomService";
import bookingService from "../../services/bookingService";
import "./BookingFormLayout.scss";

const schema = schemas.bookingFormSchema;
const { success, error } = constants.snackbarVariants;
const roomTypes = [
  { label: "AC", value: "AC" },
  { label: "Non AC", value: "Non AC" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Suite", value: "Suite" },
  { label: "Dormitory", value: "Dormitory" }
];

const BookingFormLayout = ({
  location,
  history,
  selectedRoom,
  selectedBooking,
  selectedDate,
  onSnackbarEvent,
  onCheckOutRedirect,
  showCancelDialog
}) => {
  const [data, setData] = useState({
    hotelName: "Hotel Black Rose",
    hotelAddress: "#234 street, Bangalore",
    firstName: "",
    lastName: "",
    address: "",
    checkIn: utils.getDate(),
    checkOut: utils.getDate(),
    checkedInTime: "",
    checkedOutTime: "",
    adults: "",
    children: 0,
    contactNumber: "",
    rooms: [],
    roomCharges: "",
    advance: "",
    bookingDate: null,
    status: {
      cancel: false,
      checkedIn: false,
      checkedOut: false
    }
  });
  const [errors, setErrors] = useState({});
  const [openDatePicker, setOpenDatePicker] = useState({
    checkIn: false,
    checkOut: false
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewBooking, setIsNewBooking] = useState(true);

  useEffect(() => {
    const { pathname } = location;
    if (selectedRoom !== null) {
      if (pathname === "/booking/viewBooking") {
        setViewBookingData();
        setIsNewBooking(false);
      } else if (pathname === "/booking/newBooking") {
        setNewBookingData();
        setIsNewBooking(true);
      }
    } else history.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setViewBookingData = () => {
    const booking = { ...selectedBooking };
    setData(booking);
    setShouldDisable(!isEdit);
    setAvailableRooms(booking.rooms);
    setStartDate(booking.checkIn);
    setEndDate(booking.checkOut);
  };

  const setNewBookingData = async () => {
    const newData = { ...data };
    const { roomNumber, roomType, _id } = selectedRoom;
    const room = { roomNumber, roomType, _id };
    newData.rooms.push(room);
    newData.checkIn = selectedDate;
    newData.checkOut = selectedDate;

    const availableRooms = await getAvailableRooms(
      newData.checkIn,
      newData.checkOut
    );
    setData(newData);
    setAvailableRooms(availableRooms);
  };

  const getAvailableRooms = async (checkIn, checkOut, bookingId) => {
    return await roomService.getAvailableRooms(checkIn, checkOut, bookingId);
  };

  const getUpdatedRooms = (availableRooms, rooms) => {
    const roomsIndex = getIndexesToRemoveRoomsFromState(availableRooms, rooms);
    roomsIndex.forEach(index => {
      rooms[index] = availableRooms.find(
        r => r.roomType === rooms[index].roomType
      );
    });

    return rooms;
  };

  const getIndexesToRemoveRoomsFromState = (availableRooms, rooms) => {
    const roomsIndex = [];
    const r = rooms.filter(room => {
      let a = availableRooms.findIndex(
        availableRoom => availableRoom.roomNumber === room.roomNumber
      );
      return a === -1 ? room : null;
    });

    r.forEach(currentRoom => {
      const index = rooms.findIndex(
        room => room.roomNumber === currentRoom.roomNumber
      );
      roomsIndex.push(index);
    });

    return roomsIndex;
  };

  const createBooking = async bookingData => {
    const { status } = await bookingService.addBooking(bookingData);
    setLoading(false);
    if (status === 200) openSnackBar("Booking Successfull", success, "/");
    else openSnackBar("Error Occurred", error);
  };

  const updateBooking = async (
    bookingData,
    message = "Booking Updated Successfully"
  ) => {
    const { status } = await bookingService.updateBooking(bookingData);
    setLoading(false);
    if (status === 200) openSnackBar(message, success, "/");
    else openSnackBar("Error Occurred", error);
  };

  const checkForErrors = () => {
    let errors = FormUtils.validate(data, schema);
    errors = errors || {};
    setErrors(errors);
    return Object.keys(errors).length;
  };

  const openSnackBar = (message, variant, redirectTo) => {
    const snakbarObj = { open: true, message, variant, resetBookings: false };
    onSnackbarEvent(snakbarObj);
    redirectTo && history.push(redirectTo);
  };

  const handleInputChange = ({ currentTarget: input }) => {
    const updatedState = FormUtils.handleInputChange(
      input,
      data,
      errors,
      schema
    );
    setData(updatedState.data);
    setErrors(updatedState.errors);
  };

  const handleDatePickerChange = async (event, id) => {
    const updatedData = { ...data };
    let updatedRooms = [...updatedData.rooms];
    updatedData[id] = utils.getDate(event);
    const newOpenDatePicker = { ...openDatePicker };
    newOpenDatePicker[id] = false;
    if (id === "checkIn") data["checkOut"] = data[id];

    let availableRooms = await getAvailableRooms(
      updatedData.checkIn,
      updatedData.checkOut,
      updatedData._id
    );

    if (
      utils.getFormattedDate(updatedData.checkIn) ===
        utils.getFormattedDate(startDate) &&
      utils.getFormattedDate(updatedData.checkOut) ===
        utils.getFormattedDate(endDate)
    ) {
      availableRooms = [...availableRooms, ...selectedBooking.rooms];
    }

    updatedData.rooms = getUpdatedRooms(availableRooms, updatedRooms);

    setOpenDatePicker(newOpenDatePicker);
    setData(updatedData);
    setAvailableRooms(availableRooms);
  };

  const handleDatePicker = id => {
    setOpenDatePicker({ ...openDatePicker, [id]: true });
  };

  const handleSelectChange = (event, index) => {
    let newErrors = { ...errors };
    if (newErrors.rooms)
      newErrors.rooms = newErrors.rooms.filter(error => error.index !== index);

    const { name, value } = event.target;
    const rooms = [...data.rooms];
    let room = {};

    if (name === "roomType")
      room = availableRooms.find(room => room.roomType === value);
    else if (name === "roomNumber")
      room = availableRooms.find(room => room.roomNumber === value);

    rooms[index] = {
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      _id: room._id
    };
    setData({ ...data, rooms });
    setErrors(newErrors);
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    const errors = checkForErrors();
    if (errors) return;

    setLoading(true);
    let bookingData = {
      ...data,
      balance: data.roomCharges - data.advance
    };
    if (!isEdit) {
      bookingData["bookingDate"] = utils.getDate();
      createBooking(bookingData);
    } else {
      updateBooking(bookingData);
    }
  };

  const handleAddRoom = () => {
    const rooms = [...data.rooms];
    rooms.push({
      roomNumber: "",
      roomType: "",
      _id: ""
    });
    setData({ ...data, rooms });
  };

  const handleDeleteRoom = index => {
    let newErrors = { ...errors };
    if (newErrors.rooms)
      newErrors.rooms = newErrors.rooms.filter(error => error.index !== index);
    else delete newErrors.rooms;

    let rooms = [...data.rooms];
    rooms = rooms.filter((room, i) => i !== index);
    setData({ ...data, rooms });
    setErrors(newErrors);
  };

  const handleBack = () => {
    history.push("/");
  };

  const handleEdit = () => {
    setIsEdit(true);
    setShouldDisable(false);
  };

  const handleCancel = () => {
    showCancelDialog();
    // const updatedData = { ...data };
    // updatedData.status = { ...updatedData.status, cancel: true };
    // setData(updatedData);
    // setLoading(true);
    // updateBooking(updatedData, "Booking Cancelled Successfully");
  };

  const handleCheckIn = () => {
    const updatedData = { ...data };
    updatedData.checkedInTime = utils.getTime();
    updatedData.status = { ...updatedData.status, checkedIn: true };
    setData(updatedData);
    setLoading(true);
    updateBooking(updatedData, "Checked In Successfully");
  };

  const handleCheckOut = () => {
    onCheckOutRedirect(data);
  };

  return (
    <React.Fragment>
      {loading && <LoaderDialog open={loading} />}
      <div className="cardContainer">
        <Card
          header={
            <BookingFormHeader
              status={data.status}
              checkIn={data.checkIn}
              checkOut={data.checkOut}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              isNewBooking={isNewBooking}
            />
          }
          content={
            <BookingForm
              onDatePickerChange={handleDatePickerChange}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onFormSubmit={handleFormSubmit}
              onAddRoom={handleAddRoom}
              onDeleteRoom={handleDeleteRoom}
              data={data}
              availableRooms={availableRooms}
              errors={errors}
              options={roomTypes}
              shouldDisable={shouldDisable}
              onBack={handleBack}
              openDatePicker={openDatePicker}
              handleDatePicker={handleDatePicker}
            />
          }
          maxWidth={700}
          margin="40px auto"
        />
      </div>
    </React.Fragment>
  );
};

export default BookingFormLayout;
