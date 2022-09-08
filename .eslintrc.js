// _eslintrc_
module.exports =  {
  parser:  '@typescript-eslint/parser',  // ESlint Parser
  extends:  [
    'plugin:react/recommended',  // 从@eslint-plugin-react中选择推荐的规则
    'plugin:@typescript-eslint/recommended',  // 从@typescript-eslint/eslint-plugin选择推荐的规则
  ],
  parserOptions:  {
    ecmaVersion:  2018,  // 帮助转化最先进的ECMAScript功能
    sourceType:  'module',  // 允许imports的用法
    ecmaFeatures:  {
      jsx:  true,  // JSX兼容
    },
  },
  rules:  {
  },
  settings:  {
    react:  {
      version:  'detect',  // 告诉eslint-plugin-react自动检测最新版本的react
    },
  },
};