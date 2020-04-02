const path = require('path');
const fs = require('fs');

module.exports = {
  username: 'dummy.username',
  password: 'dummy.password',
  command: path.join(__dirname, 'dummy.nord.vpn.script.js'),

  async clear() {
    const statusFile = path.join(__dirname, 'status.test.txt');
    if (fs.existsSync(statusFile)) {
      fs.unlinkSync(statusFile);
    }
  }
};
