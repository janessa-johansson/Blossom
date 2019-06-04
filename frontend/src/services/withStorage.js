// HOC that deals with local storage. Informtion is used in various components.
// Renders the wrapped component with the local storage data.

import React from 'react';
import axios from 'axios';

const loginKey = 'username';
const userKey = 'user';

const withStorage = WrappedComponent => {
  class HOC extends React.Component {

    // Checks if user exists in localStorage.
    checkStatus() {
      localStorage.getItem(loginKey);
    };

    // Gets the logged in user from localStorage.
    getUser = () => {
      return JSON.parse(localStorage.getItem(userKey));
    }

    // Adds key, data to localStorage.
    addData = (key, data) => {
      localStorage.setItem(key, data);
    };

    // Sets localStorage to key = user, and data = uservalue in UserComponent
    login = (username) => {
      this.addData(loginKey, username);
    };

    // Adds our user and stingify's it. Used in UserComponent for Registration.
    addUser = (user) => {
      this.addData(userKey, JSON.stringify(user));
    }

    // Clears user from localStorage.
    logout = () => {
      localStorage.removeItem(loginKey);
      localStorage.removeItem(userKey);
    };

    // Gets users from Softhouse API.
    getUsers() {
      return axios.get('http://api.softhouse.rocks/users/');
    }

    // Gets user's ID from Softhouse API.
    getUserId(id) {
      return axios.get('http://api.softhouse.rocks/users/' + id);
    }

    render() {
      return (
        <WrappedComponent
          checkStatus={this.checkStatus}
          login={this.login}
          logout={this.logout}
          addUser={this.addUser}
          getUser={this.getUser}
          getUsers={this.getUsers}
          getUserId={this.getUserId}
          {...this.props}
        />
      );
    }
  }

  return HOC;
};

export default withStorage;
