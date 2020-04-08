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
    this.onChangeFunction = () => {};
    ipcRenderer.on('status-callback', async (event, arg) => {
      const oldStatus = this.currentStatus;
      this.currentStatus = arg;
      if (oldStatus !== arg) {
        this.onChangeFunction();
      }
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

  onChange(func) {
    this.onChangeFunction = func;
  }

  destroy() {
    this.destroyed = true;
    singleton = null;
  }
}
