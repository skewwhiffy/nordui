const Terminal = require('./terminal');
const countriesList = require('countries-list');

module.exports = class {
  constructor({ executable }) {
    this.executable = executable;
    this.terminal = new Terminal();
  }

  async login({ username, password }) {
    const terminalResponse = await this.terminal.execute(`${this.executable} login -u ${username} -p ${password}`);
    return terminalResponse.includes('Welcome');
  }

  async getCountries() {
    const getCode = name => {
      if (name.includes('_')) {
        return getCode(name.replace('_', ' '));
      }
      const candidates = Object.keys(countriesList.countries)
        .filter(it => countriesList.countries[it].name.toLowerCase() === name.toLowerCase());
      if (candidates.length === 1) {
        return candidates[0];
      }
      throw {
        message: `I do not recognize the country '${name}'`,
        name
      }
    }
    const terminalResponse = await this.terminal.execute(`${this.executable} countries`);
    return terminalResponse
      .split('\n')
      .map(it => it.split(' '))
      .reduce((a, c) => a.concat(c))
      .filter(it => it)
      .map(it => getCode(it));;
    /*
% nordvpn cities United_States
A new version of NordVPN is available! Please update the application.
Atlanta         Chicago         Los_Angeles     New_York        Salt_Lake_City
Buffalo         Dallas          Manassas        Phoenix         San_Francisco
Charlotte       Denver          Miami           Saint_Louis     Seattle
(14:32:42) Linux:kenny-linux:nvim (c-q) [git::master|✚3]  (⎈ |BINARY-N/A:N/A)
~/code/personal/nordui/terminal
% nordvpn countries
A new version of NordVPN is available! Please update the application.
Albania                 Estonia                 Latvia                  Slovenia
Argentina               Finland                 Luxembourg              South_Africa
Australia               France                  Malaysia                South_Korea
Austria                 Georgia                 Mexico                  Spain
Belgium                 Germany                 Moldova                 Sweden
Bosnia_And_Herzegovina  Greece                  Netherlands             Switzerland
Brazil                  Hong_Kong               New_Zealand             Taiwan
Bulgaria                Hungary                 North_Macedonia         Thailand
Canada                  Iceland                 Norway                  Turkey
Chile                   India                   Poland                  Ukraine
Costa_Rica              Indonesia               Portugal                United_Kingdom
Croatia                 Ireland                 Romania                 United_States
Cyprus                  Israel                  Serbia                  Vietnam
Czech_Republic          Italy                   Singapore
Denmark                 Japan                   Slovakia
    */
  }

  async getConnectionStatus() {
    const terminalResponse = await this.terminal.execute(this.executable, 'status');
    const candidateStatusLines = terminalResponse
      .split('\n')
      .filter(it => it.startsWith('Status:'));
    if (candidateStatusLines.length != 1) {
      throw {
        message: 'Could not determine status from response ' + terminalResponse,
        terminalResponse
      }
    }
    const statusLine = candidateStatusLines[0];
    switch (statusLine.substring('Status:'.length).trim().toLowerCase()) {
      case 'disconnected':
        return module.exports.status.connection.DISCONNECTED;
      case 'connected':
        return module.exports.status.connection.CONNECTED;
      default:
        throw {
          message: 'Could not determine status from status line ' + statusLine,
          statusLine
        }
    }
  }

  async getUserStatus() {
    const terminalResponse = await this.terminal.execute(`${this.executable} login -u poo -p wee`);
    if (terminalResponse.includes('already logged in')) {
      return module.exports.status.user.LOGGEDIN;
    }
    if (terminalResponse.includes('try again')) {
      return module.exports.status.user.LOGGEDOUT;
    }
    throw {
      message: 'Don\'t understand: ' + terminalResponse,
      terminalResponse
    };
  }
}

module.exports.status = {
  connection: {
    DISCONNECTED: 1,
    CONNECTED: 2
  },
  user: {
    LOGGEDOUT: 1,
    LOGGEDIN: 2
  }
};
