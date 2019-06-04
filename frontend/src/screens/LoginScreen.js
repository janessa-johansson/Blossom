import React, { Component } from 'react';
import UserComponent from '../components/UserComponent';

export default class LoginScreen extends Component {
  render() {
    return <UserComponent history={this.props.history} />;
  }
}
