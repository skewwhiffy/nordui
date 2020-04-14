'use strict';
import BackgroundWrapper from './background.wrapper';
import ForegroundWrapper from './foreground.wrapper';
import TestHarness from './test.harness';
import { expect } from 'chai';

describe.only('IPC wrapper', function() {
  it('sets up ipcMain for sync function', async function() {
    const harness = new TestHarness();
    const raw = {
      hello(arg) {
        return 'hello ' + arg;
      }
    };
    const prefix = 'sync';
    const backgroundWrapper = new BackgroundWrapper({ ipcMain: harness.ipcMain });
    const foregroundWrapper = new ForegroundWrapper({ ipcRenderer: harness.ipcRenderer });

    [ backgroundWrapper, foregroundWrapper ].forEach(it => it.wrap({ prefix, raw }));
    const result = await foregroundWrapper.get(prefix).hello('world');

    expect(result).to.equal('hello world');
  });
});
