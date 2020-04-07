'use strict';
import statuses from '../enum/status';
import connectionStatuses from '../enum/connection.status';
import userStatuses from '../enum/user.status';

export default class {
  constructor({ nordVpn }) {
    this.nordVpn = nordVpn;
  }

  async status() {
    const connectionStatus = await this.nordVpn.getConnectionStatus();
    if (connectionStatus === connectionStatuses.CONNECTED) {
      return statuses.CONNECTED;
    }
    const userStatus = await this.nordVpn.getUserStatus();
    if (userStatus === userStatuses.LOGGEDOUT) {
      return statuses.NOT_LOGGED_IN;
    }
    if (userStatus === userStatuses.LOGGEDIN) {
      return statuses.NOT_CONNECTED;
    }
    return statuses.UNKNOWN;
  }
}
