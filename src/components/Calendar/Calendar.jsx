import React, { useEffect, useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
// import Dialog from "./../../common/Dialog/Dialog";
import utils from "./../../utils/utils";
import moment from "moment";

import "./Calendar.scss";

const Calendar = props => {
  const {
    allBookings,
    allRooms,
    loading,
    currentDateObj: dateObj,
    currentDate
  } = props;

  const [title, setTitle] = useState("");
  const [rows, setRows] = useState([]);
  let tempRows = [];

  useEffect(() => {
    const title = getTitle(currentDate);
    setTitle(title);
    props.onLoading(true);
    props.setBookings(dateObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("booking", allBookings);
    if (allBookings.length > 0) showBookings(dateObj, allBookings, allRooms);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBookings]);

  useEffect(() => {
    if (allRooms.length > 0) {
      const rows = getTableRows(allRooms, dateObj);
      setRows(rows);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRooms, dateObj]);

  useEffect(() => {
    const title = getTitle(currentDate);
    setTitle(title);
  }, [currentDate]);

  const showBookings = (dateObj, bookings, allRooms) => {
    tempRows = getTableRows(allRooms, dateObj);

    bookings &&
      bookings.forEach(booking => {
        let { checkIn, checkOut, months } = booking;
        const color = utils.generateRandomColor();
        if (months.length > 1) {
          const updatedValue = getUpdatedValues(booking, dateObj);
          checkIn = updatedValue.checkIn;
          checkOut = updatedValue.checkOut;
        }

        booking.rooms.forEach(bookedRoom => {
          const { roomNumber } = allRooms.find(room => {
            return room._id === bookedRoom._id;
          });

          setBookingObjByRoom(roomNumber, checkIn, checkOut, booking, color);
        });
      });

    setRows(tempRows);
  };

  const setBookingObjByRoom = (
    roomNumber,
    checkIn,
    checkOut,
    booking,
    color
  ) => {
    const rowIndex = tempRows.findIndex(
      row => row[0].room.roomNumber === roomNumber
    );
    const dates = utils.daysBetweenDates(checkIn, checkOut);
    updateRowObjByDate(dates, rowIndex, booking, color);
  };

  const updateRowObjByDate = (dates, rowIndex, booking, color) => {
    const rowsArray = [...tempRows];

    dates.forEach(date => {
      const dateNumber = moment(date).date();
      rowsArray[rowIndex] = [...rowsArray[rowIndex]];
      rowsArray[rowIndex][dateNumber] = {
        ...rowsArray[rowIndex][dateNumber],
        booking,
        color
      };
    });

    tempRows = [...rowsArray];
  };

  const getTitle = date =>
    `${moment(date)
      .format("MMMM")
      .toUpperCase()} ${moment(date).year()}`;

  const getTableRows = (allRooms, dateObj) => {
    let rows = new Array(allRooms.length).fill();
    rows.forEach((row, index) => {
      rows[index] = new Array(dateObj.days + 1).fill({
        room: { ...allRooms[index] },
        handleRedirect: handleRedirect
      });
      rows[index][0] = { room: { ...allRooms[index] }, show: true };
    });

    return rows;
  };

  const getTableHeaders = () => {
    let tableHeaders = new Array(dateObj.days + 1).fill({});
    tableHeaders = tableHeaders.map((value, index) => {
      if (index !== 0) return { date: index < 10 ? `0${index}` : `${index}` };
      else return { date: "" };
    });

    return tableHeaders;
  };

  const getUpdatedValues = (booking, dateObj) => {
    let { checkIn, checkOut, months } = booking;
    const { month, year, days } = dateObj;
    const index = months.findIndex(month => month.month === dateObj.month);

    if (index === 0) {
      checkIn = utils.getDate(checkIn);
      checkOut = new Date(`${month + 1}/${days}/${year}`);
    } else if (index === months.length - 1) {
      checkIn = new Date(`${month + 1}/1/${year}`);
      checkOut = utils.getDate(checkOut);
    } else {
      checkIn = new Date(`${month + 1}/1/${year}`);
      checkOut = new Date(`${month + 1}/${days}/${year}`);
    }

    return { checkIn, checkOut };
  };

  const handleRedirect = (bookingObj, roomObj, date) => {
    props.onFormRedirect(bookingObj, roomObj, date);
  };

  const handleChange = value => {
    const prevDate = new Date(dateObj.year, dateObj.month);
    const newDate = moment(prevDate).add(value, "M");
    const newDateObj = utils.getDateObj(newDate);

    props.setDateObj(newDateObj, newDate);
    props.onLoading(true);
    props.setBookings(newDateObj);
  };

  return (
    <div className="calendar__container">
      <CalendarHeader
        title={title}
        onChange={handleChange}
        month={dateObj.month}
      />
      <CalendarBody
        tableHeaders={getTableHeaders()}
        tableRows={rows}
        loading={loading}
        dateObj={dateObj}
      />
      {/* {showModal && (
        <Dialog
          openModal={this.state.showModal}
          onCloseModal={this.handleCloseModal}
          size="lg"
        />
      )} */}
    </div>
  );
};

export default Calendar;
