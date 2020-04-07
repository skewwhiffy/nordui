'use strict';
import { ipcMain } from 'electron';
import statuses from '../enum/status.js';
import userStatuses from '../enum/user.status';
import Wrapper from '../terminal/command.wrapper';
import NordVpn from '../terminal/nordvpn';

let singleton;

export default class {
  constructor() {
    if (singleton) {
      return singleton;
    }
    singleton = this;
    const wrapper = new Wrapper('nordvpn');
    this.nordvpn = new NordVpn({ wrapper });
  }

  setup() {
    ipcMain.on('status-get', async (event, arg) => {
      console.log('About to status get');
      const status = await this.getStatus();
      console.log('Status get', status);
      event.reply('status-callback', status);
    });
  }

  async getStatus() {
    const userStatus = await this.nordvpn.getUserStatus();
    if (userStatus === userStatuses.LOGGEDOUT) {
      return statuses.NOT_LOGGED_IN;
    }
    return statuses.UNKNOWN;
  }
};
