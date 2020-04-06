'use strict';
import Wrapper from './command.wrapper';

describe('Command wrapper', function() {
  it('executes command without arguments', async function() {
    const wrapper = new Wrapper('pwd');

    const response = await wrapper.execute();

    console.log(response);
  });
});
