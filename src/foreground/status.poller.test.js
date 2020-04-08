'use strict';
import StatusPoller from './status.poller';
import DummyWaiter from '../util/dummy.waiter';
import Waiter from '../util/waiter';
import statuses from '../enum/status';
import { expect } from 'chai';

describe('Status poller', function() {
  const realWaiter = new Waiter();
  let changed;
  let status;
  let config;
  let poller;

  beforeEach(function() {
    const waiter = new DummyWaiter();
    const ipcRenderer = {
      on(name, func) {
        this.callback = func;
      },
      send() {
        this.callback({}, status);
      }
    };
    changed = false;
    status = statuses.UNKNOWN;
    const ms = 10;
    config = { ipcRenderer, ms, waiter };
    poller = new StatusPoller(config);
    poller.onChange(() => {
      changed = true;
    });
  });

  afterEach(function() {
    poller.destroy();
  });

  it('polls for status', function() {
    const pollerStatus = poller.status;

    expect(pollerStatus).to.equal(status);
  });

  it('picks up new status', async function() {
    status = statuses.CONNECTED;

    while (poller.status !== status) {
      config.waiter.elapse();
      await realWaiter.wait(10);
    }
    expect(changed).to.be.true;
  });

  it('is a singleton', function() {
    const newPoller = new StatusPoller(config);

    expect(newPoller).to.equal(poller);
  });

  it('reinstantiates when destroyed', function() {
    poller.destroy();

    const newPoller = new StatusPoller(config);

    expect(newPoller).not.to.equal(poller);
  });

  it('does not poll when destroyed', function() {
    poller.destroy();
    status = statuses.NOT_LOGGED_IN;

    poller.poll();

    for (let i = 0; i < 10; i++) {
      config.waiter.elapse();
      expect(poller.status).not.to.equal(status);
    }
  });
});
