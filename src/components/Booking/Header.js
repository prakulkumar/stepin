import React from "react";
import Svg from "../../icons/open-exit-door";

import "./Header.css";
import moment from "moment";

const header = props => (
  <nav className="navigation">
    <ul className="navigation__list">
      <li className="navigation__item" title="Edit" onClick={props.edit}>
        <span className="icon_container">
          <i className="fa fa-pencil icon"></i>
        </span>
        <a href="#" className="navigation__link">
          Edit
        </a>
      </li>
      {props.checkedIn &&
      moment().format("L") === moment(props.checkOutDate).format("L") ? (
        <li
          className="navigation__item"
          title="Check Out"
          onClick={props.checkOut}
        >
          <span className="icon_container">
            <Svg width="20px" height="20px" fill="black" />
          </span>
          <a href="#" className="navigation__link">
            Check Out
          </a>
        </li>
      ) : null}
      {!props.checkedIn ? (
        <li
          className="navigation__item"
          title="Cancel"
          onClick={props.toggleCancelAlert}
        >
          <span className="icon_container">
            <i className="fa fa-close icon"></i>
          </span>
          <a href="#" className="navigation__link">
            Cancel Booking
          </a>
        </li>
      ) : null}
      {!props.checkedIn &&
      moment().format("L") === moment(props.checkInDate).format("L") ? (
        <li
          className="navigation__item"
          title="Check In"
          onClick={props.checkIn}
        >
          <span className="icon_container">
            <i className="fa fa-bed icon"></i>
          </span>
          <a href="#" className="navigation__link">
            Check In
          </a>
        </li>
      ) : null}
    </ul>
  </nav>
);

export default header;
