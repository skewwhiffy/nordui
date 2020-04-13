'use strict';

export default class {
  constructor({ ipcMain }) {
    this.ipcMain = ipcMain;
  }

  wrap({ prefix, raw }) {
    Object.keys(raw).forEach(key => {
      const callKey = [ prefix, key, 'call' ].join('_');
      const responseKey = [ prefix, key, 'response' ].join('_');
      console.log(callKey, responseKey);
    });
  }
}
