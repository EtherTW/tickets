import Eth from 'ethjs';
import React, { Component } from 'react';
import { Form, Button, Input } from 'reactstrap';

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI
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
    const transaction = await this.ticketContract.getRefund(this.state.secret);
    this.setState({ transaction });
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
            <Button className="mt-3" color="primary" onClick={this.onRefund}>
              取回押金
            </Button>
          </Form>

        </div>
      </div>
    );
  }
}

export default Refund;
