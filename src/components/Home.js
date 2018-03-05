import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Table, Button } from 'reactstrap';
import { injectIntl } from 'react-intl'

class Home extends Component {
  render () {
    const intl = this.props.intl
    return (
      <div>
        <div>
          <h2>{intl.formatMessage({ id: 'eventTitle' })}</h2>
          <p>{intl.formatMessage({ id: 'eventDescription' })}</p>
          <p>{intl.formatMessage({ id: 'eventPayment' })}</p>
          <h3>Agenda</h3>
          <p>{intl.formatMessage({ id: 'eventDate' })}</p>
          <Table>
            <thead>
              <tr>
                <th>{intl.formatMessage({ id: 'Time' })}</th>
                <th>{intl.formatMessage({ id: 'Topic' })}</th>
                <th>{intl.formatMessage({ id: 'Guests' })}</th>
                <th>{intl.formatMessage({ id: 'Host' })}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>19:00 - 19:30</td>
                <td>Networking</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>19:30 - 20:10</td>
                <td>Panel 1: Sharding Clients</td>
                <td>Peter, Piper, one from prasmatic lab, one from parity, one from status, one from consensys, (+Vitalik?)</td>
                <td><a href="https://twitter.com/karl_dot_tech" target="_blank" rel="noopener noreferrer">Karl Floersch</a></td>
              </tr>
              <tr>
                <td>20:10 - 20:25</td>
                <td>Break</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>20:25 - 21:05</td>
                <td>Panel 2: Ethereum Research Work</td>
                <td>Vitalik, Justin, Vlad, Phil, Joseph P (if he comes)</td>
                <td><a href="https://twitter.com/karl_dot_tech" target="_blank" rel="noopener noreferrer">Karl Floersch</a></td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="text-center">
          <Button tag={Link} to="/register" color="primary" size="lg">{intl.formatMessage({ id: 'Register' })}</Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(Home);
