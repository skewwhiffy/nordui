const { exec } = require('child_process');

module.exports = class {
  execute = () => {
    return new Promise(resolve => {
      exec('echo hello mum', (err, stdout, stderr) => {
        if (err) {
          console.warn(error);
        }
        resolve(stdout? stdout.trim() : stderr);
      })
    })
  }
}
