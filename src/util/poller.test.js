'use strict';
import Poller from './poller';
import DummyWaiter from './dummy.waiter';
import RealWaiter from './waiter';
import { expect } from 'chai';

describe('Poller', function() {
  let realWaiter;
  let waiter;

  beforeEach(function() {
    realWaiter = new RealWaiter();
    waiter = new DummyWaiter();
  });

  it('polls straight away', async function(done) {
    const poll = () => done();
    const poller = new Poller({
      waiter, poll
    });

    poller.poll();
  });

  it('polls repeatedly', async function() {
    let count = 0;
    const poll = () => {
      count++;
    };
    const waiter = new DummyWaiter();
    const poller = new Poller({
      waiter, poll
    });

    poller.poll();

    expect(count).to.equal(1);
    waiter.elapse();
    for (let i = 0; i < 10; i++) {
      if (count === 2) {
        return;
      }
      await realWaiter.wait(10);
    }
    expect.fail('Count should reach 2');
  });
});
