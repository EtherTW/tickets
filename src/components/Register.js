import Eth from 'ethjs';

import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';

const contractAddress = '0xd182db77ac90d77646b895be09e59690e4fa68e1';
const ABI = JSON.parse('[{ "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "ticket", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "puzzle", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_attendees", "type": "address" }], "name": "getTicket", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_secret", "type": "bytes" }], "name": "calculatePuzzle", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "DEPOSIT", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_secret", "type": "bytes" }], "name": "getRefund", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_puzzle", "type": "bytes32" }], "name": "setPuzzle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }]');

class Register extends Component {
  constructor (props) {
    super(props);

    this.state = {
      wallet: '',
      transaction: '',
      hadTicket: false
    };

    this.deposit = 0.001;
  }

  async componentDidMount () {
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
    this.setState({transaction});
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
            <Input type="text" name="name" id="name" />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" />
          </FormGroup>
          <FormGroup>
            <Label for="wallet">Wallet Address</Label>
            <Input plaintext name="wallet" id="wallet">{this.state.wallet}</Input>
          </FormGroup>
        </Form>
        <Button disabled={this.state.hadTicket} color="primary" onClick={this.onSend}>使用 MetaMask 送出押金</Button>

        {this.renderWarning()}
        {this.renderTransaction()}
      </div>
    );
  }
}

export default Register;
