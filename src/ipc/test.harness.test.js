'use strict';
import TestHarness from './test.harness';
import { expect } from 'chai';

describe.only('IPC test harness', function() {
  it('ipcRenderer proxies to ipcMain', async function(done) {
    const harness = new TestHarness();
    const ipcMain = harness.ipcMain;
    const ipcRenderer = harness.ipcRenderer;
    const argument = 'argument';
    ipcMain.on('main-func', async (event, arg) => {
      expect(arg).to.equal(argument);
      done();
    });

    ipcRenderer.send('main-func', argument);
  });
});
