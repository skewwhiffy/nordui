const { exec } = require('child_process');

module.exports = class {
  execute(...args) {
    return new Promise(resolve => {
      exec(args.join(' '), (err, stdout, stderr) => {
        if (err) {
          console.warn(error);
        }
        resolve(stdout? stdout.trim() : stderr);
      })
    })
  }
}
