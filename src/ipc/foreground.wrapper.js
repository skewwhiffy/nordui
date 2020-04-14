'use strict';

export default class {
  constructor({ ipcRenderer }) {
    this.ipcRenderer = ipcRenderer;
    this.resolveCache = {};
    this.cache = {};
  }

  wrap({ prefix, raw }) {
    const cached = {};
    Object.keys(raw)
      .filter(key => typeof raw[key] === 'function')
      .forEach(key => {
        const callKey = [ prefix, key, 'call' ].join('_');
        const responseKey = [ prefix, key, 'response' ].join('_'); // TODO: Commonize with background.wrapper.js
        cached[key] = arg => {
          console.log('About to ipcRenderer.send with', callKey, arg);
          const promise = new Promise(resolve => {
            console.log('Setting resolve cache on key', key);
            this.resolveCache[key] = resolve;
          });
          this.ipcRenderer.send(callKey, arg); // TODO: Incorporate request ID
          return promise;
        };
        this.ipcRenderer.on(responseKey, (event, arg) => {
          console.log('Resolving on key', key);
          console.log('Inside call back, arg:', arg);
          this.resolveCache[key](arg);
        });
      });
    this.cache[prefix] = cached;
  }

  get(prefix) {
    return this.cache[prefix];
  }
}
