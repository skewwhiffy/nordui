const dummyNordVpn = require('./dummy.nord.vpn');
const Terminal = require('./terminal');
const { expect } = require('chai');

describe('Dummy nordvpn', function() {
  const getLastLine = response => {
    const responseLines = response.split('\n');
    return responseLines[responseLines.length - 1];
  };
  const terminal = new Terminal();
  const { command, username, password } = dummyNordVpn;

  beforeEach(async function() {
    await dummyNordVpn.clear();
  });

  it('requires arguments', async function() {
    const response = await terminal.execute(command);

    expect(response).to.contain('Usage:');
  });

  describe('login', function() {
    it('logs in with correct credentials', async function() {
      const response = await terminal.execute(`${command} login -u ${username} -p ${password}`);

      expect(getLastLine(response)).to.contain('can now connect');
    });

    it('logs in with quotes around credentials', async function() {
      const response = await terminal.execute(`${command} login -u '${username}' -p '${password}'`);

      expect(getLastLine(response)).to.contain('can now connect');
    });

    it('returns \'already logged in\' message', async function() {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);
      const response = await terminal.execute(command, 'login -u poo -p pee');

      expect(getLastLine(response)).to.contain('already logged in');
    });

    it('does not login with incorrect credentials', async function() {
      const response = await terminal.execute(`${command} login -u poo -p pee`);

      expect(getLastLine(response)).to.contain('is not correct');
    });
  });

  describe('status', function() {
    it('shows disconnected status', async function() {
      const response = await terminal.execute(`${command} status`);

      expect(getLastLine(response)).to.contain('Status:');
      expect(getLastLine(response)).to.contain('Disconnected');
    });

    it('shows connected status', async function() {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);
      await terminal.execute(`${command} connect`);
      const response = await terminal.execute(`${command} status`);

      const candidateStatusLines = response
        .split('\n')
        .filter(it => it.startsWith('Status:'));
      expect(candidateStatusLines).to.have.length(1);
      expect(candidateStatusLines[0]).to.contain('Status:');
      expect(candidateStatusLines[0]).to.contain('Connected');
    });
  });

  describe('connect', function() {
    it('connects without a city', async function() {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);

      const response = await terminal.execute(`${command} connect`);

      const responseLines = response.split('\n');
      const lastLine = responseLines[responseLines.length - 1];
      expect(lastLine).to.contain('are connected');
    });

    it('connects when city exists', async function() {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);

      const response = await terminal.execute(`${command} connect new_york`);

      const responseLines = response.split('\n');
      const lastLine = responseLines[responseLines.length - 1];
      expect(lastLine).to.contain('are connected');
    });

    it('connects by country', async function() {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);

      const response = await terminal.execute(`${command} connect united_kingdom`);

      const responseLines = response.split('\n');
      const lastLine = responseLines[responseLines.length - 1];
      expect(lastLine).to.contain('are connected');
    });

    it('connects by country code', async function() {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);

      const response = await terminal.execute(`${command} connect gb`);

      const responseLines = response.split('\n');
      const lastLine = responseLines[responseLines.length - 1];
      expect(lastLine).to.contain('are connected');
    });

    it('does not connect when city does not exist', async function() {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);

      const response = await terminal.execute(`${command} connect not_a_city`);

      const responseLines = response.split('\n');
      const lastLine = responseLines[responseLines.length - 1];
      expect(lastLine).to.contain('try again');
    });
  });

  describe('geography', function() {
    let countries;

    before(async function() {
      const response = await terminal.execute(`${command} countries`);
      const responseLines = response.split('\n');

      countries = responseLines[responseLines.length - 1]
        .split(',')
        .map(it => it.split(' '))
        .reduce((a, c) => a.concat(c))
        .map(it => it.trim())
        .filter(it => it)
        .map(it => it.trim());
    });

    it('shows countries', function() {
      expect(countries).not.to.be.empty;
      countries.forEach(it => {
        expect(it).not.to.include(' ');
        const firstLetter = it.substring(0, 1);
        expect(firstLetter.toUpperCase()).to.equal(firstLetter);
      });
    });

    it('shows cities', async function() {
      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        const rawCities = await terminal.execute(`${command} cities ${country}`);
        const rawCitiesLines = rawCities.split('\n');
        const cities = rawCitiesLines[rawCitiesLines.length - 1]
          .split(',')
          .map(it => it.trim());
        expect(cities).not.to.be.empty;
        cities.forEach(it => {
          expect(it).not.to.include(' ');
          const firstLetter = it.substring(0, 1);
          expect(firstLetter.toUpperCase()).to.equal(firstLetter);
        });
        if (cities.length > 2) {
          // Don't bother checking all of them: there are far too many.
          return;
        }
      }
    });
  });
});