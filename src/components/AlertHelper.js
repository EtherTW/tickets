import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import { injectIntl } from 'react-intl'

import {
  ETHERSCAN_URL,
  DEPOSIT
} from '../constants';

class AlertHelper extends Component {
  render () {
    const intl = this.props.intl
    const url = `${ETHERSCAN_URL}/tx/${this.props.transaction}`;
    switch (this.props.state) {
      case 'transaction-sent':
        return (
          <Alert color="success">
            {intl.locale === 'en-US' && (<div>Your transaction has been sent. Please check the transaction status on <a href={url} target="_blank" rel="noopener noreferrer">Etherscan</a>.</div>)}
            {intl.locale === 'zh-Hans-CN' && (<div>你的交易已經發送，請到 <a href={url} target="_blank" rel="noopener noreferrer">Etherscan</a> 查詢交易是否成功。</div>)}
          </Alert>
        );

      case 'no-web3':
        return (
          <Alert color="danger">
            {intl.locale === 'en-US' && (<div>You have not yet installed MetaMask. Please go to install <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">MetaMask</a> and have at least {DEPOSIT + 0.001} ETH for the deposit and transaction fee.</div>)}
            {intl.locale === 'zh-Hans-CN' && (<div>您還沒有安裝 MetaMask，請先到 <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">官方網站</a> 安裝並且儲值至少約 {DEPOSIT + 0.001} ETH （押金與給礦工的交易費）。</div>)}
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

      default:
        return null;
    }
  }
}

export default injectIntl(AlertHelper);
