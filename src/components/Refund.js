import Eth from 'ethjs';
import React, { Component } from 'react';
import { Form, Button, Input } from 'reactstrap';
import { injectIntl } from 'react-intl'

import AlertHelper from './AlertHelper';
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  GAS_LIMIT,
  GAS_PRICE
} from '../constants';

class Refund extends Component {
  constructor (props) {
    super(props);

    this.state = {
      web3: true,
      wallet: '',
      transaction: '',
      hadTicket: false,
      initialized: false,
      attended: false
    };
  }

  async componentDidMount () {
    const newState = {};
    // Initial with metamask
    if (typeof window.web3 !== 'undefined') {
      let eth = new Eth(window.web3.currentProvider);
      const accounts = await eth.accounts();
      if (accounts.length > 0) {
        const wallet = accounts[0];
        const Ticket = eth.contract(CONTRACT_ABI);
        const ticket = Ticket.at(CONTRACT_ADDRESS);
        const result = await ticket.userId(wallet);
        const userId = result[0];
        const hadTicket = userId > 0;
        const attended = await ticket.isAttend(userId);
        this.ticketContract = ticket;
        newState.wallet = wallet;
        newState.hadTicket = hadTicket;
        newState.attended = attended[0];
      }
    } else {
      newState.web3 = true;
    }

    newState.initialized = true;
    this.setState(newState);
  }

  onRefund = async () => {
    let eth = new Eth(window.web3.currentProvider);
    const transaction = await eth.sendTransaction({
      from: this.state.wallet,
      to: CONTRACT_ADDRESS,
      value: 0,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      data: '0x'
    });

    this.setState({ transaction });
  }

  renderTransaction () {
    if (this.state.transaction) {
      return <AlertHelper state="transaction-sent" transaction={this.state.transaction} />
    }
  }

  renderWarning () {
    if (!this.state.hadTicket && this.state.wallet) {
      return <AlertHelper state="no-refund" />;
    }

    if (!this.state.attended && this.state.initialized) {
      return (<AlertHelper state="no-attend" />)
    }
  }

  renderError () {
    if (!this.state.web3) {
      return (<AlertHelper state="no-web3" />);
    } else if (!this.state.wallet) {
      return (<AlertHelper state="no-wallet" />);
    }
  }

  renderAttended () {
    if (!this.state.initialized) {
      return '';
    }
    const intl = this.props.intl
    return intl.formatMessage({ id: this.state.attended ? 'Attened' : 'Not Yet Attended' });
  }

  render () {
    const intl = this.props.intl
    return (
      <div>
        <h2>{intl.formatMessage({ id: 'Refund' })}</h2>
        <p>{intl.formatMessage({ id: 'refundDescription' })}</p>
        <p>
          {intl.formatMessage({ id: 'Transaction' })}: {this.state.transaction}
        </p>
        <p>
          {intl.formatMessage({ id: 'Event Status' })}: <strong>{this.renderAttended()}</strong>
        </p>
        <div>
          <Form className="w-50">
            <Input value={this.state.secret} onChange={this.onInputChange} />
            <Button disabled={!this.state.hadTicket || this.state.transaction || !this.state.wallet} className="mt-3" color="primary" onClick={this.onRefund}>
              {intl.formatMessage({ id: 'Refund' })}
            </Button>
          </Form>

          <div className="my-3">
            {this.renderTransaction()}
            {this.renderWarning()}
            {this.renderError()}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Refund);
