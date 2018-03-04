import Eth from 'ethjs';
import React, { Component } from 'react';
import { Form, Button, Input } from 'reactstrap';

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
      secret: '0x77696c6c',
      web3: true,
      wallet: '',
      transaction: '',
      hadTicket: false
    };
  }

  async componentDidMount () {
    // Initial with metamask
    if (typeof window.web3 !== 'undefined') {
      let eth = new Eth(window.web3.currentProvider);
      const accounts = await eth.accounts();
      if (accounts.length > 0) {
        const wallet = accounts[0];
        const Ticket = eth.contract(CONTRACT_ABI);
        const ticket = Ticket.at(CONTRACT_ADDRESS);
        const result = await ticket.ticket(wallet);
        this.setState({ wallet, hadTicket: result[0] });
        this.ticketContract = ticket;
      }
    } else {
      this.setState({ web3: false });
    }
  }

  onInputChange = (evt) => {
    this.setState({secret: evt.target.value});
  }

  onRefund = async () => {
    let eth = new Eth(window.web3.currentProvider);
    const transaction = await eth.sendTransaction({
      from: this.state.wallet,
      to: CONTRACT_ADDRESS,
      value: 0,
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      data: this.state.secret
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
  }

  renderError () {
    if (!this.state.web3) {
      return (<AlertHelper state="no-web3" />);
    }
  }

  render () {
    return (
      <div>
        <h2>取回押金</h2>
        <p>
          活動結束後你可以透過在活動報到時所取得的驗證碼取回押金，請在下面輸入驗證碼。
        </p>
        <p>
          Transaction: {this.state.transaction}
        </p>
        <div>
          <Form className="w-50">
            <Input value={this.state.secret} onChange={this.onInputChange} />
            <Button disabled={!this.state.hadTicket || this.state.transaction || !this.state.wallet} className="mt-3" color="primary" onClick={this.onRefund}>
              取回押金
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

export default Refund;
