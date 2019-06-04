// CSS and Material Design Imports
import style from '../styles/Account.module.css';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';

// Core functionality from react and axios.
import React, { Component } from 'react';
import axios from 'axios';
import withStorage from './../services/withStorage';
import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1d1e20'
    }
  }
});

// This component handles everything for the Edit Account screen.
// The fields populate from the data it gets from Softhouse API, where
// the user can then easily edit it and confirm the changes.
// After confirming, the user is redirection to the DashboardScreen.

class AccountComponent extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    getUser: PropTypes.func,
    getUserId: PropTypes.func,
    addUser: PropTypes.func
  };

  // User state with empty values used for editing and saving user
  // account information.
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: '',
      username: '',
      email: '',
      temperature: '',
      // handling error 500 from Softhouse (duplicate key)
      caughtError: false
    };
  }

  // One function to handle all the input field data changes, where 'name' is field changed
  // and event is the incoming data change to that field. This function then sets the appropriate state.
  handleInputChange = name => event => {
    const state = {};
    state[name] = event.target.value;
    this.setState(state);
  };

  // Getting user data from Softhouse API though withStorage HOC. 
  // If a user who is not logged in tries to access this page, the user
  // is then redirected to login (/). If the user does exist, the information is grabbed
  // from Softhouse's API and set as the state with the help of setUserInformation.
  componentDidMount() {

    // Title for UX/Accessability 
    document.title = `The Weather - Your Account`;

    // If a user who is not logged in tries to access the dashboard, they are redirected
    // to the login page.
    const user = this.props.getUser();
    if (user === null) {
      this.props.history.push('/');
      return;
    }
    this.setUserInformation(user);
    this.props.getUserId(user.id).then(response => {
      const data = response.data;
      this.setUserInformation(data);
    });
  }

  // Sets the user's information as the current state.
  setUserInformation(user) {
    this.setState({
      id: user.id,
      name: user.name,
      username: user.username,
      password: user.email,
      temperature: user.address.zipcode
    });
  }

  // Handles input edits when user clicks the 'confirm changes' button.
  editAccount = event => {
    event.preventDefault();
    const editUser = {
      name: this.state.name,
      username: this.state.username,
      email: this.state.password,
      address: {
        street: 'mock street 12',
        suite: 'online',
        city: 'Stockholm',
        zipcode: this.state.temperature,
        geo: {
          lat: 0,
          lng: 0
        }
      }
    };

    // Sends the updated user to Softouse's API, then redirects user to the dashboard.
    axios
      .put('http://api.softhouse.rocks/users/' + this.state.id, editUser)
      .then(response => {
        this.props.addUser(response.data);
        this.props.history.push('/dashboard');
      }).catch(error => {
        if (error.response.data.code === 11000) {
          this.setState({ caughtError: true });
        }
      })
  };

  render() {
    const { name, username, temperature } = this.state;
    return (
      <div role="main">
        <h1 className={style.visuallyhidden}>The Weather - Your Account</h1>
        <div className="icon center flurries">
          <div className="cloud"></div>
          <div className="cloud"></div>
          <div className="snow">
            <div className="flake"></div>
            <div className="flake"></div>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.textaccount}>My Account</div>
          <hr />
          <div>
            <div className={style.textlogin}>Name: {name} </div>
            <div className={style.textlogin}>Username: {username} </div>
            <div className={style.textlogin}>Temperature: {temperature} </div>
          </div>
          <hr />
          {this.state.caughtError && <span className={style.texterror}>User already exists.</span>}
          <form onSubmit={this.editAccount}>
            <MuiThemeProvider theme={theme}>
              <TextField
                margin='normal'
                id="name"
                label='Name'
                variant='outlined'
                type='text'
                value={name}
                onChange={this.handleInputChange('name')}
              />
              <br />

              <TextField
                margin='normal'
                id="username"
                label='Username'
                variant='outlined'
                type='text'
                value={username}
                onChange={this.handleInputChange('username')}
              />
              <br />

              <TextField
                margin='normal'
                id="password"
                label='Password'
                variant='outlined'
                type='password'
                placeholder='password'
                onChange={this.handleInputChange('password')}
              />
              <br />
              <br />

              <label><span className={style.textlogin}>Choose temperature unit:</span>
                <br />
                <br />
                <Select
                  native
                  id="temperature"
                  inputprops={{ 'aria-label': 'Temperature Unit' }}
                  aria-label="Temperature"
                  value={temperature}
                  onChange={this.handleInputChange('temperature')}
                >

                  <option value='C' inputprops={{ 'aria-label': 'Celcius' }} aria-label="Celcius" id="celcius">Celcius</option>
                  <option value='F' inputprops={{ 'aria-label': 'Fahrenheit' }} aria-label="Fahrenheit" id="fahrenheit">Fahrenheit</option>
                </Select>
                <br />
                <br />
              </label>

              <button className={style.btn} type='submit'>Confirm Changes</button>
            </MuiThemeProvider>
          </form>
        </div>
      </div>
    );
  }
}
export default withRouter(withStorage(AccountComponent));
