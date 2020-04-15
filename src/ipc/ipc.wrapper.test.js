'use strict';
import BackgroundWrapper from './background.wrapper';
import ForegroundWrapper from './foreground.wrapper';
import TestHarness from './test.harness';
import DummyLogger from '../log/dummy.logger';
import { expect } from 'chai';

describe('IPC wrapper', function() {
  let logger;
  let harness;
  let ipcMain;
  let ipcRenderer;
  let backgroundWrapper;
  let foregroundWrapper;

  beforeEach(function() {
    logger = new DummyLogger();
    harness = new TestHarness({ logger });
    ipcMain = harness.ipcMain;
    ipcRenderer = harness.ipcRenderer;
    backgroundWrapper = new BackgroundWrapper({ ipcMain, logger });
    foregroundWrapper = new ForegroundWrapper({ ipcRenderer, logger });
  });

  it('sets up ipcMain for sync function', async function() {
    const raw = {
      hello(arg) {
        return 'hello ' + arg;
      }
    };
    const prefix = 'sync';

    [ backgroundWrapper, foregroundWrapper ].forEach(it => it.wrap({ prefix, raw }));
    const result = await foregroundWrapper.get(prefix).hello('world');

    expect(result).to.equal('hello world');
  });

  it('sets up ipcMain for async function', async function() {
    const raw = {
      async hello(arg) {
        return 'hello ' + arg;
      }
    };
    const prefix = 'async';

    [ backgroundWrapper, foregroundWrapper ].forEach(it => it.wrap({ prefix, raw }));
    const result = await foregroundWrapper.get(prefix).hello('world');

    expect(result).to.equal('hello world');
  });
});
