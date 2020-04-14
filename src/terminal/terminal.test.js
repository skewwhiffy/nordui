'use strict';
import Terminal from './terminal';
import DummyLogger from '../log/dummy.logger';
import { expect } from 'chai';

describe('Terminal', function() {
  const logger = new DummyLogger();
  const terminal = new Terminal({ logger });

  it('executes echo command correctly', async function() {
    const response = await terminal.execute('echo', 'hello', 'mum');

    expect(response).to.equal('hello mum');
  });
});
