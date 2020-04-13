'use strict';
import statuses from '../enum/status';
import actions from '../enum/connector.action';

export default class {
  getActions(status) {
    switch (status) {
      case statuses.NOT_LOGGED_IN:
        return [ actions.login ];
      case statuses.NOT_CONNECTED:
        return [ actions.connect, actions.logout ];
      case statuses.CONNECTED:
        return [ actions.disconnect ];
      case statuses.UNKNOWN:
      default:
        return [];
    }
  }
}
