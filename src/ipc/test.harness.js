'use strict';

export default class {
  constructor() {
    const self = this;
    this.registrations = {};
    this.ipcMain = {
      on(key, func) {
        self.register(key, func);
      }
    };
    this.ipcRenderer = {
      send(key, argument) {
        self.call(key, argument);
      }
    };
    this.event = {};
  }

  register(key, func) {
    this.registrations[key] = func;
  }

  call(key, arg) {
    this.registrations[key](this.event, arg);
  }
}
