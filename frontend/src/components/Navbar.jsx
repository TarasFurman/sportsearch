import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar as BNavbar} from 'react-bootstrap';

const Navbar = () => (
  <BNavbar bg="dark" variant="dark">
    <BNavbar.Brand href="#home">SportSearch</BNavbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link>
        <Link to="/settings">Settings</Link>
      </Nav.Link>
    </Nav>
    <Nav>
      <Nav.Link href="#signup">Sign up</Nav.Link>
    </Nav>
  </BNavbar>
);

export default Navbar;
