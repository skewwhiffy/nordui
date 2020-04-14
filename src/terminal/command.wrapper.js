'use strict';

export default class {
  constructor({ command, terminal }) {
    this.command = command;
    this.terminal = terminal;
  }

  async execute(...args) {
    return await this.terminal.execute(this.command, ...args);
  }
}
