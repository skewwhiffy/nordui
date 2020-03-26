const dummyTerminal = require('./dummy.terminal')
const Terminal = require('./terminal');
const { expect } = require('chai');

describe.only('Dummy', () => {
  const terminal = new Terminal();

  it('returns arguments', async () => {
    dummyTerminal.nextResponse = 'test response';

    const response = await terminal.execute(dummyTerminal.dummyNordVpn, 'hello', 'mum');
    const lastArgs = dummyTerminal.lastArgs;

    expect(lastArgs).to.eql([ 'hello', 'mum' ]);
    expect(response).to.equal('test response');
  })
});
