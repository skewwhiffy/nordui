'use strict';
import Wrapper from '../terminal/command.wrapper';
import NordVpn from '../terminal/nordvpn';
import StatusIpc from './status.ipc';

let singleton;

export default class {
  constructor({ ipcMain, terminal }) {
    if (singleton) {
      return singleton;
    }
    singleton = this;
    this.ipcMain = ipcMain;
    const command = 'nordvpn';
    const wrapper = new Wrapper({ command, terminal });
    this.nordVpn = new NordVpn({ wrapper });
    this.statusIpc = new StatusIpc(this);
  }

  setup() {
    this.ipcMain.on('status-get', async (event, arg) => {
      event.reply('status-callback', await this.statusIpc.status());
    });
  }
}
