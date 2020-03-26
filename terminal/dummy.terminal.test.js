const dummyTerminal = require('./dummy.terminal')
const Terminal = require('./terminal');
const { expect } = require('chai');

describe('Dummy terminal', () => {
  const terminal = new Terminal();

  it('returns arguments', async () => {
    dummyTerminal.nextResponse = 'test response';

    const response = await terminal.execute(dummyTerminal.dummyNordVpn, 'hello', 'mum');
    const lastArgs = dummyTerminal.lastArgs;

    expect(lastArgs).to.eql([ 'hello', 'mum' ]);
    expect(response).to.equal('test response');
  });

  it('prepares status', async () => {
    dummyTerminal.prepareStatus('test_standby');

    const response = await terminal.execute(dummyTerminal.dummyNordVpn, 'status');

    const candidateStatusLines = response
      .split('\n')
      .filter(it => it.startsWith('Status:'));
    expect(candidateStatusLines).to.have.length(1);
    const statusLine = candidateStatusLines[0].substring('Status:'.length).trim();
    expect(statusLine).to.equal('test_standby');
  })
});
