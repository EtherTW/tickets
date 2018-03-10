import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
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
        <Container>
          <Row>
            <Col sm='12' md={{ size: 8, offset: 2 }}>
              {this.props.children}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}