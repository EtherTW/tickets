import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Table, Button } from 'reactstrap';
import { injectIntl } from 'react-intl'
import { Container } from 'reactstrap';
import moment from 'moment';
import 'moment/locale/zh-tw';

import SectionHeader from './SectionHeader';
import Logo from './assets/logo.png';
import { FEE, REGISTRATION_TIME } from '../constants';

const MOMENT_LANG = localStorage.getItem('lang') === 'en' ? 'en' : 'zh-tw';
moment.locale(MOMENT_LANG);

class Home extends Component {
  render () {
    const registrationTime = moment(REGISTRATION_TIME).format('llll');
    const intl = this.props.intl
    return (
      <div>
        <SectionHeader>
          <img
            className="align-middle d-inline-block"
            src={Logo}
            width="100"
            alt="Taipei Ethereum Meetup Logo"
            style={{
              marginBottom: '24px',
            }}
          />
          <h2>{intl.formatMessage({ id: 'eventTitle' })}</h2>
          <p>{intl.formatMessage({ id: 'eventDescription' })}</p>
          <Button tag={Link} to="/register" color="primary" size="lg">{intl.formatMessage({ id: 'Register' })}</Button>
        </SectionHeader>
        <Container className='py-3'>
          <p>{intl.formatMessage({ id: 'eventPayment' })}</p>
          <ul className="event-details">
            <li>
              <strong>{intl.formatMessage({ id: 'eventDateLabel' })}</strong>:&nbsp;
                {intl.formatMessage({ id: 'eventDate' })}
            </li>
            <li>
              <strong>{intl.formatMessage({ id: 'LocationLabel' })}</strong>:&nbsp;
                <a
                target="_blank" rel="noopener noreferrer"
                href={intl.formatMessage({ id: 'Location Google Maps' })}>
                {intl.formatMessage({ id: 'LocationAddress' })}
              </a>
            </li>
            <li>
              <strong>{intl.formatMessage({ id: 'eventRegistrationFeeLabel' }, { fee: FEE })}</strong>:&nbsp;
                {intl.formatMessage({ id: 'eventRegistrationFee' }, { fee: FEE })}
            </li>
            <li>
              <strong>{intl.formatMessage({ id: 'eventRegistrationDate' })}</strong>:&nbsp;
                {registrationTime} ({intl.formatMessage({id: 'noon'})})
            </li>
            <li>
              <strong>{intl.formatMessage({ id: 'live stream' })}</strong>:&nbsp;
              <a
              target="_blank" rel="noopener noreferrer"
              href="https://youtu.be/ilsjZAtUUvQ">
                https://youtu.be/ilsjZAtUUvQ
              </a>
            </li>
          </ul>
          <h3>{intl.formatMessage({ id: 'Agenda'})}</h3>
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
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>19:30 - 20:10</td>
                <td>Panel 1: Sharding Clients</td>
                <td>TBD</td>
                <td><a href="https://twitter.com/karl_dot_tech" target="_blank" rel="noopener noreferrer">Karl Floersch</a></td>
              </tr>
              <tr>
                <td>20:10 - 20:25</td>
                <td>Break</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>20:25 - 21:05</td>
                <td>Panel 2: Ethereum Research Work</td>
                <td>
                  <ul>
                    <li>Vitalik Buterin (Ethereum Foundation, co-founder)</li>
                    <li>Vlad Zamfir (Ethereum Foundation, Casper CBC Lead)</li>
                    <li>Justin Drake (Ethereum Foundation, Sharding Researcher)</li>
                    <li>Philip Daian (IC3, Hydra Project 	&amp; hackthiscontract.io Lead)</li>
                  </ul>
                </td>
                <td><a href="https://twitter.com/karl_dot_tech" target="_blank" rel="noopener noreferrer">Karl Floersch</a></td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default injectIntl(Home);
