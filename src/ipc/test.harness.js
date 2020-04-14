'use strict';

export default class {
  constructor({ logger }) {
    const self = this;
    this.mainRegistrations = {};
    this.rendererRegistrations = {};
    this.ipcMain = {
      on(key, func) {
        logger.info('Registering ipcMain with', key);
        self.mainRegistrations[key] = func;
      }
    };
    this.ipcRenderer = {
      send(key, argument) {
        logger.info('ipcRenderer.send with', key, argument);
        self.mainRegistrations[key](self.event, argument);
      },
      on(key, func) {
        self.rendererRegistrations[key] = func;
      }
    };
    this.event = {
      async reply(key, argument) {
        const result = await Promise.resolve(argument);
        logger.info('event.reply', key, result);
        self.rendererRegistrations[key](this, result);
      }
    };
  }
}
