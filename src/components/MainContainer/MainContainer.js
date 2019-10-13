import React, { Component } from 'react';
import HeaderNavbar from '../Navbar/Navbar';
import Grid from '../Grid/Grid';
import './MainContainer.css';
import { types, notificationTimeOut } from '../../constants/notification';

import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const notify = (type, message) => {
    switch (type) {
        case types.SUCCESS:
            NotificationManager.success(message, "", notificationTimeOut);
            break;
        case types.ERROR:
            NotificationManager.error(message, "", notificationTimeOut);
            break;
        case types.WARNING:
            NotificationManager.warning(message, "", notificationTimeOut);
            break;
        case types.INFO:
            NotificationManager.info(message, "", notificationTimeOut);
            break;
        default:
            NotificationManager.info(message, "", notificationTimeOut);
    }
}

export default class componentName extends Component {
    state = {
        refresh: false
    }

    refreshTrueHadler = () => {
        this.setState({ refresh: true });
    }

    refreshFalseHadler = () => {
        this.setState({ refresh: false });
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                <NotificationContainer />
                <HeaderNavbar refreshTrueHadler={this.refreshTrueHadler}></HeaderNavbar>
                <Grid notify={(notification, message) => notify(notification, message)} refresh={this.state.refresh} refreshFalseHadler={this.refreshFalseHadler} />
            </div>
        )
    }
}


// const mainContainer = (props) => {

// }

// export default mainContainer;
