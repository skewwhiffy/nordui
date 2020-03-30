const NordVpn = require('./nordvpn');
const Terminal = require('./terminal');
const dummyNordVpn = require('./dummy.nord.vpn');
const { expect } = require('chai');
const allCities = require('all-the-cities');
const { command, username, password } = dummyNordVpn;

describe('NordVPN', () => {
  let terminal;
  let nordvpn;

  beforeEach(async () => {
    await dummyNordVpn.clear();
    terminal = new Terminal();
    const config = { executable: command };
    nordvpn = new NordVpn(config);
  });

  describe('connection status', () => {
    it('disconnected', async () => {
      const status = await nordvpn.getConnectionStatus();

      expect(status).to.equal(NordVpn.status.connection.DISCONNECTED);
    });
  })

  describe('user status', () => {
    it('logged in', async () => {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);

      const status = await nordvpn.getUserStatus();

      expect(status).to.equal(NordVpn.status.user.LOGGEDIN);
    });

    it('logged out', async () => {
      const status = await nordvpn.getUserStatus();

      expect(status).to.equal(NordVpn.status.user.LOGGEDOUT);
    });
  });

  describe('login', () => {
    it('can login', async () => {
      expect(await nordvpn.getUserStatus()).to.equal(NordVpn.status.user.LOGGEDOUT);

      const result = await nordvpn.login({ username, password });

      expect(result).to.be.true;
      expect(await nordvpn.getUserStatus()).to.equal(NordVpn.status.user.LOGGEDIN);
    });

    it('cannot login with incorrect credentials', async () => {
      expect(await nordvpn.getUserStatus()).to.equal(NordVpn.status.user.LOGGEDOUT);

      const result = await nordvpn.login({ username: 'not_username', password: password + password });

      expect(result).to.be.false;
      expect(await nordvpn.getUserStatus()).to.equal(NordVpn.status.user.LOGGEDOUT);
    })
  });

  describe.only('connect', () => {
    it('can connect without city', async () => {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect();

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(NordVpn.status.connection.CONNECTED);
    });

    it('can connect with city', async () => {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('New_York_City');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(NordVpn.status.connection.CONNECTED);
    });

    it('can connect with country code', async () => {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('US');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.true;
      expect(status).to.equal(NordVpn.status.connection.CONNECTED);
    })

    it('cannot connect with incorrect city', async () => {
      await nordvpn.login({ username, password });

      const result = await nordvpn.connect('Not_A_City');

      const status = await nordvpn.getConnectionStatus();
      expect(result).to.be.false;
      expect(status).to.equal(NordVpn.status.connection.DISCONNECTED);
    })
  })

  describe('geography', async () => {
    it('can get all countries', async () => {
      const countries = await nordvpn.getCountries();

      expect(countries).to.include('GB');
    });

    it('can get all cities', async () => {
      const countries = (await nordvpn.getCountries())
        .slice(0, 5); // Doing all of them takes a short time
      const returnedCities = await Promise.all(countries
        .map(async country => {
          return {
            cities: await nordvpn.getCities(country),
            country
          }})
      );
        
      returnedCities.forEach(({country, cities}) => {
        const citiesInCountry = allCities
          .filter(it => it.country === country)
          .map(it => it.name);
        expect(cities).not.to.be.empty;
        cities.forEach(city => {
          expect(city[0].toUpperCase()).to.equal(city[0]);
          expect(citiesInCountry).to.include(city.split('_').join(' '));
        })
      })
    })
  })
});
