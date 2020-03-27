const NordVpn = require('./nordvpn');
const dummyNordVpn = require('./dummy.nord.vpn');
const { expect } = require('chai');

describe('NordVPN', () => {
  let nordvpn;

  beforeEach(async () => {
    await dummyNordVpn.clear();
    const config = { executable: dummyNordVpn.command };
    nordvpn = new NordVpn(config);
  });

  it('returns status correctly', async () => {
    const status = await nordvpn.getStatus();

    expect(status).to.equal(NordVpn.status.DISCONNECTED);
  });

  it('returns logged in status correctly', async () => {
  });
});
