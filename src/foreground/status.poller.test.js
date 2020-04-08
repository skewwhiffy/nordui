'use strict';
import StatusPoller from './status.poller';
import DummyWaiter from '../util/dummy.waiter';
import Waiter from '../util/waiter';
import statuses from '../enum/status';
import { expect } from 'chai';

describe('Status poller', function() {
  const realWaiter = new Waiter();
  let status;
  let waiter;
  let ipcRenderer;
  let poller;

  beforeEach(function() {
    waiter = new DummyWaiter();
    ipcRenderer = {
      on(name, func) {
        this.callback = func;
      },
      send() {
        this.callback({}, status);
      }
    };
    status = statuses.UNKNOWN;
    poller = new StatusPoller({ ipcRenderer, ms: 10, waiter });
  });

  it('polls for status', function() {
    const pollerStatus = poller.status;

    expect(pollerStatus).to.equal(status);
  });

  it('picks up new status', async function() {
    status = statuses.CONNECTED;

    while (poller.status !== status) {
      waiter.elapse();
      await realWaiter.wait(10);
    }
  });
});
