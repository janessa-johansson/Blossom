// Imports basic React funtionality. Imports Material UI's default typeface, which
// we can change later to suit our app.
// Router and core functionality from react.
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import NavbarComponent from './components/NavbarComponent';
// Renders Navbar Component, which is the main entry point to the app.
const App = () => (
  <div>
    <BrowserRouter>
      <NavbarComponent />
    </BrowserRouter>
  </div>
);

export default App;
