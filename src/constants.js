import Eth from 'ethjs';

export const CONTRACT_ADDRESS = '0x5cf9d0b01e6a7a294ed1e7c1dddb2b1ea0cc4cf1';
export const CONTRACT_ABI = JSON.parse('[{ "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "userId", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_attendee", "type": "address" }], "name": "getTicket", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "userAmount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxAttendees", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TEMWallet", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "FEE", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "id2Addr", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_TEMWallet", "type": "address" }, { "name": "_maxAttendees", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }]');
export const GAS_PRICE = Eth.toWei(21, 'Gwei');
export const GAS_LIMIT = 100000;
export const FEE = 0.015;
export const INTERVAL_TIME = 1000;

// When you change it please make sure you also set production on firebase by
// firebase functions:config:set general.production="1"
export const PRODUCTION = false;

export const NETWORK_ID = PRODUCTION ? '1' : '3'; // 1 = mainnet, 3 = ropsten
export const ETHERSCAN_URL = PRODUCTION ?
  'https://etherscan.io' :
  'https://ropsten.etherscan.io';
