import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import './Modal.css';

const modal = (props) => {
    return (
        <Modal show={props.showModal} onHide={props.onClose} centered size={props.size}>
            <Modal.Header closeButton className="modalTitle modal-header">{props.modalTitle}</Modal.Header>
            <Modal.Body className="modal__body">
                { props.children }
            </Modal.Body>
        </Modal>
    )
};

export default modal;