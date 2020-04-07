'use strict';
import { ipcMain } from 'electron';
import statuses from '../enum/status.js';
import userStatuses from '../enum/user.status';
import connectionStatuses from '../enum/connection.status';
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
    const connectionStatus = await this.nordvpn.getConnectionStatus();
    if (connectionStatus === connectionStatuses.CONNECTED) {
      return statuses.CONNECTED;
    }
    console.log('Connection status', connectionStatus);
    const userStatus = await this.nordvpn.getUserStatus();
    if (userStatus === userStatuses.LOGGEDOUT) {
      return statuses.NOT_LOGGED_IN;
    }
    if (userStatus === userStatuses.LOGGEDIN) {
      return statuses.NOT_CONNECTED;
    }
    return statuses.UNKNOWN;
  }
};
