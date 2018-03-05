import Eth from 'ethjs';
import React, { Component } from 'react';
import { Form, Button, Input } from 'reactstrap';
import { injectIntl } from 'react-intl'
import { Container } from 'reactstrap';
import SectionHeader from './SectionHeader';
import AlertHelper from './AlertHelper';
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  GAS_LIMIT,
  GAS_PRICE,
  NETWORK_ID,
  INTERVAL_TIME,
} from '../constants';

class Refund extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: true,
      wallet: '',
      transaction: '',
      hadTicket: false,
      initialized: false,
      attended: false,
      validNetwork: false
    };
  }

  async componentDidMount() {

    this.checkWeb3IntervalId = setInterval(async () => {
      const newState = {};
      try {
        const web3 = window.web3
        newState.web3 = web3
        if (web3) {
          const networkId = web3.version.network
          newState.validNetwork = (networkId === NETWORK_ID)
          const eth = new Eth(window.web3.currentProvider);
          const accounts = await eth.accounts();
          const wallet = accounts[0];
          newState.wallet = wallet;
          if (wallet) {
            const Ticket = eth.contract(CONTRACT_ABI);
            const ticket = Ticket.at(CONTRACT_ADDRESS);
            const result = await ticket.userId(wallet);
            const userId = result[0];
            const hadTicket = result[0] > 0;
            newState.hadTicket = hadTicket;
            const attended = await ticket.isAttend(userId);
            newState.attended = attended[0];
          } else {
            newState.hadTicket = false;
            newState.attended = false;
          }
        }
        newState.initialized = true;
        this.setState({...this.state, ...newState})
      } catch (error) {
        newState.web3 = false;
        newState.initialized = true;
        this.setState({...this.state, ...newState})
      }
    }, INTERVAL_TIME);

  }

  componentWillUnmount() {
    clearInterval(this.checkWeb3IntervalId);
  }

  onRefund = async () => {
    const secret = this.state.secret
    if (!secret) {
      // Add error message
      return
    }
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

  renderAlert = () => {
    if (!this.state.web3) {
      return (<AlertHelper state="no-web3" />);
    }
    if (!this.state.validNetwork) {
      return (<AlertHelper state="invalid-network" />);
    }
    if (!this.state.wallet) {
      return (<AlertHelper state="no-wallet" />);
    }
    if (!this.state.attended) {
      return (<AlertHelper state="no-attend" />)
    }
    if (!this.state.hadTicket) {
      return <AlertHelper state="no-refund" />;
    }
    if (this.state.transaction) {
      return <AlertHelper state="transaction-sent" transaction={this.state.transaction} />
    }
  }

  renderAttended() {
    const intl = this.props.intl
    return intl.formatMessage({ id: this.state.attended ? 'Attened' : 'Not Yet Attended' });
  }

  render() {
    const intl = this.props.intl
    return (
      <div>
        <SectionHeader>
          <h2>{intl.formatMessage({ id: 'Refund' })}</h2>
          <p>{intl.formatMessage({ id: 'refundDescription' })}</p>
        </SectionHeader>
        <Container className='py-3'>
          {this.state.transaction && <p>{intl.formatMessage({ id: 'Transaction' })}: {this.state.transaction}</p>}
          {this.state.initialized && <p>{intl.formatMessage({ id: 'Event Status' })}: <strong>{this.renderAttended()}</strong></p>}
          <div>
            <Form className="w-50">
              <Input value={this.state.secret} onChange={this.onInputChange} />
              <Button disabled={!this.state.attended || !this.state.hadTicket || this.state.transaction || !this.state.wallet} className="mt-3" color="primary" onClick={this.onRefund}>
                {intl.formatMessage({ id: 'Refund' })}
              </Button>
            </Form>
            <div className="my-3">
              {this.state.initialized && this.renderAlert()}
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default injectIntl(Refund);
