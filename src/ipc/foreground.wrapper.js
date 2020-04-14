'use strict';

export default class {
  constructor({ ipcRenderer, logger }) {
    this.ipcRenderer = ipcRenderer;
    this.logger = logger;
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
          this.logger.info('About to ipcRenderer.send with', callKey, arg);
          const promise = new Promise(resolve => {
            this.logger.info('Setting resolve cache on key', key);
            this.resolveCache[key] = resolve;
          });
          this.ipcRenderer.send(callKey, arg); // TODO: Incorporate request ID
          return promise;
        };
        this.ipcRenderer.on(responseKey, (event, arg) => {
          this.logger.info('Resolving on key', key);
          this.resolveCache[key](arg);
        });
      });
    this.cache[prefix] = cached;
  }

  get(prefix) {
    return this.cache[prefix];
  }
}
