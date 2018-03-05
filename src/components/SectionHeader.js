import React, { Component } from 'react';
import { Container } from 'reactstrap';
import backgroundImage from './assets/background.png';

export default class SectionHeader extends Component {
  render() {
    return (
      <div
        className='section-header'
        style={{
          textAlign: 'center',
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          minHeight: '200px',
          padding: '100px 0 100px 0',
          marginBottom: '24px',
        }}
      >
        <Container className='py-3'>
          {this.props.children}
        </Container>
      </div>
    )
  }
}