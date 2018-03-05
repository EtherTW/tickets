import Eth from 'ethjs';
import firebase from 'firebase';
import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import AlertHelper from './AlertHelper';
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  GAS_PRICE,
  GAS_LIMIT,
  DEPOSIT
} from '../constants';

class Register extends Component {
  constructor (props) {
    super(props);

    this.state = {
      wallet: '',
      transaction: '',
      hadTicket: false,
      web3: true,
      name: '',
      email: '',
      initialized: false
    };
  }

  async componentDidMount () {
    const newState = {};
    // Initial with web3
    if (typeof window.web3 !== 'undefined') {
      let eth = new Eth(window.web3.currentProvider);
      const accounts = await eth.accounts();
      if (accounts.length > 0) {
        const wallet = accounts[0];
        const Ticket = eth.contract(CONTRACT_ABI);
        const ticket = Ticket.at(CONTRACT_ADDRESS);
        const result = await ticket.userId(wallet);
        const hadTicket = result[0] > 0;
        newState.wallet = wallet;
        newState.hadTicket = hadTicket;
      }
    } else {
      newState.web3 = false;
    }

    this.setState(newState)
  }

  onSend = async () => {
    let eth = new Eth(window.web3.currentProvider);
    const transaction = await eth.sendTransaction({
      from: this.state.wallet,
      to: CONTRACT_ADDRESS,
      value: Eth.toWei(DEPOSIT, 'ether'),
      gas: GAS_LIMIT,
      gasPrice: GAS_PRICE,
      data: '0x'
    });
    await firebase.database().ref(`users/${this.state.wallet}`).set({
      name: this.state.name,
      email: this.state.email,
      transaction
    });
    this.setState({transaction});
  }

  onNameChange = (event) => {
    this.setState({name: event.target.value});
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }

  renderTransaction () {
    if (this.state.transaction) {
      return (<AlertHelper transaction={this.state.transaction} state="transaction-sent" />);
    }
  }

  renderError () {
    if (!this.state.web3) {
      return (<AlertHelper state="no-web3" />);
    } else if (this.state.initialized && !this.state.wallet) {
      return (<AlertHelper state="no-wallet" />);
    }
  }

  renderWarning () {
    if (this.state.hadTicket) {
      return (<AlertHelper state="had-ticket" />);
    }
  }

  render () {
    return (
      <div>
        <h2>報名</h2>
        <p>
          本次報名採押金制，我們將透過智能合約 (Smart Contract) 收取押金 {DEPOSIT} ETH 並於您參加活動後退回。在填寫表單前，請先安裝支援 web3 的瀏覽器或延伸套件，桌面版的 Chrome 或 Firefox 請安裝 MetaMask，手機請安裝 Cipher 或 True 後並填寫下面表單。
        </p>
        <Form className="w-50">
          <FormGroup>
            <Label for="name">名字 / 暱稱</Label>
            <Input type="text" name="name" id="name" value={this.state.name} onChange={this.onNameChange} />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" value={this.state.email} onChange={this.onEmailChange} />
          </FormGroup>
          <FormGroup>
            <Label for="wallet">Wallet Address</Label>
            <Input plaintext name="wallet" id="wallet">{this.state.wallet}</Input>
          </FormGroup>
        </Form>
        <Button disabled={this.state.hadTicket || !this.state.wallet} color="primary" onClick={this.onSend}>使用 MetaMask 送出押金</Button>

        <div className="my-3">
          {this.renderError()}
          {this.renderWarning()}
          {this.renderTransaction()}
        </div>
      </div>
    );
  }
}

export default Register;
