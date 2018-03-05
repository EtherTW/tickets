import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Firebase from 'firebase';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


const firebaseConfig = {
  apiKey: "AIzaSyCIP2W4I3aA9AOuvXpUpQLzFBmwvo3lQy8",
  authDomain: "taipei-ethereum-meetup-ticket.firebaseapp.com",
  databaseURL: "https://taipei-ethereum-meetup-ticket.firebaseio.com",
  projectId: "taipei-ethereum-meetup-ticket",
  storageBucket: "taipei-ethereum-meetup-ticket.appspot.com",
  messagingSenderId: "515416889778"
};

Firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
