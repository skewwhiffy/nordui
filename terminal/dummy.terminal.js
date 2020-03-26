const path = require('path');
const fs = require('fs');

module.exports = {
  get dummyNordVpn() {
    return path.join(__dirname, 'dummy.nord.vpn.script.js');
  },

  get lastArgs() {
    const lastArgsFile = path.join(__dirname, 'lastArguments.test.txt');
    const lastArgsFileContents = fs.readFileSync(lastArgsFile, 'utf8');
    return lastArgsFileContents.split('\n').filter(it => it);
  },

  set nextResponse(value) {
    const nextResponseFile = path.join(__dirname, 'nextResponse.test.txt');
    fs.writeFileSync(nextResponseFile, value);
  },

  prepareStatus(status) {
    this.nextResponse = `Some message might happen before status line\nStatus: ${status}`;
  }
}
