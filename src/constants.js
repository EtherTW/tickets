import Eth from 'ethjs';

export const CONTRACT_ADDRESS = '0xd182db77ac90d77646b895be09e59690e4fa68e1';
export const CONTRACT_ABI = JSON.parse('[{ "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "ticket", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "puzzle", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_attendees", "type": "address" }], "name": "getTicket", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }], "name": "transferOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_secret", "type": "bytes" }], "name": "calculatePuzzle", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "DEPOSIT", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_secret", "type": "bytes" }], "name": "getRefund", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_puzzle", "type": "bytes32" }], "name": "setPuzzle", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }]');
export const GAS_PRICE = Eth.toWei(21, 'Gwei');
export const GAS_LIMIT = 70000;
export const DEPOSIT = 0.001;
export const PRODUCTION = false;

export const ETHERSCAN_URL = PRODUCTION ?
  'https://etherscan.io/tx' :
  'https://ropsten.etherscan.io/tx';
