import React, { Component, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import "./Report.css";

import moment from "moment";
import ReactToPrint from "react-to-print";
import ReactToPdf from "react-to-pdf";

let booking;
const pdfComponentRef = React.createRef();

class ReportGenerator extends Component {
  render() {
    return (
      <div className="report__container" ref={pdfComponentRef}>
        <div className="report__section">
          <div className="report-row">
            <span className="report-key">Booking Id</span>
            <span className="report-value">{booking._id}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Booking Date</span>
            <span className="report-value">
              {moment(booking.bookingDate).format("L")}
            </span>
          </div>
          <div className="report-row">
            <span className="report-key">Hotel Name</span>
            <span className="report-value">Delight Hotel</span>
          </div>
        </div>
        <div className="report__section">
          <div className="report-row">
            <span className="report-key">Name</span>
            <span className="report-value">
              Mr. {booking.firstName} {booking.lastName}
            </span>
          </div>
          <div className="report-row">
            <span className="report-key">Contact Number</span>
            <span className="report-value">{booking.contactNumber}</span>
          </div>
        </div>
        <div className="report__section">
          <div className="report-row">
            <span className="report-key">Check In</span>
            <span className="report-value">
              {moment(booking.checkIn).format("L")}
            </span>
          </div>
          <div className="report-row">
            <span className="report-key">Check In Time</span>
            <span className="report-value">{booking.checkInTime}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Check Out</span>
            <span className="report-value">
              {moment(booking.checkOut).format("L")}
            </span>
          </div>
          <div className="report-row">
            <span className="report-key">Check Out Time</span>
            <span className="report-value">{booking.checkOutTime}</span>
          </div>
          <div className="report-row">
            <span className="report-key">No of Rooms</span>
            <span className="report-value">{booking.rooms.length}</span>
          </div>
          <div className="report-row">
            <span className="report-key">No of Guests</span>
            <span className="report-value">
              {Number(booking.adults) + Number(booking.children)}
            </span>
          </div>
          <div className="report-row">
            <span className="report-key">No of Nights</span>
            <span className="report-value">
              {moment(booking.checkOut).date() - moment(booking.checkIn).date()}
            </span>
          </div>
        </div>
        <div className="report__section">
          <div className="report-row">
            <span className="report-key">Amount</span>
            <span className="report-value">{booking.payment.actualAmount}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Tax</span>
            <span className="report-value">
              {booking.payment.payment.taxPercent + "%"}
            </span>
          </div>
          <div className="report-row">
            <span className="report-key">Total</span>
            <span className="report-value">{booking.payment.amount}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Advance</span>
            <span className="report-value">{booking.payment.advance}</span>
          </div>
          <div className="report-row">
            <span className="report-key">Balance</span>
            <span className="report-value">{booking.payment.balance}</span>
          </div>
        </div>
        <div className="report__section">
          {booking.payment.payment.payment.cashPayment !== 0 ? (
            <div className="report-row">
              <span className="report-key">Paid By Cash</span>
              <span className="report-value">
                {booking.payment.payment.payment.cashPayment}
              </span>
            </div>
          ) : null}
          {booking.payment.payment.payment.cardPayment !== 0 ? (
            <div className="report-row">
              <span className="report-key">Paid By Card</span>
              <span className="report-value">
                {booking.payment.payment.payment.cardPayment}
              </span>
            </div>
          ) : null}
          {booking.payment.payment.payment.walletPayment !== 0 ? (
            <div className="report-row">
              <span className="report-key">Paid By Wallet</span>
              <span className="report-value">
                {booking.payment.payment.payment.walletPayment}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const Report = props => {
  const componentRef = useRef();
  booking = props.booking;
  return (
    <div>
      <ReportGenerator ref={componentRef} />
      <Modal.Footer>
        <div className="report__footerContainer">
          <ReactToPdf targetRef={pdfComponentRef} filename="report.pdf">
            {({ toPdf }) => (
              <Button variant="primary" className="report__btn" onClick={toPdf}>
                Download
              </Button>
            )}
          </ReactToPdf>
          <ReactToPrint
            trigger={() => (
              <Button variant="primary" className="report__btn">
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
          {!booking.reportGenerated ? (
            <Button
              variant="primary"
              className="report__btn"
              onClick={() => props.reportHandler()}
            >
              Done
            </Button>
          ) : null}
        </div>
      </Modal.Footer>
    </div>
  );
};

export default Report;
