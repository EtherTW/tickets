import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import { injectIntl, FormattedMessage } from 'react-intl'

import {
  ETHERSCAN_URL,
  FEE,
  NETWORK_NAME
} from '../constants';

class AlertHelper extends Component {
  render () {
    const intl = this.props.intl
    const url = `${ETHERSCAN_URL}/tx/${this.props.transaction}`;
    switch (this.props.state) {
      case 'transaction-sent':
        return (
          <Alert color="success">
            <FormattedMessage
              id='Alert Transaction Sent'
              values={{
                link: <a href={url} target="_blank" rel="noopener noreferrer">Etherscan</a>
              }}
            />
          </Alert>
        );

      case 'refund-transaction-sent':
        return (
          <Alert color="success">
            <FormattedMessage
              id='Alert Refund Transaction Sent'
              values={{
                link: <a href={url} target="_blank" rel="noopener noreferrer">Etherscan</a>
              }}
            />
          </Alert>
        );
      case 'no-web3':
        return (
          <Alert color="danger">
            <FormattedMessage
              id='Alert Without MetaMask'
              values={{
                link: <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a>,
                fee: FEE
              }}
            />
          </Alert>
        );

      case 'no-wallet':
        return (
          <Alert color="danger">
            {intl.formatMessage({ id: 'Alert No Wallet' })}
          </Alert>
        );


      case 'had-ticket':
        return (
          <Alert color="warning">
            {intl.formatMessage({ id: 'Alert Had Ticket' })}
          </Alert>
        );

      case 'no-refund':
        return (
          <Alert color="warning">
            {intl.formatMessage({ id: 'Alert No Refund' })}
          </Alert>
        );
      case 'no-attend':
        return (
          <Alert color="warning">
            {intl.formatMessage({ id: 'Alert No Attend' })}
          </Alert>
        )
      case 'invalid-network':
        return (
          <Alert color="danger">
            {intl.formatMessage({id: 'Alert Invalid Network'},{ networkName: NETWORK_NAME})}
          </Alert>
        )

      case 'registration-ended':
        return (
          <Alert color="info">
            {intl.formatMessage({ id: 'Registration Ended'})}
          </Alert>
        )
      case 'not-yet-begun':
        return (
          <Alert color="info">
            {intl.formatMessage({ id: 'Not Yet Begun' }, {startTime: this.props.startTime})}
          </Alert>
        )
      default:
        return null;
    }
  }
}

export default injectIntl(AlertHelper);
