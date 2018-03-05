import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { Table, Button } from 'reactstrap';

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
          (async() => {
            const snapshot = await firebase.database().ref('users').once('value');
            const users = snapshot.val();
            this.setState({users});
          })();
        }
      });
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
      return (
        <tr key={user.wallet}>
          <td><a href={walletUrl} target="_blank" rel="noopener noreferrer">{user.wallet.substr(0, 6)}...</a></td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td><a href={transactionUrl} target="_blank" rel="noopener noreferrer">{user.transaction.substr(0, 6)}...</a></td>
        </tr>
      );
    });

    return (
      <Table>
        <thead>
          <tr>
            <th>錢包地址</th>
            <th>名字</th>
            <th>電子郵件</th>
            <th>交易</th>
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
        <div>
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
