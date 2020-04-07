'use strict';
import Terminal from './terminal';
import { expect } from 'chai';

describe('Terminal', function() {
  const terminal = new Terminal();

  it('executes echo command correctly', async function() {
    const response = await terminal.execute('echo', 'hello', 'mum');

    expect(response).to.equal('hello mum');
  });
});
