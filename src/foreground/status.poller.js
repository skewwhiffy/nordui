'use strict';
import statuses from '../enum/status';

let singleton;

export default class {
  constructor({ ipcRenderer, ms, waiter }) {
    if (singleton) {
      return singleton;
    }
    this.ms = ms;
    this.currentStatus = statuses.UNKNOWN;
    this.ipcRenderer = ipcRenderer;
    ipcRenderer.on('status-callback', async (event, arg) => {
      this.currentStatus = arg;
      await waiter.wait(ms);
      this.poll();
    });
    this.poll();
    singleton = this;
  }

  poll() {
    if (!this.destroyed) {
      this.ipcRenderer.send('status-get', '');
    }
  }

  get status() {
    return this.currentStatus;
  }

  destroy() {
    this.destroyed = true;
    singleton = null;
  }
}
