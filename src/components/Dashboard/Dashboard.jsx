import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Calendar from "./../Calendar/Calendar";
import Navbar from "./../Navbar/Navbar";
import BookingFormLayout from "../BookingForm/BookingFormLayout";
import BillingFormLayout from "../BillingForm/BillingFormLayout";
import Report from "../Report/Report";
import Taxes from "../Taxes/Taxes";
import POSDialog from "../POS/POSDialog";
import Snackbar from "../../common/Snackbar/Snackbar";
import Dialog from "./../../common/Dialog/Dialog";

import roomService from "../../services/roomService";
import bookingService from "../../services/bookingService";
import utils from "../../utils/utils";
import constants from "../../utils/constants";
import "./Dashboard.scss";

class Dashboard extends Component {
  state = {
    currentDate: utils.getDate(),
    isRefresh: false,
    selectedBooking: null,
    allBookings: [],
    allRooms: [],
    selectedRoom: null,
    selectedDate: utils.getDate(),
    posDialogTitle: "",
    loading: false,
    snackbarObj: {
      open: false,
      message: "",
      variant: constants.snackbarVariants.success
    },
    dialog: {
      open: false,
      contentOf: "",
      size: "sm",
      openFor: {
        taxes: false,
        pos: false
      }
    }
  };

  async componentDidMount() {
    const allRooms = await roomService.getRooms();
    const dateObj = utils.getDateObj(this.state.currentDate);
    this.setBookings(dateObj);
    this.setState({ allRooms });
  }

  setBookings = async dateObj => {
    const allBookings = await bookingService.getBookings(dateObj);
    this.setState({ allBookings, loading: false });
  };

  handleDialog = (showFor, size) => {
    const dialog = { ...this.state.dialog };
    const openFor = { ...dialog.openFor };
    openFor[showFor] = !openFor[showFor];
    dialog.open = !dialog.open;
    dialog.contentOf = showFor;
    dialog.size = size || "sm";
    dialog.openFor = openFor;
    this.setState({ dialog });
  };

  handleShowTaxes = () => {
    this.handleDialog("taxes");
  };

  handleShowPOSDialog = title => {
    this.setState({ posDialogTitle: title });
    this.handleDialog("pos");
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleRedirectFromNavbar = () => {
    this.props.history.replace("/");
  };

  handleFormRedirect = (bookingObj, roomObj, selectedDate) => {
    const selectedBooking = bookingObj && { ...bookingObj };
    const selectedRoom = { ...roomObj };
    this.setState({ selectedBooking, selectedRoom, selectedDate });

    if (bookingObj) {
      if (bookingObj.status.checkedOut) this.props.history.push("/report");
      else this.props.history.push("/booking/viewBooking");
    } else this.props.history.push("/booking/newBooking");
  };

  handleCheckOutRedirect = bookingObj => {
    const selectedBooking = bookingObj && { ...bookingObj };
    this.setState({ selectedBooking });
    this.props.history.push("/billing");
  };

  handleRedirectFromBilling = bookingObj => {
    const selectedBooking = bookingObj && { ...bookingObj };
    this.setState({ selectedBooking });
    this.props.history.push("/report");
  };

  handleLoading = value => {
    this.setState({ loading: value });
  };

  handleSnackbarEvent = snackbarObj => {
    this.setState({ snackbarObj });
  };

  handleSnackBar = () => {
    const snackbarObj = { ...this.state.snackbarObj };
    snackbarObj.open = false;

    this.setState({ snackbarObj });
  };

  render() {
    const {
      currentDate,
      isRefresh,
      snackbarObj,
      selectedBooking,
      selectedRoom,
      selectedDate,
      allRooms,
      allBookings,
      dialog,
      posDialogTitle,
      loading
    } = this.state;

    return (
      <div className="mainContainer">
        <Snackbar
          open={snackbarObj.open}
          message={snackbarObj.message}
          onClose={this.handleSnackBar}
          variant={snackbarObj.variant}
        />
        <Navbar
          onRefresh={this.handleRefresh}
          showTaxes={this.handleShowTaxes}
          showPOSDialog={this.handleShowPOSDialog}
          path={this.props.location.pathname}
          onRedirectFromNavbar={this.handleRedirectFromNavbar}
        />
        <Dialog
          open={dialog.open}
          onClose={() => this.handleDialog(dialog.contentOf)}
          size={dialog.size}
        >
          {dialog.openFor.taxes && (
            <Taxes onClose={() => this.handleDialog(dialog.contentOf)} />
          )}
          {dialog.openFor.pos && (
            <POSDialog
              allBookings={allBookings}
              title={posDialogTitle}
              onClose={() => this.handleDialog(dialog.contentOf)}
              onSnackbarEvent={this.handleSnackbarEvent}
            />
          )}
        </Dialog>

        <div className="subContainer">
          <Switch>
            <Route
              path={["/booking/newBooking", "/booking/viewBooking"]}
              render={props => (
                <BookingFormLayout
                  onSnackbarEvent={this.handleSnackbarEvent}
                  selectedBooking={selectedBooking}
                  selectedRoom={selectedRoom}
                  selectedDate={selectedDate}
                  onCheckOutRedirect={this.handleCheckOutRedirect}
                  {...props}
                />
              )}
            />
            <Route
              path="/billing"
              render={props => (
                <BillingFormLayout
                  onSnackbarEvent={this.handleSnackbarEvent}
                  selectedBooking={selectedBooking}
                  onRedirectFromBilling={this.handleRedirectFromBilling}
                  {...props}
                />
              )}
            />
            <Route
              path="/report"
              render={props => (
                <Report selectedBooking={selectedBooking} {...props} />
              )}
            />
            <Route
              path="/"
              exact
              render={props => (
                <Calendar
                  // isRefresh={isRefresh}
                  // onRefresh={this.handleRefresh}
                  currentDate={currentDate}
                  onFormRedirect={this.handleFormRedirect}
                  allRooms={allRooms}
                  allBookings={allBookings}
                  loading={loading}
                  onLoading={this.handleLoading}
                  setBookings={this.setBookings}
                  {...props}
                />
              )}
            />
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Dashboard;
