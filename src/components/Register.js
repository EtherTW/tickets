import Eth from 'ethjs';
import Firebase from 'firebase';
import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

const contractAddress = '0xd182db77ac90d77646b895be09e59690e4fa68e1';
const ABI = JSON.parse('[{ "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "ticket", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "puzzle", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_attendees", "type": "address" }], "name": "getTicket", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_secret", "type": "bytes" }], "name": "calculatePuzzle", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "DEPOSIT", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_secret", "type": "bytes" }], "name": "getRefund", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_puzzle", "type": "bytes32" }], "name": "setPuzzle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }]');
const firebaseConfig = {
  apiKey: "AIzaSyCIP2W4I3aA9AOuvXpUpQLzFBmwvo3lQy8",
  authDomain: "taipei-ethereum-meetup-ticket.firebaseapp.com",
  databaseURL: "https://taipei-ethereum-meetup-ticket.firebaseio.com",
  projectId: "taipei-ethereum-meetup-ticket",
  storageBucket: "taipei-ethereum-meetup-ticket.appspot.com",
  messagingSenderId: "515416889778"
}

class Register extends Component {
  constructor (props) {
    super(props);

    this.state = {
      wallet: '',
      transaction: '',
      hadTicket: false,
      metamask: true,
      name: '',
      email: ''
    };

    this.deposit = 0.001;
  }

  async componentDidMount () {
    // Initial firebase
    if (Firebase.apps.length === 0) {
      this.firebase = Firebase.initializeApp(firebaseConfig);
    } else {
      this.firebase = Firebase.apps[0];
    }

    // Initial with metamask
    if (typeof window.web3 !== 'undefined') {
      let eth = new Eth(window.web3.currentProvider);
      const accounts = await eth.accounts();
      if (accounts.length > 0) {
        const wallet = accounts[0];
        const Ticket = eth.contract(ABI);
        const ticket = Ticket.at(contractAddress);
        const result = await ticket.ticket(wallet);
        this.setState({ wallet, hadTicket: result[0] });
      }
    } else {
      this.setState({metamask: false});
    }
  }

  onSend = async () => {
    let eth = new Eth(window.web3.currentProvider);
    const transaction = await eth.sendTransaction({
      from: this.state.wallet,
      to: contractAddress,
      value: Eth.toWei(this.deposit, 'ether'),
      gas: 70000,
      gasPrice: Eth.toWei(21, 'Gwei'),
      data: '0x'
    });
    await this.firebase.database().ref(`users/${this.state.wallet}`).set({
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
      const url = `https://ropsten.etherscan.io/tx/${this.state.transaction}`;
      return (
        <div className="my-3">
          <Alert color="success">
            你的交易已經發送，請到 <a href={url} target="_blank">Etherscan</a> 查詢交易是否成功。
          </Alert>
        </div>
      )
    }
  }

  renderError () {
    if (!this.state.metamask) {
      return (
        <div className="my-3">
          <Alert color="danger">
            您還沒有安裝 MetaMask，請先到 <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">官方網站</a> 安裝並且儲值至少約 {this.deposit + 0.001} ETH （押金與給礦工的交易費）。
          </Alert>
        </div>
      );
    }
  }

  renderWarning () {
    if (this.state.hadTicket) {
      return (
        <div className="my-3">
          <Alert color="warning">
            本錢包位址已經報名，當天請出示寄給您的電子郵件即可。
          </Alert>
        </div>
      );
    }
  }

  render () {
    return (
      <div>
        <h2>報名</h2>
        <p>
          本次報名採押金制，我們將透過智能合約 (Smart Contract) 收取押金 {this.deposit} ETH 並於您參加活動後退回。在填寫表單前，請先安裝 MetaMask，並且填寫下面表單。
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

        {this.renderError()}
        {this.renderWarning()}
        {this.renderTransaction()}
      </div>
    );
  }
}

export default Register;
