// CSS and Material Design Imports
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Router and core functionality from react.
import { BrowserRouter as Router, Link, Switch, Route, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from "prop-types";

// Existing component imports.
import MyAccountScreen from '../screens/MyAccountScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';

// HOC imports.
import withStorage from './../services/withStorage';

const styles = {
  menuButton: {
     marginLeft: '2150%',
  },
  icon:{
    fill:'#DE6262'
  }
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#212121'
    }
  }
});

// This component mainly handles Material UI's Navbar, including functions to open/close
// the menu. It also handles clearing localStorage when the user clicks the "Log Out" link.
class NavbarComponent extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    logout: PropTypes.func,
    classes: PropTypes.object
  };

  state = {
    anchorEl: null
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  // Clears localStorage if checkStatus is true (withStorage)
  logoutUser = () => {
    if (this.props.checkStatus) {
      this.props.logout();
      this.props.history.push('/login');
    }
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppBar
            position='static'
            color='primary'
            style={{
              background:
                '#FFD3C9',
              height: 
                '10vh'              
            }}
          >
            <Toolbar>
              <h2 style={{marginTop:'.5rem', color: '#DE6262'}}>Just List It!</h2>
              <div>
                <IconButton style={styles.button}
                  aria-label="Menu"
                  className={classes.menuButton}
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup='true'
                  onClick={this.handleMenu}
                  color='inherit'
                >
                <AccountCircle style={styles.icon}/>
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>
                    <Link to='/account' style={{ textDecoration: 'none', color: '#e16862'}}>
                      My Account
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      this.handleClose();
                      this.logoutUser();
                    }}
                  >
                    <Link to='/login' style={{ textDecoration: 'none',  color: '#e16862' }}>
                      Logout
                    </Link>
                  </MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
        </MuiThemeProvider>

        <Switch>
          <Route path='/' exact component={LoginScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/dashboard' component={DashboardScreen} />
          <Route path='/account' component={MyAccountScreen} />
        </Switch>
      </Router>
    );
  }
}

export default withRouter(withStorage(withStyles(styles)(NavbarComponent)));
