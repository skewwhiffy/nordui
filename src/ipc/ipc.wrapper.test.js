'use strict';
import BackgroundWrapper from './background.wrapper';
import ForegroundWrapper from './foreground.wrapper';
import TestHarness from './test.harness';
import DummyLogger from '../log/dummy.logger';
import { expect } from 'chai';

describe('IPC wrapper', function() {
  it('sets up ipcMain for sync function', async function() {
    const logger = new DummyLogger();
    const harness = new TestHarness({ logger });
    const raw = {
      hello(arg) {
        return 'hello ' + arg;
      }
    };
    const prefix = 'sync';
    const { ipcMain, ipcRenderer } = harness;
    const backgroundWrapper = new BackgroundWrapper({ ipcMain, logger });
    const foregroundWrapper = new ForegroundWrapper({ ipcRenderer, logger });

    [ backgroundWrapper, foregroundWrapper ].forEach(it => it.wrap({ prefix, raw }));
    const result = await foregroundWrapper.get(prefix).hello('world');

    expect(result).to.equal('hello world');
  });
});
