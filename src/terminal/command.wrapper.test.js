'use strict';
import Wrapper from './command.wrapper';
import { expect } from 'chai';

describe('Command wrapper', function() {
  it('executes command without arguments', async function() {
    const wrapper = new Wrapper('pwd');

    const response = await wrapper.execute();

    expect(response).not.to.be.empty;
  });
});
