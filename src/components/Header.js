import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { injectIntl } from 'react-intl'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import Logo from './assets/logo.png';

class Header extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleEnglishItemOnClick = (e) => {
    e.preventDefault()
    localStorage.setItem('lang', 'en')
    window.location.reload()
  }

  handleChineseItemOnClick = (e) => {
    e.preventDefault()
    localStorage.setItem('lang', 'zh')
    window.location.reload()
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }

  render () {
    const intl = this.props.intl
    return (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand tag={Link} to="/">
          <img className="align-middle d-inline-block" src={Logo} width="40" height="40" alt="Taipei Ethereum Meetup Logo" />
          <span className="align-middle">Tickets</span>
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink tag={Link} to="/register/">
                {intl.formatMessage({ id: 'Register' })}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/refund">
                {intl.formatMessage({ id: 'Refund' })}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://www.facebook.com/messages/t/eth.taipei" target="_blank" rel="noopener noreferrer">
                {intl.formatMessage({ id: 'Contact Us'})}
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {intl.formatMessage({ id: 'Language' })}
              </DropdownToggle>
              <DropdownMenu >
                <DropdownItem onClick={this.handleEnglishItemOnClick}>
                  English
                </DropdownItem>
                <DropdownItem onClick={this.handleChineseItemOnClick}>
                  繁體中文
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default injectIntl(Header);
