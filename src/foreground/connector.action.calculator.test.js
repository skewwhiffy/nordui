'use strict';
import Calculator from './connector.action.calculator';
import statuses from '../enum/status';
import actions from '../enum/connector.action';
import { expect } from 'chai';

describe('Connector action calculator', function() {
  let calculator;

  beforeEach(function() {
    calculator = new Calculator();
  });

  it('allows login when not logged in', function() {
    genericTest(statuses.NOT_LOGGED_IN, actions.login);
  });

  it('allows connect and logout when not connected', function() {
    genericTest(statuses.NOT_CONNECTED, actions.logout, actions.connect);
  });

  it('allows nothing when status is unknown', function() {
    const actionList = genericTest(statuses.UNKNOWN);

    expect(actionList).to.be.empty;
  });

  const genericTest = (status, ...actions) => {
    const actionList = calculator.getActions(status);

    actions.forEach(action => expect(actionList).to.include(action));

    return actionList;
  };
});
