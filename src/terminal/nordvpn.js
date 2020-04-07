'use strict';
import countriesList from 'countries-list';
import userStatuses from '../enum/user.status';

module.exports = class {
  constructor({ wrapper }) {
    this.wrapper = wrapper;
    const nordCityMap = {
      Belgrad: 'Belgrade',
      Frankfurt: 'Frankfurt am Main',
      Kiev: 'Kyiv',
      Mexico: 'Mexico City',
      Montreal: 'Montréal',
      'New York': 'New York City',
      Reykjavik: 'Reykjavík',
      'San Jose': 'San José',
      'San Paulo': 'São Paulo',
      Zurich: 'Zürich'
    };
    const spaceToDashes = source => source.split(' ').join('_');
    this._nordCityMap = Object.keys(nordCityMap)
      .reduce((a, c) => ({ ...a, [spaceToDashes(c)]: spaceToDashes(nordCityMap[c]) }), {});
    this._geonameCityMap = Object.keys(this._nordCityMap)
      .reduce((a, c) => ({ ...a, [this._nordCityMap[c]]: c }), {});
    this._getCode = this._getCode.bind(this);
  }

  async login({ username, password }) {
    const terminalResponse = await this.wrapper.execute(`login -u ${username} -p ${password}`);
    return terminalResponse.includes('Welcome');
  }

  async _getCountriesRaw() {
    const terminalResponse = await this.wrapper.execute('countries');
    const terminalLines = terminalResponse.split('\n');
    return terminalLines[terminalLines.length - 1]
      .split(' ')
      .map(it => it.split(' '))
      .reduce((a, c) => a.concat(c))
      .map(it => it.replace(',', ''))
      .map(it => it.trim())
      .filter(it => it);
  }

  _getCode(name) {
    if (name.includes('_')) {
      return this._getCode(name.split('_').join(' '));
    }
    const candidates = Object.keys(countriesList.countries)
      .filter(it => countriesList.countries[it].name.toLowerCase() === name.toLowerCase());
    if (candidates.length === 1) {
      return candidates[0];
    }
    throw new Error({
      message: `I do not recognize the country '${name}'`,
      name
    });
  }

  _nordCityToGeoname(nordCity) {
    return this._nordCityMap[nordCity] || nordCity;
  }

  async connect(location) {
    const userStatus = await this.getUserStatus();
    if (userStatus !== userStatuses.LOGGEDIN) {
      throw new Error('Not logged in, cannot connect');
    }

    const nordLocation = this._geonameCityMap[location] || location || '';
    const result = await this.wrapper.execute(`connect ${nordLocation}`);
    return result.includes('are connected');
  }

  async getCities(country) {
    const rawCountryCandidates = (await this._getCountriesRaw())
      .filter(it => this._getCode(it) === country);
    if (rawCountryCandidates.length !== 1) {
      throw new Error({
        message: `Don't recognize country '${country}'`,
        country
      });
    }
    const rawCountry = rawCountryCandidates[0];
    const terminalResponse = await this.wrapper.execute(`cities ${rawCountry}`);
    const terminalLines = terminalResponse.split('\n');
    return terminalLines[terminalLines.length - 1]
      .split(' ')
      .map(it => it.split(' '))
      .reduce((a, c) => a.concat(c))
      .map(it => it.replace(',', ''))
      .map(it => this._nordCityToGeoname(it))
      .map(it => it.trim())
      .filter(it => it);
  }

  async getCountries() {
    return (await this._getCountriesRaw()).map(this._getCode);
  }

  async getConnectionStatus() {
    const terminalResponse = await this.wrapper.execute('status');
    const candidateStatusLines = terminalResponse
      .split('\n')
      .filter(it => it.startsWith('Status:'));
    if (candidateStatusLines.length !== 1) {
      throw new Error({
        message: 'Could not determine status from response ' + terminalResponse,
        terminalResponse
      });
    }
    const statusLine = candidateStatusLines[0];
    switch (statusLine.substring('Status:'.length).trim().toLowerCase()) {
      case 'disconnected':
        return module.exports.status.connection.DISCONNECTED;
      case 'connected':
        return module.exports.status.connection.CONNECTED;
      default:
        throw new Error({
          message: 'Could not determine status from status line ' + statusLine,
          statusLine
        });
    }
  }

  async getUserStatus() {
    const terminalResponse = await this.wrapper.execute('login -u poo -p wee');
    if (terminalResponse.includes('already logged in')) {
      return userStatuses.LOGGEDIN;
    }
    if (terminalResponse.includes('try again')) {
      return userStatuses.LOGGEDOUT;
    }
    throw new Error({
      message: 'Don\'t understand: ' + terminalResponse,
      terminalResponse
    });
  }
};

module.exports.status = {
  connection: {
    DISCONNECTED: 1,
    CONNECTED: 2
  }
};
