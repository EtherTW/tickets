import Eth from 'ethjs'
import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { Table, Button, ButtonGroup  } from 'reactstrap';

import {
  ETHERSCAN_URL
} from '../constants';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccess: () => false
  }
};

class Admin extends Component {
  constructor (props) {
    super(props);

    this.state = {
      signedIn: false,
      users: {}
    };
  }

  componentDidMount () {
    firebase.auth()
      .onAuthStateChanged((user) => {
        const signedIn = !!user;
        this.setState({signedIn});

        if (signedIn) {
          firebase.database().ref('users').on('value', (snapshot) => {
            const users = snapshot.val() || {};
            Object.keys(users).forEach(uid => {
              if (this.state.users[uid]) {
                users[uid].transactionSuccess = this.state.users[uid].transactionSuccess;
              }
            });
            this.setState({ users });
          });
        }
      });
  }

  onAttendClick = (uid, attended) => {
    const user = this.state.users[uid];
    const updated = {};
    user.attended = attended;
    updated[`/users/${uid}`] = user;
    firebase.database().ref().update(updated);
  }

  updateTransaction = () => {
    if (window.web3) {
      const eth = new Eth(window.web3.currentProvider)

      Object.keys(this.state.users).forEach(async(uid) => {
        const users = { ...this.state.users };
        const user = users[uid];
        const result = await eth.getTransactionReceipt(user.transaction);
        if (result) {
          user.transactionSuccess = result.status;
          users[uid] = {...user};
          this.setState({users});
        }
      })
    }
  }

  renderUsersTable () {
    const users = [];
    Object.keys(this.state.users).forEach(uid => {
      const user = this.state.users[uid];
      user.uid = uid;
      users.push(user);
    });

    const rows = users.map((user, i) => {
      const walletUrl = `${ETHERSCAN_URL}/address/${user.wallet}`;
      const transactionUrl = `${ETHERSCAN_URL}/tx/${user.transaction}`;
      const attended = user.attended ? '✓' : '';
      const transactionSuccess = user.transactionSuccess === '0x1' ? '✓': '';
      return (
        <tr key={`${user.wallet}-${i}`}>
          <td className="text-center">{attended}</td>
          <td className="text-center">{transactionSuccess}</td>
          <td><a href={walletUrl} target="_blank" rel="noopener noreferrer">{user.wallet.substr(0, 10)}...</a></td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td><a href={transactionUrl} target="_blank" rel="noopener noreferrer">{user.transaction.substr(0, 10)}...</a></td>
          <td>
            <ButtonGroup>
              <Button color="primary" onClick={() => this.onAttendClick(user.uid, true)}>出席</Button>
              <Button color="warning" onClick={() => this.onAttendClick(user.uid, false)}>未出席</Button>
            </ButtonGroup>
          </td>
        </tr>
      );
    });

    return (
      <Table>
        <thead>
          <tr>
            <th>出席狀況</th>
            <th>交易</th>
            <th>錢包地址</th>
            <th>名字</th>
            <th>電子郵件</th>
            <th>交易</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    )
  }

  render () {

    if (!this.state.signedIn) {
      return (
        <div>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    } else {
      return (
        <div className="container">
          <div>
            <Button color="primary" onClick={this.updateTransaction}>Get Transactions</Button>
          </div>
          {this.renderUsersTable()}
          <div className="my-3 text-center">
            <Button color="primary" onClick={() => firebase.auth().signOut()}>登出</Button>
          </div>
        </div>
      );
    }
  }
}

export default Admin;
