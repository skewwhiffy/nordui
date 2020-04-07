'use strict';
import countryList from 'countries-list';

const countryMap = {
  Albania: [ 'Tirana' ],
  Argentina: [ 'Buenos_Aires' ],
  Australia: [ 'Adelaide', 'Brisbane', 'Melbourne', 'Perth', 'Sydney' ],
  Austria: [ 'Vienna' ],
  Belgium: [ 'Brussels' ],
  Bosnia_And_Herzegovina: [ 'Sarajevo' ],
  Brazil: [ 'San_Paulo' ],
  Bulgaria: [ 'Sofia' ],
  Canada: [ 'Montreal', 'Toronto', 'Vancouver' ],
  Chile: [ 'Santiago' ],
  Costa_Rica: [ 'San_Jose' ],
  Croatia: [ 'Zagreb' ],
  Cyprus: [ 'Nicosia' ],
  Czech_Republic: [ 'Prague' ],
  Denmark: [ 'Copenhagen' ],
  Estonia: [ 'Tallinn' ],
  Finland: [ 'Helsinki' ],
  France: [ 'Paris' ],
  Georgia: [ 'Tbilisi' ],
  Germany: [ 'Berlin', 'Frankfurt' ],
  Greece: [ 'Athens' ],
  Hong_Kong: [ 'Hong_Kong' ],
  Hungary: [ 'Budapest' ],
  Iceland: [ 'Reykjavik' ],
  India: [ 'Chennai', 'Mumbai' ],
  Indonesia: [ 'Jakarta' ],
  Ireland: [ 'Dublin' ],
  Israel: [ 'Tel_Aviv' ],
  Italy: [ 'Milan' ],
  Japan: [ 'Tokyo' ],
  Latvia: [ 'Riga' ],
  Luxembourg: [ 'Steinsel' ],
  Malaysia: [ 'Kuala_Lumpur' ],
  Mexico: [ 'Mexico' ],
  Moldova: [ 'Chisinau' ],
  Netherlands: [ 'Amsterdam' ],
  New_Zealand: [ 'Auckland' ],
  North_Macedonia: [ 'Skopje' ],
  Norway: [ 'Oslo' ],
  Poland: [ 'Warsaw' ],
  Portugal: [ 'Lisbon' ],
  Romania: [ 'Bucharest' ],
  Serbia: [ 'Belgrad' ],
  Singapore: [ 'Singapore' ],
  Slovakia: [ 'Bratislava' ],
  Slovenia: [ 'Ljubljana' ],
  South_Africa: [ 'Johannesburg' ],
  South_Korea: [ 'Seoul' ],
  Spain: [ 'Madrid' ],
  Sweden: [ 'Stockholm' ],
  Switzerland: [ 'Zurich' ],
  Taiwan: [ 'Taipei' ],
  Thailand: [ 'Bangkok' ],
  Turkey: [ 'Istanbul' ],
  Ukraine: [ 'Kiev' ],
  United_Kingdom: [ 'London' ],
  United_States: [
    'Atlanta',
    'Buffalo',
    'Charlotte',
    'Chicago',
    'Dallas',
    'Denver',
    'Los_Angeles',
    'Manassas',
    'Miami',
    'New_York',
    'Phoenix',
    'Saint_Louis',
    'Salt_Lake_City',
    'San_Francisco',
    'Seattle'
  ],
  Vietnam: [ 'Hanoi' ]
};

export default class DummyNordVpn {
  async execute(args) {
    if (typeof args === 'string') {
      return await this.execute(args.split(' ').filter(it => it));
    }
    this.dummyStatus = await this.getStatus();
    if (!Array.isArray(args) || args.length === 0) {
      return await this.noargs();
    }
    if (args[0] === 'login') {
      const result = await this.login(args);
      await this.saveStatus();
      return result;
    }
    if (args[0] === 'connect') {
      const result = await this.connect(args);
      await this.saveStatus();
      return result;
    }
    if (args[0] === 'status') {
      return await this.status(args);
    }
    if (args[0] === 'countries') {
      return await this.countries(args);
    }
    if (args[0] === 'cities') {
      return await this.cities(args);
    }
    return `Command '${args[0]}' doesn't exist`;
  }

