import React, { Component } from "react";
import "./BookingDetails.css";
import { Form, Modal, Button } from "react-bootstrap";
class BookingDetails extends Component {
  state = {
    payment: {
      amount: 0,
      advance: 0,
      balance: 0,
      misc: 0,
      payment: {
        withTax: false,
        taxPercent: 0
      }
    },
    cardDisable: true,
    cashDisable: true,
    walletDisable: true
  };

  componentDidMount() {
    this.setState({
      payment: {
        ...this.state.payment,
        actualAmount: Number(this.props.booking.amount),
        amount: Number(this.props.booking.amount),
        advance: Number(this.props.booking.advance),
        balance:
          Number(this.props.booking.amount) +
          this.state.payment.misc -
          Number(this.props.booking.advance)
      }
    });
  }

  getPayment = () => {
    const payment = {
      cashPayment: !this.state.cashDisable
        ? Number(document.getElementById("cash_input").value)
        : 0,
      cardPayment: !this.state.cardDisable
        ? Number(document.getElementById("card_input").value)
        : 0,
      walletPayment: !this.state.walletDisable
        ? Number(document.getElementById("wallet_input").value)
        : 0,
      due: 0
    };

    this.checkPayment(payment);
  };

  checkPayment = payment => {
    const paymentTotal =
      payment.cashPayment + payment.cardPayment + payment.walletPayment;
    if (
      paymentTotal >= this.state.payment.balance &&
      paymentTotal <= this.state.payment.balance + 100
    ) {
      payment.due = paymentTotal - this.state.payment.balance;

      this.props.generateReport({
        ...this.state,
        payment: {
          ...this.state.payment,
          payment: { ...this.state.payment.payment, payment }
        }
      });
    } else {
      alert("Not allowed to proceed");
    }
  };

  restoreAmount = () => {
    this.setState({
      ...this.state,
      payment: {
        ...this.state.payment,
        amount: Number(this.props.booking.amount),
        advance: Number(this.props.booking.advance),
        balance:
          Number(this.props.booking.amount) +
          this.state.payment.misc -
          Number(this.props.booking.advance),
        payment: {
          ...this.state.payment.payment,
          withTax: false
        }
      }
    });
  };

  taxCalculation = () => {
    let taxPercent, amount;

    if (this.state.payment.amount > 0 && this.state.payment.amount <= 2000) {
      taxPercent = 3;
    } else if (
      this.state.payment.amount > 2000 &&
      this.state.payment.amount <= 5000
    ) {
      taxPercent = 10;
    } else if (this.state.payment.amount > 5000) {
      taxPercent = 18;
    }

    amount =
      this.state.payment.amount +
      (this.state.payment.amount * taxPercent) / 100;

    this.setState({
      ...this.state,
      payment: {
        ...this.state.payment,
        amount,
        balance: amount + this.state.payment.misc - this.state.payment.advance,
        payment: {
          ...this.state.payment.payment,
          taxPercent: taxPercent,
          withTax: true
        }
      }
    });
  };

  onChange = event => {
    if (event.target.id === "card") {
      this.setState({ cardDisable: !this.state.cardDisable });
      document.getElementById("card_input").value = null;
    } else if (event.target.id === "cash") {
      this.setState({ cashDisable: !this.state.cashDisable });
      document.getElementById("cash_input").value = null;
    } else if (event.target.id === "wallet") {
      this.setState({ walletDisable: !this.state.walletDisable });
      document.getElementById("wallet_input").value = null;
    } else if (event.target.id === "withTax") {
      this.taxCalculation();
    } else if (event.target.id === "withoutTax") {
      this.restoreAmount();
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="taxInfo">
          <div className="taxInfo__container">
            <div className="taxInfo__radio-group">
              <input
                type="radio"
                className="taxInfo__radio-input"
                id="withTax"
                name="taxInfo"
                onChange={event => this.onChange(event)}
              />
              <label for="withTax" className="taxInfo__radio-label">
                <span className="taxInfo__radio-button"></span>
                With Tax
              </label>
            </div>

            <div className="taxInfo__radio-group">
              <input
                type="radio"
                className="taxInfo__radio-input"
                id="withoutTax"
                name="taxInfo"
                onChange={event => this.onChange(event)}
              />
              <label for="withoutTax" className="taxInfo__radio-label">
                <span className="taxInfo__radio-button"></span>
                Without Tax
              </label>
            </div>
          </div>
        </div>

        <div className="bookingDetails__container">
          <div className="bookingDetails__info">
            <div className="bookingDetails__row">
              <span className="bookingDetails__left">Room Charges</span>
              <span className="bookingDetails__colon">:</span>
              <span className="bookingDetails__right">
                {this.state.payment.amount}
              </span>
            </div>
            <div className="bookingDetails__row">
              <span className="bookingDetails__left">Advance</span>
              <span className="bookingDetails__colon">:</span>
              <span className="bookingDetails__right">
                {this.state.payment.advance}
              </span>
            </div>
            <div className="bookingDetails__row">
              <span className="bookingDetails__left">Other Charges</span>
              <span className="bookingDetails__colon">:</span>
              <span className="bookingDetails__right">
                {this.state.payment.misc}
              </span>
            </div>
            <div className="bookingDetails__row">
              <span className="bookingDetails__left">Balance</span>
              <span className="bookingDetails__colon">:</span>
              <span className="bookingDetails__right">
                {this.state.payment.balance}
              </span>
            </div>
          </div>

          <div className="bookingDetails__hr"></div>

          <div className="bookingDetails__payment">
            <div className="bookingDetails__row">
              <div>
                <input
                  type="checkbox"
                  id="cash"
                  className="bookingDetails__input"
                  onChange={event => this.onChange(event)}
                />
                <label for="cash" className="bookingDetails__label">
                  <span className="bookingDetails__checkbox"></span>
                  <span>Cash Payment</span>
                </label>
              </div>

              <Form.Control
                type="number"
                id="cash_input"
                placeholder="Amount"
                className="bookingDetails__formInput"
                disabled={this.state.cashDisable}
              />
            </div>

            <div className="bookingDetails__row">
              <div>
                <input
                  type="checkbox"
                  id="card"
                  className="bookingDetails__input"
                  onChange={event => this.onChange(event)}
                />
                <label for="card" className="bookingDetails__label">
                  <span className="bookingDetails__checkbox"></span>
                  <span>Card Payment</span>
                </label>
              </div>

              <Form.Control
                type="number"
                id="card_input"
                placeholder="Amount"
                className="bookingDetails__formInput"
                disabled={this.state.cardDisable}
              />
            </div>

            <div className="bookingDetails__row">
              <div>
                <input
                  type="checkbox"
                  id="wallet"
                  className="bookingDetails__input"
                  onChange={event => this.onChange(event)}
                />
                <label for="wallet" className="bookingDetails__label">
                  <span className="bookingDetails__checkbox"></span>
                  <span>Wallet Payment</span>
                </label>
              </div>

              <Form.Control
                type="number"
                id="wallet_input"
                placeholder="Amount"
                className="bookingDetails__formInput"
                disabled={this.state.walletDisable}
              />
            </div>
          </div>
        </div>

        <Modal.Footer>
          <Button variant="primary" onClick={() => this.getPayment()}>
            Generate Report
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  }
}

export default BookingDetails;
