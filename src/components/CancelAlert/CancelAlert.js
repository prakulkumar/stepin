import React from 'react';
import { Button } from 'react-bootstrap';

import './CancelAlert.css';

const cancelAlert = (props) => {
    return (
        <React.Fragment>
            { props.showCancelAlert ? (
            <div className="alert-box" id="alert-box">
            <div className="alert-box__content">
                <span className="alert-icon__box">
                    <i className="fa fa-times-circle pointerCursor alert-icon"></i>
                </span>
                <div className="alert-box__message">
                    <p>Are you sure you want to cancel the Booking</p>
                </div>
                <div className="alert-box__button">
                    <Button
                        variant="outline-secondary"
                        className="alert-box-close-btn alert-box-btn"
                        onClick={props.toggleCancelAlert}>No, I don't want to cancel.
                    </Button>
                    <Button
                        variant="danger" type="submit"
                        className="alert-box-confirm-btn alert-box-btn"
                        onClick={props.cancel}>
                        Yes, I want to cancel it.
                    </Button>
                </div>
            </div>
        </div>
        ) : null }
        </React.Fragment>

    );
};

export default cancelAlert;