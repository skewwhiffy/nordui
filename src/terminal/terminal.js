'use strict';
import { exec } from 'child_process';

export default class {
  constructor({ logger }) {
    this.logger = logger;
  }

  execute(...args) {
    return new Promise(resolve => {
      const command = args.filter(it => it).join(' ');
      exec(command, (err, stdout, stderr) => {
        if (err) {
          this.logger.warn(err);
        }
        resolve(stdout ? stdout.trim() : stderr);
      });
    });
  }
};
