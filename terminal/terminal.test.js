const Terminal = require('./terminal');
const { expect } = require('chai');

describe('Terminal', () => {
  const terminal = new Terminal();

  it('executes echo command correctly', async () => {
    const response = await terminal.execute('echo', 'hello', 'mum');

    expect(response).to.equal('hello mum');
  });
});
