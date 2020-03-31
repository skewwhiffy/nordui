// Main config
module.exports = {
  env: {
    browser: false,
    commonjs: true,
    mocha: true
  },
  extends: [
    'plugin:mocha/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019
  },
  plugins: [
    'mocha'
  ],
  rules: {
    'array-bracket-spacing': [ 2, 'always' ],
    indent: [ 2, 2, {
      SwitchCase: 1
    } ],
    semi: [ 2, 'always' ],
    'space-before-function-paren': [ 2, 'never' ]
  },
  overrides: [ {
    files: [ '*.test.js' ],
    rules: {
      'no-unused-expressions': 'off'
    }
  } ]
};
