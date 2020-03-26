const path = require('path');
const fs = require('fs');

module.exports = {
  get dummyNordVpn() {
    return path.join(__dirname, 'dummyNordVpn.sh');
  },

  get lastArgs() {
    const lastArgsFile = path.join(__dirname, 'lastArguments.test.txt');
    const lastArgsFileContents = fs.readFileSync(lastArgsFile, 'utf8');
    return lastArgsFileContents.split('\n').filter(it => it);
  },

  set nextResponse(value) {
    const nextResponseFile = path.join(__dirname, 'nextResponse.test.txt');
    fs.writeFileSync(nextResponseFile, value);
  }
}
