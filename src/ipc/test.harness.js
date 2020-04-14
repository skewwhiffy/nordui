'use strict';

export default class {
  constructor() {
    const self = this;
    this.mainRegistrations = {};
    this.rendererRegistrations = {};
    this.ipcMain = {
      on(key, func) {
        console.log('Registering ipcMain with', key);
        console.log('Func', func.toString());
        self.mainRegistrations[key] = func;
      }
    };
    this.ipcRenderer = {
      send(key, argument) {
        console.log('Inside ipcRenderer.send with', key, argument);
        console.log(self.mainRegistrations[key].toString());
        self.mainRegistrations[key](self.event, argument);
      },
      on(key, func) {
        self.rendererRegistrations[key] = func;
      }
    };
    this.event = {
      reply(key, argument) {
        console.log('Inside event.reply');
        self.rendererRegistrations[key](this, argument);
      }
    };
  }
}
