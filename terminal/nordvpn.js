const Terminal = require('./terminal');

module.exports = class {
  constructor({ executable }) {
    this.executable = executable;
    this.terminal = new Terminal();
  }

  async getStatus() {
    const terminalResponse = await this.terminal.execute(this.executable, 'status');
    const candidateStatusLines = terminalResponse
      .split('\n')
      .filter(it => it.startsWith('Status:'));
    if (candidateStatusLines.length != 1) {
      throw {
        message: 'Could not determine status from response ' + terminalResponse,
        terminalResponse
      }
    }
    const statusLine = candidateStatusLines[0];
    switch (statusLine.substring('Status:'.length).trim().toLowerCase()) {
      case 'disconnected':
        return module.exports.status.DISCONNECTED;
      default:
        throw {
          message: 'Could not determine status from status line ' + statusLine,
          statusLine
        }
    }
  }
}

module.exports.status = Object.freeze({
  DISCONNECTED: 1,
  CONNECTED: 2
});
