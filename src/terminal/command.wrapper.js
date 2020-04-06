'use strict';
import Terminal from './terminal';

export default class {
  constructor(command) {
    this.command = command;
    this.terminal = new Terminal();
  }

  async execute() {
    return await this.terminal.execute(this.command);
  }
}
