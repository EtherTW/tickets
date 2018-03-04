import React, { Component } from 'react';
import { Alert } from 'reactstrap';

import {
  ETHERSCAN_URL,
  DEPOSIT
} from '../constants';

class AlertHelper extends Component {
  render () {
    const url = `${ETHERSCAN_URL}/${this.props.transaction}`;

    switch (this.props.state) {
      case 'transaction-sent':
        return (
          <Alert color="success">
            你的交易已經發送，請到 <a href={url} target="_blank">Etherscan</a> 查詢交易是否成功。
          </Alert>
        );

      case 'no-web3':
        return (
          <Alert color="danger">
            您還沒有安裝 MetaMask，請先到 <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">官方網站</a> 安裝並且儲值至少約 {DEPOSIT + 0.001} ETH （押金與給礦工的交易費）。
          </Alert>
        );

      case 'had-ticket':
        return (
          <Alert color="warning">
            本錢包位址已經報名，當天請出示寄給您的電子郵件即可。
          </Alert>
        );

        case 'no-refund':
          return (
            <Alert color="warning">
              本錢包位址沒有押金，請確認你是否已經領回押金或所使用的錢包是否與當初報名時相同。
            </Alert>
          );

      default:
        return null;
    }
  }
}

export default AlertHelper;
