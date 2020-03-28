#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const util = require('util');
const dummyNordVpn = require('./dummy.nord.vpn');

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const statusFile = path.join(__dirname, 'status.test.txt');

class Dummy {
  async exec(args) {
    this.dummyStatus = await this.getStatus();
    if (args.length === 0) {
      return await this.noargs();
    }
    if (args[0] === 'login') {
      await this.login(args);
      return await this.saveStatus();
    }
    if (args[0] === 'connect') {
      await this.connect(args);
      return await this.saveStatus();
    }
    if (args[0] === 'status') {
      return await this.status(args);
    }
    if (args[0] === 'countries') {
      return await this.countries(args);
    }
    console.log(`Command \'${args[0]}\' doesn\'t exist`);
  }

  async saveStatus() {
    await writeFile(statusFile, JSON.stringify(this.dummyStatus));
  }

  async getStatus() {
    if (!(await exists(statusFile))) {
      return {};
    }
    const statusJson = await readFile(statusFile, 'utf8');
    return JSON.parse(statusJson);
  }

  async countries() {
    console.log('Albania                 Estonia                 Latvia                  Slovenia');
    console.log('Argentina               Finland                 Luxembourg              South_Africa');
    console.log('Australia               France                  Malaysia                South_Korea');
    console.log('Austria                 Georgia                 Mexico                  Spain');
    console.log('Belgium                 Germany                 Moldova                 Sweden');
    console.log('Bosnia_And_Herzegovina  Greece                  Netherlands             Switzerland');
    console.log('Brazil                  Hong_Kong               New_Zealand             Taiwan');
    console.log('Bulgaria                Hungary                 North_Macedonia         Thailand');
    console.log('Canada                  Iceland                 Norway                  Turkey');
    console.log('Chile                   India                   Poland                  Ukraine');
    console.log('Costa_Rica              Indonesia               Portugal                United_Kingdom');
    console.log('Croatia                 Ireland                 Romania                 United_States');
    console.log('Cyprus                  Israel                  Serbia                  Vietnam');
    console.log('Czech_Republic          Italy                   Singapore');
    console.log('Denmark                 Japan                   Slovakia');
  }

  async connect() {
    if (!this.dummyStatus.loggedIn) {
      throw {
        message: 'TODO: Not logged in, not going to connect'
      };
    }
    this.dummyStatus.connected = true;
    console.log('Connecting to United Kingdom #1474 (uk1474.nordvpn.com)');
    console.log('You are connected to United Kingdom #1474 (uk1474.nordvpn.com)!');
  }

  async status() {
    if (this.dummyStatus.connected) {
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

  async login(args) {
    if (Array.isArray(args)) {
      if (args.length !== 5 || args[1] !== '-u' || args[3] !== '-p') {
        throw {
          message: 'Wrong args length: need -u <username> -p <password> ' + args
        };
      }
      return await this.login({
        username: args[2],
        password: args[4]
      });
    }
    const { username, password } = args;
    if (this.dummyStatus.loggedIn) {
      console.log('You are already logged in.');
      return;
    }
    if (username !== dummyNordVpn.username || password !== dummyNordVpn.password) {
      console.log('Username or password is not correct. Please try again.');
      return;
    }
    this.dummyStatus.loggedIn = true;
    console.log(this.dummyStatus);
    console.log('Welcome to NordVPN! You can now connect to VPN by using \'nordvpn connect\'')
  }

  async noargs() {
    console.log(`
Welcome to NordVPN Linux client app!
Version 3.7.0-2
Website: https://nordvpn.com

Usage: nordvpn [global options] command [command options] [arguments...]

Commands:
     account        Shows account information
     cities         Shows a list of cities where servers are available
     connect, c     Connects you to VPN
     countries      Shows a list of countries where servers are available
     disconnect, d  Disconnects you from VPN
     groups         Shows a list of available server groups
     login          Logs you in
     logout         Logs you out
     rate           Rate your last connection quality (1-5)
     register       Registers a new user account
     set, s         Sets a configuration option
     settings       Shows current settings
     status         Shows connection status
     whitelist      Adds or removes an option from a whitelist
     help, h        Shows a list of commands or help for one command

Global options:
   --help, -h     show help
   --version, -v  print the version

For more detailed information, please check manual page.

Our customer support works 24/7 so if you have any questions or issues, drop us a line at https://support.nordvpn.com/
`);
  }
}

const args = process.argv.slice(2);
(async function() {
  const dummy = new Dummy();
  await dummy.exec(args);
})();
