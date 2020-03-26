#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const dummyNordVpn = require('./dummy.nord.vpn');

const statusFile = path.join(__dirname, 'status.test.txt');
const args = process.argv.slice(2);
const dummyStatus = getStatus();

if (args.length === 0) {
  throw {
    message: 'No arguments'
  };
}

if (args[0] === 'login') {
  login(args);
  saveStatus();
  process.exit();
}

if (args[0] === 'connect') {
  connect(args);
  saveStatus();
  process.exit();
}

if (args[0] === 'status') {
  status(args);
  process.exit();
}

throw {
  message: 'TODO: not implemented'
}
process.exit(1);

function getStatus() {
  if (!fs.existsSync(statusFile)) {
    return {};
  }
  const statusJson = fs.readFileSync(statusFile, 'utf8');
  return JSON.parse(statusJson);
}

function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(dummyStatus));
}

function connect() {
  if (!dummyStatus.loggedIn) {
    throw {
      message: 'TODO: Not logged in, not going to connect'
    };
  }
  dummyStatus.connected = true;
  console.log('Connecting to United Kingdom #1474 (uk1474.nordvpn.com)');
  console.log('You are connected to United Kingdom #1474 (uk1474.nordvpn.com)!');
}

function login(args) {
  if (Array.isArray(args)) {
    if (args.length !== 5 || args[1] !== '-u' || args[3] !== '-p') {
      throw {
        message: 'Wrong args length: need -u <username> -p <password> ' + args
      };
    }
    return login({
      username: args[2],
      password: args[4]
    });
  }
  const { username, password } = args;
  if (dummyStatus.loggedIn) {
    console.log('You are already logged in.');
    return;
  }
  if (username !== dummyNordVpn.username || password !== dummyNordVpn.password) {
    console.log('Username or password is not correct. Please try again.');
    return;
  }
  dummyStatus.loggedIn = true;
  console.log('Welcome to NordVPN! You can now connect to VPN by using \'nordvpn connect\'')
}

function status() {
  if (dummyStatus.connected) {
    console.log('Status: Connected');
    console.log('Current server: uk1474.nordvpn.com');
    console.log('Country: United Kingdom');
    console.log('City: London');
    console.log('Your new IP: 194.35.233.27');
    console.log('Current technology: OpenVPN');
    console.log('Current protocol: UDP');
    console.log('Transfer: 1.87 MiB received, 0.62 MiB sent');
    console.log('Uptime: 2 minutes 14 seconds');
    return;
  }
  console.log('Status: Disconnected')
}
