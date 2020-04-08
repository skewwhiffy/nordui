'use strict';
import Ipc from './ipc';
import { expect } from 'chai';

describe('Ipc setup', function() {
  it('sets up status', async function() {
    const event = {
      reply(id, result) {
        this.id = id;
        this.result = result;
      }
    };
    const ipcMain = {
      on(id, func) {
        this.id = id;
        this.func = func;
      }
    };
    const statusIpc = {
      async status() {
        return 'statusIpcCalled';
      }
    };
    const ipc = new Ipc({ ipcMain });
    ipc.statusIpc = statusIpc;

    ipc.setup();

    expect(ipcMain.id).to.equal('status-get');
    await ipcMain.func(event);
    expect(event.id).to.equal('status-callback');
    expect(event.result).to.equal('statusIpcCalled');
  });
});
