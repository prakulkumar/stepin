import React, { Component } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
import utils from "./../../utils/utils";
import moment from "moment";
import bookingService from "../../services/bookingService";
import "./Calendar.scss";
import Dialog from "./../../common/Dialog/Dialog";

class Calendar extends Component {
  state = {
    title: "",
    dateObj: {},
    bookings: [],
    rows: [],
    showModal: false,
    loading: false,
    callCount: 0
  };

  constructor(props) {
    super(props);

    const date = props.currentDate;
    const dateObj = utils.getDateObj(date);
    const title = this.getTitle(date);

    this.state.title = title;
    this.state.dateObj = dateObj;
    this.state.loading = true;
  }

  componentDidMount() {
    if (this.props.allRooms.length > 0) {
      const rows = this.getTableRows(this.props.allRooms, this.state.dateObj);
      this.setState({ rows, callCount: 1 });

      this.showBookingProcess(this.state.dateObj);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.allRooms.length > 0 && nextState.callCount === 0) {
      const rows = this.getTableRows(nextProps.allRooms, nextState.dateObj);
      this.setState({ rows, callCount: 1 });

      this.showBookingProcess(nextState.dateObj);
    }

    // if (nextProps.isRefresh && nextState.callCount === 0) {
    //   this.setState({ callCount: 1 });

    //   // this.showBookingProcess(this.state.dateObj);
    //   // nextProps.onRefresh();
    //   // window.location.reload();
    //   this.setState({ callCount: 0 });
    // }
    return true;
  }

  showBookingProcess = async dateObj => {
    const bookingsFromDb = await this.getBookings(dateObj);

    const bookings = [...bookingsFromDb];

    if (bookings) {
      this.setState({ bookings });
      this.showBookings(dateObj, bookings);
    }
  };

  showBookings = (dateObj, bookings) => {
    const allRooms = this.props.allRooms;

    bookings &&
      bookings.forEach(booking => {
        let { checkIn, checkOut, months } = booking;
        const color = utils.generateRandomColor();
        if (months.length > 1) {
          const updatedValue = this.getUpdatedValues(booking, dateObj);
          checkIn = updatedValue.checkIn;
          checkOut = updatedValue.checkOut;
        }

        booking.rooms.forEach(bookedRoom => {
          const { roomNumber } = allRooms.find(room => {
            return room._id === bookedRoom._id;
          });

          this.setBookingObjByRoom(
            roomNumber,
            checkIn,
            checkOut,
            booking,
            color
          );
        });
      });
  };

  setBookingObjByRoom = (roomNumber, checkIn, checkOut, booking, color) => {
    const rowIndex = this.state.rows.findIndex(
      row => row[0].room.roomNumber === roomNumber
    );
    const dates = utils.daysBetweenDates(checkIn, checkOut);
    this.updateRowObjByDate(dates, rowIndex, booking, color);
  };

  updateRowObjByDate = (dates, rowIndex, booking, color) => {
    const rowsArray = [...this.state.rows];

    dates.forEach(date => {
      const dateNumber = moment(date).date();
      rowsArray[rowIndex] = [...rowsArray[rowIndex]];
      rowsArray[rowIndex][dateNumber] = {
        ...rowsArray[rowIndex][dateNumber],
        booking,
        color
      };
    });

    this.setState({ rows: rowsArray });
  };

  getBookings = async dateObj => {
    if (!this.state.loading) this.setState({ loading: true });
    const bookings = await bookingService.getBookings(dateObj);
    this.props.setAllBookings(bookings);
    this.setState({ loading: false });
    return bookings;
  };

  getTableHeaders = () => {
    let tableHeaders = new Array(this.state.dateObj.days + 1).fill({});
    tableHeaders = tableHeaders.map((value, index) => {
      if (index !== 0) return { date: index < 10 ? `0${index}` : `${index}` };
      else return { date: "" };
    });

    return tableHeaders;
  };

  getTableRows = (allRooms, dateObj) => {
    let rows = new Array(allRooms.length).fill();
    rows.forEach((row, index) => {
      rows[index] = new Array(dateObj.days + 1).fill({
        room: { ...allRooms[index] },
        handleRedirect: this.handleRedirect
      });
      rows[index][0] = { room: { ...allRooms[index] }, show: true };
    });

    return rows;
  };

  getTitle = date =>
    `${moment(date)
      .format("MMMM")
      .toUpperCase()} ${moment(date).year()}`;

  getUpdatedValues = (booking, dateObj) => {
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

  handleChange = value => {
    const { dateObj: prevDateObj } = this.state;
    const prevDate = new Date(prevDateObj.year, prevDateObj.month);
    const newDate = moment(prevDate).add(value, "M");
    const dateObj = utils.getDateObj(newDate);
    const title = this.getTitle(newDate);
    const rows = this.getTableRows(this.props.allRooms, dateObj);

    this.setState({ title, dateObj, rows, loading: true });
    this.showBookingProcess(dateObj);
  };

  handleRedirect = (bookingObj, roomObj, date) => {
    this.props.onFormRedirect(bookingObj, roomObj, date);
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { title, dateObj, rows, showModal, loading } = this.state;

    return (
      <div className="calendar__container">
        <CalendarHeader
          title={title}
          onChange={this.handleChange}
          month={dateObj.month}
        />
        <CalendarBody
          tableHeaders={this.getTableHeaders()}
          tableRows={rows}
          loading={loading}
          dateObj={dateObj}
        />
        {showModal && (
          <Dialog
            openModal={this.state.showModal}
            onCloseModal={this.handleCloseModal}
            size="lg"
          />
        )}
      </div>
    );
  }
}

export default Calendar;
