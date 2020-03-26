const dummyNordVpn = require('./dummy.nord.vpn');
const Terminal = require('./terminal');
const { expect } = require('chai');

describe.only('Dummy terminal', () => {
  const getLastLine = response => {
    const responseLines = response.split('\n');
    return responseLines[responseLines.length - 1];
  };
  const terminal = new Terminal();
  const { command, username, password } = dummyNordVpn;

  beforeEach(async () => {
    await dummyNordVpn.clear();
  });

  describe('login', () => {
    it('logs in with correct credentials', async () => {
      const response = await terminal.execute(`${command} login -u ${username} -p ${password}`);

      expect(getLastLine(response)).to.contain('can now connect');
    });

    it('returns \'already logged in\' message', async () => {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);
      const response = await terminal.execute(command, 'login -u poo -p pee');

      expect(getLastLine(response)).to.contain('already logged in');
    })

    it('does not login with incorrect credentials', async () => {
      const response = await terminal.execute(`${command} login -u poo -p pee`);

      expect(getLastLine(response)).to.contain('is not correct');
    })
  })

  describe('status', () => {
    it('shows disconnected status', async () => {
      const response = await terminal.execute(`${command} status`);

      expect(getLastLine(response)).to.contain('Status:');
      expect(getLastLine(response)).to.contain('Disconnected');
    });

    it('shows connected status', async () => {
      await terminal.execute(`${command} login -u ${username} -p ${password}`);
      await terminal.execute(`${command} connect`);
      const response = await terminal.execute(`${command} status`);

      const candidateStatusLines = response
        .split('\n')
        .filter(it => it.startsWith('Status:'));
      expect(candidateStatusLines).to.have.length(1);
      expect(candidateStatusLines[0]).to.contain('Status:');
      expect(candidateStatusLines[0]).to.contain('Connected');
    })
  })
});
