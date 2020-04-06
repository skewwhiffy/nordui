'use strict';
import { exec } from 'child_process';

export default class {
  execute(...args) {
    return new Promise(resolve => {
      exec(args.filter(it => it).join(' '), (err, stdout, stderr) => {
        if (err) {
          console.warn(err);
        }
        resolve(stdout ? stdout.trim() : stderr);
      });
    });
  }
};
