'use strict';
import { expect } from 'chai';

describe('dummym', function() {
  it('works', function() {
    expect(1).to.equal(1);
  });
  /*
  let terminal;
  let nordvpn;

  beforeEach(async function() {
    await dummyNordVpn.clear();
    terminal = new Terminal();
    const config = { executable: command };
    nordvpn = new NordVpn(config);
  });

  describe('connection status', function() {
    it('disconnected', async function() {
      const status = await nordvpn.getConnectionStatus();

      expect(status).to.equal(NordVpn.status.connection.DISCONNECTED);
    });
  });

  describe('user status', function() {
    it('logged in', async function() {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);

      const status = await nordvpn.getUserStatus();

      expect(status).to.equal(NordVpn.status.user.LOGGEDIN);
    });

    it('logged out', async function() {
      const status = await nordvpn.getUserStatus();

      expect(status).to.equal(NordVpn.status.user.LOGGEDOUT);
    });
  });

  describe('login', function() {
    it('can login', async function() {
      expect(await nordvpn.getUserStatus()).to.equal(NordVpn.status.user.LOGGEDOUT);

      const result = await nordvpn.login({ username, password });

      expect(result).to.be.true;
      expect(await nordvpn.getUserStatus()).to.equal(NordVpn.status.user.LOGGEDIN);
    });

    it('cannot login with incorrect credentials', async function() {
      expect(await nordvpn.getUserStatus()).to.equal(NordVpn.status.user.LOGGEDOUT);

      const result = await nordvpn.login({ username: 'not_username', password: password + password });

      expect(result).to.be.false;
      expect(await nordvpn.getUserStatus()).to.equal(NordVpn.status.user.LOGGEDOUT);
    });
  });

  describe('connect', function() {
    it('can connect without city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect();

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(NordVpn.status.connection.CONNECTED);
    });

    it('can connect with city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('New_York_City');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(NordVpn.status.connection.CONNECTED);
    });

    it('can connect with country code', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('US');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(NordVpn.status.connection.CONNECTED);
    });

    it('cannot connect with incorrect city', async function() {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('Not_A_City');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.false;
      expect(status).to.equal(NordVpn.status.connection.DISCONNECTED);
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
        const citiesInCountry = allCities
          .filter(it => it.country === country)
          .map(it => it.name);
        expect(cities).not.to.be.empty;
        cities.forEach(city => {
          expect(city[0].toUpperCase()).to.equal(city[0]);
          expect(citiesInCountry).to.include(city.split('_').join(' '));
        });
      });
    });
  });
  */
});
