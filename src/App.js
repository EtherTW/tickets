import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from 'reactstrap';
import { addLocaleData, IntlProvider } from 'react-intl'
import enUS from './locales/en-US'
import zhHANT from './locales/zh-Hant'

import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import Refund from './components/Refund';

addLocaleData(zhHANT.data)
addLocaleData(enUS.data)

class App extends Component {

  constructor(props, context) {
    super(props, context)
  }

  getLocale =() => {
    const lang = localStorage.getItem('lang')
    switch (lang) {
      case 'zh':
        return zhHANT
      default:
        return enUS
    }
  }

  render() {
    const locale = this.getLocale()
    return (
      <IntlProvider locale={locale.locale} messages={locale.messages}>
        <Router basename="/tickets">
          <div className="App">
            <Header />
            <Container className="py-3">
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/refund" component={Refund} />
            </Container>
          </div>
        </Router>
      </IntlProvider>
    );
  }
}

export default App;
