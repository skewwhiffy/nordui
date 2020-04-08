'use strict';

export default class {
  constructor({ waiter, poll, ms }) {
    this.waiter = waiter;
    this.pollFunction = poll;
    this.ms = ms;
  }

  async poll() {
    await this.pollFunction();
    await this.waiter.wait(this.ms);
    await this.poll();
  }
}
