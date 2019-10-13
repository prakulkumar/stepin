import React from 'react';
import Svg from '../../icons/open-exit-door';

import { Button, Modal, Form, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './BookingForm.css';

const bookingForm = (props) => {

    const bookingDetailsForm = (
        <React.Fragment>
            <Form.Row>
                <Form.Group as={Col} md="5" controlId="firstName"
                    className="form__group display-flex">
                    <div>
                        <Form.Control
                            title="First Name"
                            type="text"
                            placeholder="First Name"
                            value={props.hotelBookingForm.firstName}
                            name="firstName"
                            onChange={props.onChanged}
                            disabled={!props.isEdit && props.disable}
                            className="form__input valueCapitalize"
                            required />
                        <Form.Label className="form__label">First Name</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
                <Form.Group as={Col} md="5" controlId="lastName"
                    className="form__group display-flex">
                    <div>
                        <Form.Control
                            title="Last Name"
                            type="text"
                            placeholder="Last Name"
                            value={props.hotelBookingForm.lastName}
                            name="lastName"
                            className="form__input valueCapitalize"
                            onChange={props.onChanged}
                            disabled={!props.isEdit && props.disable}
                            required />
                        <Form.Label className="form__label">Last Name</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="10" controlId="address"
                    className="form__group display-flex">
                    <div className="form__group-addressContainer">
                        <Form.Control
                            title="Address"
                            as="textarea"
                            rows="1"
                            placeholder="Address"
                            value={props.hotelBookingForm.address}
                            name="address"
                            onChange={props.onChanged}
                            disabled={!props.isEdit && props.disable}
                            className="form__input"
                            required />
                        <Form.Label className="form__label">Address</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="5"
                    className="form__group display-flex">
                    <div>
                        <DatePicker
                            id="checkIn"
                            title="Check In"
                            selected={props.hotelBookingForm.checkIn}
                            onSelect={(event) => props.onChanged({ event, name: "checkIn", isDate: true })}
                            dateFormat="MMMM d, yyyy"
                            placeholderText="Check In"
                            minDate={new Date()}
                            key="checkIn"
                            className="form__input form-control"
                            disabled={!props.isEdit && props.disable || props.checkedIn}
                            required
                        />
                        <Form.Label className="form__label">Check In</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
                <Form.Group as={Col} md="5" controlId="checkOut"
                    className="form__group display-flex">
                    <div>
                        <DatePicker
                            title="Check Out"
                            selected={props.hotelBookingForm.checkOut}
                            onSelect={(event) => props.onChanged({ event, name: "checkOut", isDate: true })}
                            dateFormat="MMMM d, yyyy"
                            placeholderText="Check Out"
                            minDate={props.hotelBookingForm.checkIn}
                            key="checkOut"
                            className="form-control form__input"
                            disabled={!props.isEdit && props.disable}
                            required
                        />
                        <Form.Label className="form__label">CheckOut</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="3" controlId="adults"
                    className="form__group display-flex">
                    <div>
                        <Form.Control
                            title="Adults"
                            type="number"
                            placeholder="Adults"
                            value={props.hotelBookingForm.adults}
                            name="adults"
                            onChange={props.onChanged}
                            disabled={!props.isEdit && props.disable}
                            min="1"
                            className="form__input"
                            required />
                        <Form.Label className="form__label">Adults</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
                <Form.Group as={Col} md="2" controlId="children"
                    className="form__group display-flex">
                    <div>
                        <Form.Control
                            title="Children"
                            type="number"
                            placeholder="Children"
                            value={props.hotelBookingForm.children}
                            name="children"
                            onChange={props.onChanged}
                            disabled={!props.isEdit && props.disable}
                            min="0"
                            className="form__input"
                            required />
                        <Form.Label className="form__label">Children</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
                <Form.Group as={Col} md="5" controlId="contactNumber"
                    className="form__group display-flex">
                    <div>
                        <Form.Control
                            title="Contact Number"
                            type="number"
                            placeholder="Contact Number"
                            value={props.hotelBookingForm.contactNumber}
                            name="contactNumber"
                            onChange={props.onChanged}
                            disabled={!props.isEdit && props.disable}
                            className="form__input"
                            required />
                        <Form.Label className="form__label">Contact Number</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} md="5" controlId="amount"
                    className="form__group display-flex">
                    <div>
                        <Form.Control
                            title="Room Charges"
                            type="number"
                            placeholder="Room Charges"
                            value={props.hotelBookingForm.amount}
                            name="amount"
                            onChange={props.onChanged}
                            disabled={!props.isEdit && props.disable}
                            min="1"
                            className="form__input"
                            required></Form.Control>
                        <Form.Label className="form__label">Room Charges</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
                <Form.Group as={Col} md="5" controlId="advance"
                    className="form__group display-flex">
                    <div>
                        <Form.Control
                            title="Advance"
                            type="number"
                            placeholder="Advance"
                            value={props.hotelBookingForm.advance}
                            name="advance"
                            onChange={props.onChanged}
                            disabled={!props.isEdit && props.disable}
                            min="0"
                            className="form__input"
                            required></Form.Control>
                        <Form.Label className="form__label">Advance</Form.Label>
                    </div>
                    <span className="required">*</span>
                </Form.Group>
            </Form.Row>
        </React.Fragment>
    )

    const roomDetailsForm = (
        <div className="add-room-form">
            {
                props.hotelBookingForm.rooms.map((room, index) => {
                    return (
                        <Form.Row key={index}>
                            <Form.Group as={Col} md="4" controlId="roomType"
                                className="form__group display-flex">
                                <Form.Control
                                    as="select" title="Room Type"
                                    value={props.hotelBookingForm.rooms[index].roomType}
                                    name="roomType"
                                    onChange={(event) => props.onRoomChanged(event, "roomType", index)}
                                    disabled={!props.isEdit && props.disable}
                                    className="form__input"
                                    required >
                                    <option value='' hidden>Room Type</option>
                                    {props.roomTypes.map((roomType, i) => {
                                        return <option key={`roomType${i}`}>{roomType}</option>
                                    })}
                                </Form.Control>
                                <span className="required">*</span>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="roomNumber"
                                className="form__group display-flex">
                                <Form.Control
                                    as="select" title="Room No"
                                    value={props.hotelBookingForm.rooms[index].roomNumber}
                                    name="roomNumber"
                                    onChange={(event) => props.onRoomChanged(event, "roomNumber", index)}
                                    disabled={!props.isEdit && props.disable}
                                    className="form__input"
                                    required >
                                    <option value='' hidden>Room No  {room.roomNumber}</option>
                                    {props.availableRooms.map((r, i) => {
                                        if (r.roomType === room.roomType) {
                                            return <option key={`roomNo${i}`}>{r.roomNumber}</option>
                                        }
                                        return null;
                                    })}
                                </Form.Control>
                                <span className="required">*</span>
                            </Form.Group>
                            {index === 0 ? (
                                <Form.Group as={Col} md="2" className="icon">
                                    <Button variant="outline-primary"
                                        className="btn-no-border btn-no-border--primary addIcon"
                                        type="button"
                                        onClick={props.addRoom}
                                        disabled={!props.isEdit && props.disable} title="Add Room">
                                        <i className="fa fa-plus pointerCursor icon-medium"></i>
                                    </Button>
                                </Form.Group>
                            ) : (
                                    <Form.Group as={Col} md="2" className="icon">
                                        <Button variant="outline-danger"
                                            className="btn-no-border btn-no-border--danger deleteIcon"
                                            type="button"
                                            disabled={!props.isEdit && props.disable}
                                            title="Delete"
                                            onClick={() => props.deleteRoom(index)}
                                        >
                                            <i className="fa fa-trash-o pointerCursor icon-medium"></i>
                                        </Button>
                                    </Form.Group>
                                )}
                        </Form.Row>
                    )
                })
            }
        </div>
    );

    let form = (
        <Form noValidate validated={props.validated}
            onSubmit={props.onBooked}
            className="form">
            <div className="form__container display-flex">
                <div className="booking-details-form">{bookingDetailsForm}</div>
                <div className="separator"></div>
                {roomDetailsForm}
            </div>
            <Modal.Footer className="modal-footer">
                <Button variant="outline-secondary" onClick={props.onClose}>Close</Button>
                <Button variant="primary" type="submit" className="btn-submit">Submit</Button>
            </Modal.Footer>
        </Form>
    );
    return <React.Fragment>{form}</React.Fragment>
};

export default bookingForm;