'use strict';
import TestHarness from './test.harness';
import { expect } from 'chai';

describe('IPC test harness', function() {
  let harness;
  let argument = 0;

  beforeEach(function() {
    harness = new TestHarness();
    argument++;
  });

  it('ipcRenderer proxies to ipcMain', function(done) {
    harness.ipcMain.on('main-func', async (event, arg) => {
      expect(arg).to.equal(argument);
      done();
    });

    harness.ipcRenderer.send('main-func', argument);
  });

  it('ipcMain gets a call back', function(done) {
    harness.ipcMain.on('main-func', async (event, arg) => {
      event.reply('main-callback', {
        original: arg
      });
    });
    harness.ipcRenderer.on('main-callback', async (event, arg) => {
      expect(arg.original).to.equal(argument);
      done();
    });

    harness.ipcRenderer.send('main-func', argument);
  });
});
