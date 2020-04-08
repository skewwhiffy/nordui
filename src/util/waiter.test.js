'use strict';
import Waiter from './waiter';
import { expect } from 'chai';

describe('Waiter', function() {
  it('waits', async function() {
    const milliseconds = 50;
    const waiter = new Waiter();
    const before = new Date().getTime();

    await waiter.wait(milliseconds);

    const after = new Date().getTime();
    expect(after - before).to.be.at.least(milliseconds);
  });
});
