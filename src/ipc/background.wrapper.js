'use strict';

export default class {
  constructor({ ipcMain }) {
    this.ipcMain = ipcMain;
    this.cache = {};
  }

  wrap({ prefix, raw }) {
    this.cache[prefix] = raw;
    Object.keys(raw).forEach(key => {
      const callKey = [ prefix, key, 'call' ].join('_');
      console.log('About to register ipcMain.on', callKey);
      console.log('raw[key] is', raw[key].toString());
      this.ipcMain.on(callKey, async (event, arg) => {
        const responseKey = [ prefix, key, 'response' ].join('_');
        event.reply(responseKey, raw[key](arg));
      });
    });
  }
}
