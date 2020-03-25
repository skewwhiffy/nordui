const Terminal = require('./terminal');
const { expect } = require('chai');

describe('dummy', () => {
  const terminal = new Terminal();

  it('echo works', async () => {
    const response = await terminal.execute('echo', 'hello', 'mum');

    expect(response).to.equal('hello mum');
  })
});
