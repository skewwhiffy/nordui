'use strict';
import { ipcMain } from 'electron';

let singleton;
let count = 0;

class IpcSetup {
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

export default IpcSetup;
