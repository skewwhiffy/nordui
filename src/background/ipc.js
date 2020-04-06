'use strict';
const { ipcMain } = require('electron');

let singleton;
let count = 0;

module.exports = class {
  constructor() {
    if (singleton) {
      return singleton;
    }
    singleton = this;
  }

  setup() {
    console.log('Setting up IPC');
    ipcMain.on('status-get', (event, arg) => {
      console.log('Status get');
      event.reply('status-callback', 'goodbye world ' + count++);
    });
  }
};
