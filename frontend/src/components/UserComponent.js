// CSS and Material Design Imports
import style from '../styles/User.module.css';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Core functionality from react and axios.
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";

// HOC imports.
import withStorage from './../services/withStorage';

import Alert from 'react-bootstrap/Alert'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1d1e20'
    }
  }
});

//validates registration form
function validateForm(name, username, password) {
  return {
    name: name.length < 2,
    username: username === '',
    password: password.length < 6
  };
}

// This component handles the bulk of the user's experience through our app, including
// logging in, registering for the first time. User information is sent to Softhouse's API,
// saved in localStorage, which is retrieved on a as-needed basis.
class UserComponent extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    getUser: PropTypes.func,
    getUsers: PropTypes.func,
    addUser: PropTypes.func,
    login: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      showRegister: false,

      name: '',
      username: '',
      password: '',

      //validation
      touched: {
        name: false,
        username: false,
        password: false
      },

      //used to compare userinformation.username & usernameLogin etc.
      usernameLogin: '',
      passwordLogin: '',

      //softhouse user data
      userData: [],

      //errormessage
      error: false,

      // handling error 500 from Softhouse (duplicate key)
      caughtError: false

    };
  }

  //updates the showRegister state and toggles the registration form
  showForm = () => {
    this.setState({ showRegister: !this.state.showRegister });
  };

  //updates a field's state to true if it was touched
  handleBlur = field => event => {
    this.setState({
      touched: { ...this.state.touched, [field]: true }
    });
  };

  // One function to handle all the input field data changes, where 'name' is field changed
  // and event is the incoming data change to that field. This function then sets the appropriate state.
  handleInputChange = name => event => {
    const state = {};
    state[name] = event.target.value;
    this.setState(state);
  };

  //registers the user by updating the userInformation
  onRegistration = event => {
    event.preventDefault();
    this.props.login(this.state.username);

    const newUser = {
      name: this.state.name,
      username: this.state.username,
      password: this.state.password
    };

    // Posts user information on user registration, and posts it to Softhouse's API using axios' options.
    // Then redirects the user to dashboard. If the user registration already exists, render error.
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    };

    axios
      .post('http://localhost:3000/users/', newUser, axiosConfig)
      .then(response => {
        this.props.addUser(response.data);
        this.props.history.push('/dashboard');
      }).catch(error => {
        if (error.response.status === 500) {
          this.setState({ caughtError: true });
        }
      })
  };

  // Getting user data from Softhouse API though withStorage HOC and sets userData. 
  componentDidMount() {

    // Title for UX/Accessability 
    document.title = `The Weather - Login`;

    // Logged in user is redirected to the dashboard.
    const user = this.props.getUser();
    if (user !== null) {
      this.props.history.push('/dashboard');
      return;
    }
    this.props
      .getUsers()
      .then(response => this.setState({ userData: response.data }));
  }

  //checks if user is registered by comparing username & password to API, updates error, sets localStorage to username (withStorage)

  // If the user successfully logs in, their information is saved in localStorage.
  // A successful login redirects the user to the dashboard.
  loginUser = event => {
    event.preventDefault();
    const user = this.state.userData.reduce((prev, user) => {
      return user.username === this.state.usernameLogin &&
        user.password === this.state.passwordLogin
        ? user
        : prev;
    }, undefined);
    if (user === undefined) {
      this.setState({ error: true });
      return;
    }
    this.props.login(user.username);
    this.props.addUser(user);
    this.props.history.push('/dashboard');
  };

  render() {
    //sends user's inputs from registration to validation
    const errors = validateForm(
      this.state.name,
      this.state.username,
      this.state.password
    );

    //disable button if errors keys (name, username, password etc.) includes an error
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    //if an error is catched in a field update that field's state after its touched
    const shouldMarkError = field => {
      const checkError = errors[field];
      const shouldShowError = this.state.touched[field];
      return checkError ? shouldShowError : false;
    };

    return (
      <div role="main">
        <div className={style.card}>
        {this.state.showRegister ? 
            <div>
              {!this.state.error && <span className={style.textlogin}>Please enter your desired login information.</span>}
              <form onSubmit={this.onRegistration}>
                <div className={style.center} role="form">
                  <MuiThemeProvider theme={theme}>
                    <div className={style.center}>
                      {this.state.caughtError && <span className={style.texterror}>User already exists.</span>}
                      <TextField
                        required
                        className={shouldMarkError('name') ? 'error' : ''}
                        margin='normal'
                        id='enter-name'
                        label='Name'
                        variant='outlined'
                        type='text'
                        value={this.state.name}
                        onChange={this.handleInputChange('name')}
                        onBlur={this.handleBlur('name')}
                      />
                    </div>

                    <div className={style.center}>
                      <TextField
                        required
                        className={shouldMarkError('username') ? 'error' : ''}
                        margin='normal'
                        id='enter-username'
                        label='Username'
                        variant='outlined'
                        type='text'
                        value={this.state.username}
                        onChange={this.handleInputChange('username')}
                        onBlur={this.handleBlur('username')}
                      />
                    </div>

                    <div className={style.center}>
                      <TextField
                        required
                        className={shouldMarkError('password') ? 'error' : ''}
                        type='password'
                        margin='normal'
                        id='enter-password'
                        label='Password'
                        variant='outlined'
                        value={this.state.password}
                        onChange={this.handleInputChange('password')}
                        onBlur={this.handleBlur('password')}
                      />
                    </div>

                  </MuiThemeProvider>
                  <div />
                </div>
                <br />
                <button className={style.btn} disabled={isDisabled}>
                  Register
              </button>
              </form>
            </div>
           :
          <div>
            {this.state.error && <Alert variant={'danger'} className={style.texterror}>User credentials invalid.</Alert>}
            {!this.state.error && <span className={style.textlogin}>Please login.</span>}
            <form onSubmit={this.loginUser}>
              <div className={style.center} >
                <MuiThemeProvider theme={theme}>
                  <div className={style.center} role="form">
                    <TextField
                      margin='normal'
                      id='Login Username'
                      label='Username'
                      variant='outlined'
                      type='text'
                      value={this.state.usernameLogin}
                      onChange={this.handleInputChange('usernameLogin')}
                    />
                  </div>
                  <div className={style.center}>
                    <TextField
                      margin='normal'
                      id='Login Password'
                      label='Password'
                      variant='outlined'
                      type='password'
                      value={this.state.passwordLogin}
                      onChange={this.handleInputChange('passwordLogin')}
                    />
                  </div>
                </MuiThemeProvider>
                <div />
              </div>

              <br />
              <button className={style.btn}>Login</button>
            </form>
            <br />
            <hr />
            <div onClick={this.showForm} className={style.textlogin}>
              Don't have an account? Click here!
          </div>
            <hr />
          </div>

          }
        </div>
      </div>
    );
  }
}
export default withStorage(UserComponent);
