module.exports = {
    extends: ['airbnb', 'prettier', 'prettier/react'],
    singleQuote: true, // 使用单引号
    printWidth: 100, // 超过最大值换行
    htmlWhitespaceSensitivity: 'ignore',
    semi: false, // 结尾不用分号
    disableLanguages: ['vue'], // 不格式化vue文件，vue文件的格式化单独设置
    trailingComma: "es5", // 确保对象的最后一个属性后有逗号
    tabWidth: 2, //一个tab代表几个空格数，默认为2
    jsxBracketSameLine: true, // 在jsx中把'>' 不单独放一行
  }
  