import React, { Component } from 'react';
import withStorage from '../services/withStorage';
import { withRouter } from 'react-router-dom';

class DashboardComponent extends Component {

    componentDidMount() {

        // Title for UX/Accessability 
        document.title = `The Weather - Dashboard`;

        // If a user who is not logged in tries to access the dashboard, they are redirected
        // to the login page.
        const user = this.props.getUser();
        if (user === null) {
            this.props.history.push('/');
            return;
        }
    }
    render() {
        return (
            <div>
                <p>hello from Dashboard!</p>
            </div>
        )
    }
}

export default withRouter(withStorage(DashboardComponent));