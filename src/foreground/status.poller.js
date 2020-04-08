'use strict';
import statuses from '../enum/status';

export default class {
  constructor({ ipcRenderer, ms, waiter }) {
    this.ms = ms;
    this.currentStatus = statuses.UNKNOWN;
    this.ipcRenderer = ipcRenderer;
    ipcRenderer.on('status-callback', async (event, arg) => {
      this.currentStatus = arg;
      await waiter.wait(ms);
      this.poll();
    });
    this.poll();
  }

  poll() {
    this.ipcRenderer.send('status-get', '');
  }

  get status() {
    return this.currentStatus;
  }
}
