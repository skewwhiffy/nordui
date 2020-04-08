'use strict';
import StatusIpc from './status.ipc';
import Wrapper from '../terminal/dummy.nord.vpn';
import NordVpn from '../terminal/nordvpn';
import statuses from '../enum/status';
import userStatuses from '../enum/user.status';
import { expect } from 'chai';

describe('Status IPC', function() {
  let wrapper;
  let nordVpn;
  let statusIpc;

  beforeEach(function() {
    wrapper = new Wrapper();
    nordVpn = new NordVpn({ wrapper });

    statusIpc = new StatusIpc({ nordVpn });
  });

  it('gets not logged in status correctly', async function() {
    const status = await statusIpc.status();

    expect(status).to.equal(statuses.NOT_LOGGED_IN);
  });

  it('gets connected status', async function() {
    await wrapper.execute(`login -u ${Wrapper.username} -p ${Wrapper.password}`);
    await wrapper.execute('connect');

    const status = await statusIpc.status();

    expect(status).to.equal(statuses.CONNECTED);
  });

  it('gets logged in status', async function() {
    await wrapper.execute(`login -u ${Wrapper.username} -p ${Wrapper.password}`);

    const status = await statusIpc.status();

    expect(status).to.equal(statuses.NOT_CONNECTED);
  });

  it('gets unknown status', async function() {
    nordVpn.getUserStatus = async () => userStatuses.UNKNOWN;

    const status = await statusIpc.status();

    expect(status).to.equal(statuses.UNKNOWN);
  });
});
