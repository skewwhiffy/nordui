'use strict';

export default class {
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
