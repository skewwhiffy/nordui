'use strict';
import BackgroundWrapper from './background.wrapper';
import { expect } from 'chai';

describe('Background IPC wrapper', function() {
  it('sets up ipcMain for sync function', async function() {
    const ipcMain = {
      on(key, func) {
        this.key = key;
        this.func = func;
      }
    };
    const event = {
      reply(key, result) {
        this.key = key;
        this.result = result;
      }
    };
    const raw = {
      hello(arg) {
        return 'hello';
      }
    };
    const prefix = 'sync';
    const wrapper = new BackgroundWrapper({ ipcMain });

    wrapper.wrap({ prefix, raw });

    expect(ipcMain.key).to.equal('sync_hello_call');
    const { arg, response } = await ipcMain.func(event, 'world');
    expect(arg).to.equal('world');
    expect(response).to.equal('hello');
  });
});
