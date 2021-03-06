// Main config
module.exports = {
  env: {
    browser: false,
    commonjs: true,
    mocha: true
  },
  extends: [
    'plugin:vue/recommended',
    'plugin:mocha/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  ignorePatterns: [
    'dist_electron'
  ],
  parser: 'vue-eslint-parser',
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
    'space-before-function-paren': 0,
    'vue/max-attributes-per-line': 'off'
  },
  overrides: [ {
    files: [ '*.test.js' ],
    rules: {
      'no-unused-expressions': 'off',
      'no-unused-vars': 'warn',
      'mocha/no-setup-in-describe': 'warn'
    }
  } ]
};
