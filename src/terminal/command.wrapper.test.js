'use strict';
import Wrapper from './command.wrapper';
import Terminal from './terminal';
import Logger from '../log/dummy.logger';
import { expect } from 'chai';

describe('Command wrapper', function() {
  let terminal;

  beforeEach(function() {
    const logger = new Logger();
    terminal = new Terminal({ logger });
  });

  it('executes command without arguments', async function() {
    const command = 'pwd';
    const wrapper = new Wrapper({ command, terminal });

    const response = await wrapper.execute();

    expect(response).not.to.be.empty;
  });

  it('executes command with arguments', async function() {
    const command = 'ls';
    const wrapper = new Wrapper({ command, terminal });

    const response = await wrapper.execute('-al');

    expect(response).to.contain('total');
  });
});
