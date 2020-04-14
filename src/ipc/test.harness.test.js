'use strict';
import TestHarness from './test.harness';
import DummyLogger from '../log/dummy.logger';
import { expect } from 'chai';

describe('IPC test harness', function() {
  let logger;
  let harness;
  let argument = 0;

  beforeEach(function() {
    logger = new DummyLogger();
    harness = new TestHarness({ logger });
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
