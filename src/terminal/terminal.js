const { exec } = require('child_process');

module.exports = class {
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
