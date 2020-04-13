'use strict';

export default class {
  constructor() {
    const self = this;
    this.mainRegistrations = {};
    this.rendererRegistrations = {};
    this.ipcMain = {
      on(key, func) {
        self.mainRegistrations[key] = func;
      }
    };
    this.ipcRenderer = {
      send(key, argument) {
        self.mainRegistrations[key](self.event, argument);
      },
      on(key, func) {
        self.rendererRegistrations[key] = func;
      }
    };
    this.event = {
      reply(key, argument) {
        self.rendererRegistrations[key](this, argument);
      }
    };
  }
}
