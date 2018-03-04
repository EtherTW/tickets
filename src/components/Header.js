import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

import Logo from './assets/logo.png';

class Header extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }

  render () {
    return (
      <Navbar color="primary" dark expand="md">
        <NavbarBrand tag={Link} to="/">
          <img className="align-middle d-inline-block" src={Logo} width="40" height="40" alt="Taipei Ethereum Meetup Logo" />
          <span className="align-middle">Tickets</span>
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink tag={Link} to="/register/">報名</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/refund">
                取回押金
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default Header;
