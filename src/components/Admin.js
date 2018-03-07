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
            this.setState({ users });
          });
        }
      });
  }

  onAttendClick = (wallet, attended) => {
    const user = this.state.users[wallet];
    const updated = {};
    user.attended = attended;
    updated[`/users/${wallet}`] = user;
    firebase.database().ref().update(updated);
  }

  renderUsersTable () {
    const users = [];
    Object.keys(this.state.users).forEach(walletAddress => {
      const user = this.state.users[walletAddress];
      users.push({
        wallet: walletAddress,
        ...user
      });
    });

    const rows = users.map(user => {
      const walletUrl = `${ETHERSCAN_URL}/address/${user.wallet}`;
      const transactionUrl = `${ETHERSCAN_URL}/tx/${user.transaction}`;
      const attended = user.attended ? '✓' : '';
      return (
        <tr key={user.wallet}>
          <td className="text-center">{attended}</td>
          <td><a href={walletUrl} target="_blank" rel="noopener noreferrer">{user.wallet.substr(0, 10)}...</a></td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td><a href={transactionUrl} target="_blank" rel="noopener noreferrer">{user.transaction.substr(0, 10)}...</a></td>
          <td>
            <ButtonGroup>
              <Button color="primary" onClick={() => this.onAttendClick(user.wallet, true)}>出席</Button>
              <Button color="warning" onClick={() => this.onAttendClick(user.wallet, false)}>未出席</Button>
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
