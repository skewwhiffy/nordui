const NordVpn = require('./nordvpn');
const dummyNordVpn = require('./dummy.terminal');
const { expect } = require('chai');

describe('NordVPN', () => {
  let nordvpn;

  beforeEach(() => {
    const config = {
      executable: dummyNordVpn.dummyNordVpn
    };
    nordvpn = new NordVpn(config);
  });

  it('returns status correctly', async () => {
    dummyNordVpn.prepareStatus('Disconnected');

    const status = await nordvpn.getStatus();

    expect(status).to.equal(NordVpn.status.DISCONNECTED);
  });

  it('returns logged in status correctly', async () => {

  });
});
