'use strict';
import userStatuses from '../enum/user.status';
import connectionStatuses from '../enum/connection.status';
import NordVpn from './nordvpn';
import Terminal from './terminal';
import RealWrapper from './command.wrapper';
import Wrapper from './dummy.nord.vpn';
import DummyLogger from '../log/dummy.logger';
import { expect } from 'chai';

const { username, password } = Wrapper;

describe('NordVPN', function() {
  let wrapper;
  let nordvpn;

  beforeEach(async function() {
    wrapper = new Wrapper();
    nordvpn = new NordVpn({ wrapper });
  });

  describe('connection status', function() {
    it('disconnected', async function() {
      const status = await nordvpn.getConnectionStatus();

      expect(status).to.equal(connectionStatuses.DISCONNECTED);
    });
  });

  describe('user status', function() {
    it('logged in', async function() {
      await wrapper.execute(`login -u ${username} -p ${password}`);

      const status = await nordvpn.getUserStatus();

      expect(status).to.equal(userStatuses.LOGGEDIN);
    });

    it('logged out', async function() {
      const status = await nordvpn.getUserStatus();

      expect(status).to.equal(userStatuses.LOGGEDOUT);
    });
  });

  describe('login', function() {
    it('can login', async function() {
      expect(await nordvpn.getUserStatus()).to.equal(userStatuses.LOGGEDOUT);

      const result = await nordvpn.login({ username, password });

      expect(result).to.be.true;
      expect(await nordvpn.getUserStatus()).to.equal(userStatuses.LOGGEDIN);
    });

    it('cannot login with incorrect credentials', async function() {
      expect(await nordvpn.getUserStatus()).to.equal(userStatuses.LOGGEDOUT);

      const result = await nordvpn.login({ username: 'not_username', password: password + password });

      expect(result).to.be.false;
      expect(await nordvpn.getUserStatus()).to.equal(userStatuses.LOGGEDOUT);
    });
  });

  describe('connect', function() {
    it('can connect without city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect();

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(connectionStatuses.CONNECTED);
    });

    it('can connect with city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('New_York_City');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(connectionStatuses.CONNECTED);
    });

    it('can connect with country code', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('US');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(connectionStatuses.CONNECTED);
    });

    it('cannot connect with incorrect city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('Not_A_City');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.false;
      expect(status).to.equal(connectionStatuses.DISCONNECTED);
    });
  });

  describe('geography', function() {
    it('can get all countries', async function() {
      const countries = await nordvpn.getCountries();

      expect(countries).to.include('GB');
    });

    it('can get all cities', async function() {
      const countries = (await nordvpn.getCountries())
        .slice(0, 5); // Doing all of them takes a short time
      const returnedCities = await Promise.all(countries
        .map(async country => {
          return {
            cities: await nordvpn.getCities(country),
            country
          };
        })
      );

      returnedCities.forEach(({ country, cities }) => {
        expect(cities).not.to.be.empty;
        cities.forEach(city => {
          expect(city[0].toUpperCase()).to.equal(city[0]);
        });
      });
    });
  });

  it('returns UNKNOWN when not installed', async function() {
    const logger = new DummyLogger();
    const terminal = new Terminal({ logger });
    const command = 'not_a_real_command';
    const wrapper = new RealWrapper({ command, terminal });
    const nordvpn = new NordVpn({ wrapper });

    const connectionStatus = await nordvpn.getConnectionStatus();
    const userStatus = await nordvpn.getUserStatus();

    expect(connectionStatus).to.equal(connectionStatuses.UNKNOWN);
    expect(userStatus).to.equal(userStatuses.UNKNOWN);
  });
});
