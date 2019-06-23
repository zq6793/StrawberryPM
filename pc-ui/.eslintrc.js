// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // "off"或者0    //关闭规则关闭
    // "warn"或者1    //在打开的规则作为警告（不影响退出代码）
    // "error"或者2    //把规则作为一个错误（退出代码触发时为1）
    'camelcase': 0, // 对未使用驼峰法命名的进行警告
    'eqeqeq': 0, // 对未使用全等的进行警告
    'no-unused-vars': [2, {
      'vars': 'all',
      'args': 'none',
    }],
    'no-multiple-empty-lines': [1, {'max': 2}],//空行最多不能超过2行
    'no-nested-ternary': 2,//禁止使用嵌套的三目运算
    'comma-dangle': [2, 'only-multiline'],// 对象字面量项尾不能有逗号
    'no-unreachable': 2,//不能有无法执行的代码
    'no-var': 2,//禁用var，用let和const代替
    'handle-callback-err': 0,
    'standard/object-curly-even-spacing': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'no-eval': 0,
    'space-before-function-paren': 0,

    // TODO
    // 'no-unused-vars': 0,
    // 'no-self-assign': 0,
    // 'no-undef': 0,
    
    // 'no-sequences': 0,
    // 'no-dupe-keys': 0,
    // 'no-useless-escape': 0,
    // 'no-mixed-operators': 0,
    'no-unused-expressions': 0,
    // 'vue/no-dupe-keys': 0,
    
    'vue/valid-v-for': 0,
    'vue/require-v-for-key': 0,
    'vue/valid-v-model': 0,
    'vue/valid-template-root': 0,
    // END TODO

    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [
      2, 
      {
        "x-invalid-end-tag": false 
      }]
  }
}
