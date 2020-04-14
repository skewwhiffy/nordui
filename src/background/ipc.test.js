'use strict';
import Ipc from './ipc';
import Terminal from '../terminal/terminal';
import Logger from '../log/dummy.logger';
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
    const logger = new Logger();
    const terminal = new Terminal({ logger });
    const ipc = new Ipc({ ipcMain, terminal });
    ipc.statusIpc = statusIpc;

    ipc.setup();

    expect(ipcMain.id).to.equal('status-get');
    await ipcMain.func(event);
    expect(event.id).to.equal('status-callback');
    expect(event.result).to.equal('statusIpcCalled');
  });
});
