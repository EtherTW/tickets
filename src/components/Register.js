import Eth from 'ethjs'
import firebase from 'firebase'
import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { injectIntl } from 'react-intl'
import { Container, Row, Col } from 'reactstrap'
import SectionHeader from './SectionHeader'

import AlertHelper from './AlertHelper'
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  GAS_PRICE,
  GAS_LIMIT,
  FEE,
  NETWORK_ID,
  INTERVAL_TIME,
} from '../constants'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wallet: null,
      transaction: null,
      hadTicket: false,
      web3: null,
      name: null,
      email: null,
      initialized: false,
      validNetwork: false,
      registrationAmount: 0,
      maxAttendee: 0
    }
  }

  componentDidMount() {
    this.checkWeb3IntervalId = setInterval(async () => {
      const newState = {}
      try {
        const web3 = window.web3
        newState.web3 = web3
        if (web3) {
          const networkId = web3.version.network
          newState.validNetwork = (networkId === NETWORK_ID)
          const eth = new Eth(window.web3.currentProvider)
          const accounts = await eth.accounts()
          const wallet = accounts[0]
          newState.wallet = wallet
          if (wallet) {
            const Ticket = eth.contract(CONTRACT_ABI)
            const ticket = Ticket.at(CONTRACT_ADDRESS)
            const userIdResult = await ticket.userId(wallet)
            const userAmountResult = await ticket.userAmount()
            const maxAttendeeResult = await ticket.maxAttendees()
            const hadTicket = userIdResult[0] > 0
            newState.hadTicket = hadTicket
            newState.registrationAmount = userAmountResult[0].toNumber()
            newState.maxAttendee = maxAttendeeResult[0].toNumber()
          } else {
            newState.hadTicket = false
          }
        }
        newState.initialized = true
        this.checkWeb3IntervalId && this.setState({ ...this.state, ...newState })
      } catch (error) {
        newState.web3 = false
        newState.initialized = true
        this.checkWeb3IntervalId && this.setState({ ...this.state, ...newState })
      }
    }, INTERVAL_TIME)
  }

  componentWillUnmount() {
    clearInterval(this.checkWeb3IntervalId)
    this.checkWeb3IntervalId = null
  }

  registrationEnd () {
    return this.state.registrationAmount >= this.state.maxAttendee;
  }

  onSend = async () => {
    const {name, email, wallet} = this.state;
    if (!name || !email) {
      // Add error message
      return
    }
    try {
      const eth = new Eth(window.web3.currentProvider)
      const transaction = await eth.sendTransaction({
        from: this.state.wallet,
        to: CONTRACT_ADDRESS,
        value: Eth.toWei(FEE, 'ether'),
        gas: GAS_LIMIT,
        gasPrice: GAS_PRICE,
        data: '0x'
      })
      const userRef = firebase.database().ref('users').push();
      await userRef.set({
        name,
        email,
        transaction,
        wallet
      })
      this.setState({ transaction })
    } catch (error) {
      console.log('error', error)
    }
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value })
  }

  renderAlert = () => {
    if (!this.state.web3) {
      return (<AlertHelper state='no-web3' />)
    }
    if (!this.state.validNetwork) {
      return (<AlertHelper state='invalid-network' />)
    }
    if (!this.state.wallet) {
      return (<AlertHelper state='no-wallet' />)
    }
    if (this.state.transaction) {
      return (<AlertHelper transaction={this.state.transaction} state='transaction-sent' />)
    }
    if (this.state.hadTicket) {
      return (<AlertHelper state='had-ticket' />)
    }
    if (this.registrationEnd()) {
      return (<AlertHelper state='registration-ended' />);
    }
  }

  render() {
    const intl = this.props.intl
    return (
      <div>
        <SectionHeader>
          <h2>
            {intl.formatMessage({ id: 'Register' })}
          </h2>
          <p>
            {intl.formatMessage({ id: 'registerDescription' }, { fee: FEE })}
          </p>
        </SectionHeader>
        <Container className='py-3'>
          <Row>
            <Col sm='12' md={{ size: 8, offset: 2 }}>
              <Form>
                <FormGroup>
                  <Label for='name'>{intl.formatMessage({ id: 'Name / Nickname' })}</Label>
                  <Input type='text' name='name' id='name' value={this.state.name || ''} onChange={this.onNameChange} />
                </FormGroup>
                <FormGroup>
                  <Label for='email'>{intl.formatMessage({ id: 'Email' })}</Label>
                  <Input type='email' name='email' id='email' value={this.state.email || ''} onChange={this.onEmailChange} />
                </FormGroup>
                {
                  this.state.wallet && (
                    <FormGroup>
                      <Label for='wallet'>{intl.formatMessage({ id: 'Wallet Address' })}</Label>
                      <Input plaintext name='wallet' id='wallet'>{this.state.wallet}</Input>
                    </FormGroup>
                  )
                }
                {
                  this.state.initialized && (
                    <FormGroup>
                      <Label for="registration-amount">{intl.formatMessage({ id: 'Registration Amount' })}</Label>
                      <Input plaintext name="registration-amount">{this.state.registrationAmount} / {this.state.maxAttendee}</Input>
                    </FormGroup>
                  )
                }
              </Form>
              <Button disabled={this.registrationEnd() || this.state.hadTicket || !this.state.wallet || this.state.transaction || !this.state.validNetwork} color='primary' onClick={this.onSend}>
                {intl.formatMessage({ id: 'Register With MetaMask' })}
              </Button>
              <div className='my-3'>
                {this.state.initialized && this.renderAlert()}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default injectIntl(Register)
