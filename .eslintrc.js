module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: [
    'vue'
  ],
  rules: {
    'array-bracket-spacing': [ 2, 'always' ],
    'indent': [ 2, 2 ],
    'semi': [ 2, 'always' ],
    'space-before-function-paren': [ 2, 'never' ]
  }
}
