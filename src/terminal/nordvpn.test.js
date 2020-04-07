'use strict';
import userStatus from '../enum/user.status';
import connectionStatus from '../enum/connection.status';
import NordVpn from './nordvpn';
import Wrapper from './dummy.nord.vpn';
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

      expect(status).to.equal(connectionStatus.DISCONNECTED);
    });
  });

  describe('user status', function() {
    it('logged in', async function() {
      await wrapper.execute(`login -u ${username} -p ${password}`);

      const status = await nordvpn.getUserStatus();

      expect(status).to.equal(userStatus.LOGGEDIN);
    });

    it('logged out', async function() {
      const status = await nordvpn.getUserStatus();

      expect(status).to.equal(userStatus.LOGGEDOUT);
    });
  });

  describe('login', function() {
    it('can login', async function() {
      expect(await nordvpn.getUserStatus()).to.equal(userStatus.LOGGEDOUT);

      const result = await nordvpn.login({ username, password });

      expect(result).to.be.true;
      expect(await nordvpn.getUserStatus()).to.equal(userStatus.LOGGEDIN);
    });

    it('cannot login with incorrect credentials', async function() {
      expect(await nordvpn.getUserStatus()).to.equal(userStatus.LOGGEDOUT);

      const result = await nordvpn.login({ username: 'not_username', password: password + password });

      expect(result).to.be.false;
      expect(await nordvpn.getUserStatus()).to.equal(userStatus.LOGGEDOUT);
    });
  });

  describe('connect', function() {
    it('can connect without city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect();

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(connectionStatus.CONNECTED);
    });

    it('can connect with city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('New_York_City');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(connectionStatus.CONNECTED);
    });

    it('can connect with country code', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('US');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(connectionStatus.CONNECTED);
    });

    it('cannot connect with incorrect city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('Not_A_City');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.false;
      expect(status).to.equal(connectionStatus.DISCONNECTED);
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
});
