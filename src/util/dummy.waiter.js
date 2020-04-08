'use strict';

export default class {
  constructor() {
    this.poo = 'Hello';
    this.resolves = [];
    this.elapses = [];
  }

  wait(ms) {
    const self = this;
    const ret = new Promise(resolve => {
      if (this.elapses.length > 0) {
        self.elapses = self.elapses.slice(1);
        resolve();
      } else {
        self.resolves.push(resolve);
      }
    });
    return ret;
  }

  async elapse() {
    if (this.resolves.length > 0) {
      const resolve = this.resolves[0];
      this.resolves = this.resolves.slice(1);
      resolve();
      return;
    }
    this.elapses.push(new Date());
  }
}
