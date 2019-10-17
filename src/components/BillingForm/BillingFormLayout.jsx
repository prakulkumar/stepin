import React, { Component } from "react";

import BillingForm from "./BillingForm";
import BillingHeader from "./BillingFormHeader";
import Card from "../../common/Card/Card";
import LoaderDialog from "../../common/LoaderDialog/LoaderDialog";

import constants from "../../utils/constants";
import schemas from "../../utils/joiUtils";
import FormUtils from "../../utils/formUtils";
import utils from "../../utils/utils";
import bookingService from "../../services/bookingService";
import taxService from "../../services/taxService";

const { success, error } = constants.snackbarVariants;

const schema = schemas.billingFormSchema;

class BillingFormLayout extends Component {
  state = {
    selectedBooking: null,
    data: {
      cash: "",
      card: "",
      wallet: "",
      taxStatus: "withoutTax"
    },
    errors: {},
    taxSlabs: [],
    roomCharges: "",
    payment: {
      cash: { checked: false, disable: true },
      card: { checked: false, disable: true },
      wallet: { checked: false, disable: true }
    },
    loading: false
  };

  async componentDidMount() {
    const taxSlabs = await taxService.getTaxSlabs();
    const { selectedBooking, history } = this.props;
    if (selectedBooking === null) history.replace("/");
    else {
      const roomCharges = selectedBooking.roomCharges;
      this.setState({ selectedBooking, taxSlabs, roomCharges });
    }
  }

  implementTaxes = () => {
    const obj = this.getUpdatedRoomCharges(this.state.roomCharges);
    this.calculateRoomCharges(obj.roomCharges, obj.taxPercent, "withTax");
  };

  calculateRoomCharges = (roomCharges, taxPercent, taxType) => {
    const selectedBooking = { ...this.state.selectedBooking };
    const balance = roomCharges - parseInt(selectedBooking.advance);

    selectedBooking.roomCharges = roomCharges.toString();
    selectedBooking.balance = balance.toString();

    const data = { ...this.state.data };
    data.taxPercent = taxPercent;
    data.taxStatus = taxType;

    this.setState({ selectedBooking, data });
  };

  removeTaxes = () => {
    this.calculateRoomCharges(this.state.roomCharges, null, "withoutTax");
  };

  getUpdatedRoomCharges = roomCharges => {
    roomCharges = parseInt(roomCharges);
    const taxSlabs = this.state.taxSlabs;
    let taxPercent = 1;

    for (let taxSlab of taxSlabs) {
      if (taxSlab.lessThanAndEqual) {
        const { greaterThan, lessThanAndEqual } = taxSlab;
        if (roomCharges > greaterThan && roomCharges <= lessThanAndEqual) {
          taxPercent = taxSlab.taxPercent;
          break;
        }
      } else {
        taxPercent = taxSlab.taxPercent;
        break;
      }
    }

    return {
      roomCharges: roomCharges + (roomCharges * taxPercent) / 100,
      taxPercent
    };
  };

  handleInputChange = ({ currentTarget: input }) => {
    const { data, errors } = this.state;
    const updatedState = FormUtils.handleInputChange(
      input,
      data,
      errors,
      schema
    );

    this.setState({ data: updatedState.data, errors: updatedState.errors });
  };

  handleRadioGroupChange = event => {
    const value = event.currentTarget.value;
    if (value === "withTax") this.implementTaxes();
    else if (value === "withoutTax") this.removeTaxes();
  };

  handleCheckboxChange = (event, name) => {
    const checked = event.currentTarget.checked;
    let data = { ...this.state.data };
    let payment = { ...this.state.payment };
    const errors = { ...this.state.errors };

    switch (name) {
      case "cash":
        payment.cash = { disable: !checked, checked };
        errors.cash && !checked && delete errors.cash;
        if (!checked) data.cash = "";
        break;

      case "card":
        payment.card = { disable: !checked, checked };
        errors.card && !checked && delete errors.card;
        if (!checked) data.card = "";
        break;

      case "wallet":
        payment.wallet = { disable: !checked, checked };
        errors.wallet && !checked && delete errors.wallet;
        if (!checked) data.wallet = "";
        break;

      default:
        payment = { ...payment };
        break;
    }
    checked && delete errors.customError;
    this.setState({ payment, errors, data });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const data = { ...this.state.data };

    const errors = FormUtils.validate(data, schema);
    if (data.cash || data.card || data.wallet) delete errors.customError;
    else errors.customError = "Please select any payment mode";

    const payment = this.state.payment;
    if (errors.cash) {
      !payment.cash.checked && delete errors.cash;
    }
    if (errors.card) {
      !payment.card.checked && delete errors.card;
    }
    if (errors.wallet) {
      !payment.wallet.checked && delete errors.wallet;
    }
    this.setState({ errors });
    if (Object.keys(errors).length) return;

    this.setState({ loading: true });
    const { selectedBooking } = this.state;
    selectedBooking.checkedOutTime = utils.getTime();
    selectedBooking.status = { ...selectedBooking.status, checkedOut: true };
    selectedBooking.totalAmount = selectedBooking.roomCharges;
    selectedBooking.roomCharges = this.state.roomCharges;
    const paymentData = { ...selectedBooking, payment: data };
    this.updateBookingPayment(paymentData);
  };

  updateBookingPayment = async bookingData => {
    const { status } = await bookingService.updateBooking(bookingData);
    this.setState({ loading: false });
    if (status === 200) {
      this.openSnackBar("Checked out Successfully", success);
      this.props.onRedirectFromBilling(bookingData);
    } else this.openSnackBar("Error Occurred", error);
  };

  openSnackBar = (message, variant) => {
    const snakbarObj = { open: true, message, variant };
    this.props.onSnackbarEvent(snakbarObj);
  };

  render() {
    const { data, errors, selectedBooking, payment, loading } = this.state;
    const cardContent = (
      <BillingForm
        onInputChange={this.handleInputChange}
        onCheckboxChange={this.handleCheckboxChange}
        onRadioGroupChange={this.handleRadioGroupChange}
        onFormSubmit={this.handleFormSubmit}
        data={data}
        errors={errors}
        booking={selectedBooking}
        payment={payment}
      />
    );

    return (
      <React.Fragment>
        {loading && <LoaderDialog open={loading} />}
        <Card
          header={<BillingHeader />}
          content={cardContent}
          maxWidth={700}
          margin="80px auto"
        />
      </React.Fragment>
    );
  }
}

export default BillingFormLayout;
