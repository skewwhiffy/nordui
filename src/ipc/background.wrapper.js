'use strict';

export default class {
  constructor({ ipcMain, logger }) {
    this.ipcMain = ipcMain;
    this.logger = logger;
    this.cache = {};
  }

  wrap({ prefix, raw }) {
    this.cache[prefix] = raw;
    Object.keys(raw).forEach(key => {
      const callKey = [ prefix, key, 'call' ].join('_');
      this.logger.info('About to register ipcMain.on', callKey);
      this.ipcMain.on(callKey, async (event, arg) => {
        const responseKey = [ prefix, key, 'response' ].join('_');
        event.reply(responseKey, raw[key](arg));
      });
    });
  }
}