  async clear() {
    this.serviceStatus = null;
  }

  async saveStatus() {
    this.serviceStatus = this.dummyStatus;
  }

  async getStatus() {
    return this.serviceStatus || {};
  }

  async countries() {
    return Object.keys(countryMap).join(', ');
  }

  async cities(args) {
    if (args.length !== 2) {
      throw new Error({
        message: 'Need only a country name'
      });
    }
    return countryMap[args[1]].join(', ');
  }

  async connect(args) {
    if (!this.dummyStatus.loggedIn) {
      return 'TODO: Not logged in, not going to connect';
      // This is different behaviour to the actual client, that now prompts for username and password.
    }
    const location = args.length >= 2 ? args[1] : 'gb';
    const country = this._getCountry(location);
    if (country) {
      this.dummyStatus.connected = true;
      // The country codes and the Nord server prefixes don't fully match, but this is good enough for us.
      return [ `Connecting to ${country.name} #1474 (${country.code}1474.nordvpn.com)`,
        `You are connected to ${country.name} #1474 (${country.code}1474.nordvpn.com)!` ]
        .join('\n');
    }
    return `Whoops! We couldn't connect you to '${location}'. Please try again. If the problem persists, contact our customer support.`;
  }

  async status() {
    if (this.dummyStatus.connected) {
      return [ 'Status: Connected',
        'Current server: uk1474.nordvpn.com',
        'Country: United Kingdom',
        'City: London',
        'Your new IP: 194.35.233.27',
        'Current technology: OpenVPN',
        'Current protocol: UDP',
        'Transfer: 1.87 MiB received, 0.62 MiB sent',
        'Uptime: 2 minutes 14 seconds' ]
        .join('\n');
    }
    return 'Status: Disconnected';
  }

  async login(args) {
    if (Array.isArray(args)) {
      if (args.length !== 5 || args[1] !== '-u' || args[3] !== '-p') {
        throw new Error({
          message: 'Wrong args length: need -u <username> -p <password> ' + args
        });
      }
      return await this.login({
        username: args[2],
        password: args[4]
      });
    }
    const { username, password } = args;
    if (this.dummyStatus.loggedIn) {
      return 'You are already logged in.';
    }
    if (this.trimQuotes(username) !== DummyNordVpn.username || this.trimQuotes(password) !== DummyNordVpn.password) {
      return 'Username or password is not correct. Please try again.';
    }
    this.dummyStatus.loggedIn = true;
    return 'Welcome to NordVPN! You can now connect to VPN by using \'nordvpn connect\'';
  }

  trimQuotes(source) {
    if (source.startsWith('\'')) {
      return this.trimQuotes(source.substring(1));
    }
    if (source.endsWith('\'')) {
      return this.trimQuotes(source.substring(0, source.length - 1));
    }
    return source;
  }

  async noargs() {
    return `
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
`;
  }

  _getCountry(location) {
    const lowerCaseLocation = location.toLowerCase();
    const candidates = Object.keys(countryMap)
      .map(country => {
        const countryCodeCandidates = Object.keys(countryList.countries)
          .filter(it => countryList.countries[it].name.toLowerCase().split(' ').join('_') === country.toLowerCase());
        if (countryCodeCandidates.length !== 1) {
          throw new Error(`Do not recognize country '${country}'`);
        }
        const cities = countryMap[country].map(it => it.toLowerCase());
        const countryCode = countryCodeCandidates[0].toLowerCase();
        if ([ ...cities, country.toLowerCase(), countryCode ].includes(lowerCaseLocation)) {
          return Object.assign({ code: countryCode }, countryList.countries[countryCodeCandidates[0]]);
        }
        return false;
      })
      .filter(it => it);
    return candidates.length === 1 ? candidates[0] : false;
  }
};

DummyNordVpn.username = 'dummy.username';
DummyNordVpn.password = 'dummy.password';
