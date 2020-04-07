'use strict';
import { ipcMain } from 'electron';
import Wrapper from '../terminal/command.wrapper';
import NordVpn from '../terminal/nordvpn';
import StatusIpc from './status.ipc';

let singleton;

export default class {
  constructor() {
    if (singleton) {
      return singleton;
    }
    singleton = this;
    const wrapper = new Wrapper('nordvpn');
    this.nordVpn = new NordVpn({ wrapper });
  }

  setup() {
    const statusIpc = new StatusIpc(this);
    ipcMain.on('status-get', async (event, arg) => {
      event.reply('status-callback', await statusIpc.status());
    });
  }
}
