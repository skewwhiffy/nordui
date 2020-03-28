const NordVpn = require('./nordvpn');
const Terminal = require('./terminal');
const dummyNordVpn = require('./dummy.nord.vpn');
const { expect } = require('chai');
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

    it('connected', async () => {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);
      await terminal.execute(`${command} connect`);

      const status = await nordvpn.getConnectionStatus();

      expect(status).to.equal(NordVpn.status.connection.CONNECTED);
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

  describe('quick connect', () => {
    it('can connect', async () => {
      expect(await nordvpn.getConnectionStatus()).to.equal(NordVpn.status.connection.DISCONNECTED);
    })
  })

  describe('countries', async () => {
    it('can get all countries', async () => {
      const cities = require('all-the-cities');
      const london = cities.filter(city => city.name.match('Kidderminster'));
      console.log(london);
    })
  })
});
