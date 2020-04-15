'use strict';
import BackgroundSetup from './background.setup';
import ForegroundSetup from './foreground.setup';
import TestHarness from './test.harness';
import DummyLogger from '../log/dummy.logger';
import BackgroundIoc from '../background/ioc';
import ForegroundIoc from '../foreground/ioc';
import Terminal from '../terminal/terminal';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { expect } from 'chai';

describe.only('IPC setup', function() {
  it('sets up all raw clients', async function() {
    const logger = new DummyLogger();
    const { ipcRenderer, ipcMain } = new TestHarness({ logger });
    const overrides = { logger, ipcRenderer, ipcMain };
    const backgroundIoc = new BackgroundIoc(overrides);
    const foregroundIoc = new ForegroundIoc(overrides);
    const backgroundSetup = new BackgroundSetup(backgroundIoc);
    const foregroundSetup = new ForegroundSetup(foregroundIoc);
    const terminal = new Terminal(backgroundIoc);
    const ls = util.promisify(fs.readdir);
    const pwd = await terminal.execute('pwd');

    await backgroundSetup.setup();
    await foregroundSetup.setup();

    const dir = path.join(pwd, 'src/ipc/raw');
    const items = await ls(dir);
    items.filter(it => it.endsWith('.js'))
      .map(it => it.substring(0, it.length - 3))
      .forEach(it => {
        const client = foregroundSetup.clients[it];
        expect(client).not.to.be.empty;
      });
  });
});
