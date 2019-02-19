import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar as BNavbar} from 'react-bootstrap';

const Navbar = () => (
  <BNavbar bg="dark" variant="dark">
    <BNavbar.Brand>
      <Link to="/">SportSearch</Link>
    </BNavbar.Brand>
    <Nav className="mr-auto">
      <Link to="/settings">Settings</Link>
    </Nav>
    <Nav>
      <Link to="/signup">Sign up</Link>
      <Link to="/signin">Sign in</Link>
    </Nav>
  </BNavbar>
);

export default Navbar;
