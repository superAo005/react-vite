#### 项目说明

```
技术栈: webpack5 + React18 + TS

工程化: eslint + prettier + husky + git hooks

支持图片、less、sass、fonts、数据资源(JSON、csv、tsv等)、Antd按需加载以及主题

支持热更新、资源压缩、代码分离（动态导入、懒加载等）、缓存、devServer
```
## 启动

```js
npm run install //安装依赖
npm run dev //启动应用
```
#### 目录说明
```js

├── dist                                // 默认的 build 输出目录
├── .husky                              // pre-commit hook
├── webpack.config.js                   // 全局配置文件及webpack配置文件
├── test                                // 测试目录
└── src                                 // 源码目录
    ├── assets                          // 公共的文件（如image、css、font等）
    ├── components                      // 项目组件
    ├── constants                       // 常量/接口地址等
    |── services                        // 接口
    ├── routes                          // 路由
    ├── utils                           // 工具库
    ├── pages                           // 页面模块
        ├── Home                        // Home模块，建议组件统一大写开头
        ├── ...
    ├── App.tsx                         // react顶层文件
    ├── typing                          // ts类型文件
├── .editorconfig                       // IDE格式规范
├── .eslintignore                       // eslint忽略
├── .eslintrc                           // eslint配置文件
├── .gitignore                          // git忽略
├── .prettierrc                         // prettierc配置文件
├── .babelrc                         // babel配置文件
├── LICENSE.md                          // LICENSE
├── package.json                        // package
├── README.md                           // README
├── tsconfig.json                       // typescript配置文件
```
#### 依赖说明
```js
"dependencies": {
    "antd": "^4.22.4", // 懂得都懂
    "react": "^18.2.0", // 懂得都懂
    "react-dom": "^18.2.0" // 懂得都懂
  },
  "devDependencies": {
    // babel全家桶
    "@babel/core": "^7.18.10",
    "@babel/plugin-proposal-class-properties": "^7.18.6", // React class支持
    "@babel/plugin-transform-runtime": "^7.18.10", // 抽离提取 Babel的注入代码，防止重复加载，减小体积
    "@babel/preset-env": "^7.18.10", // 提供的预设，允许我们使用最新的JavaScript
    "@babel/preset-react": "^7.18.6", // react支持
      
    // ts类型检查
    "@types/node": "^18.6.4",
    "@types/react": "^18.0.15",
    "@types/react-dom": "^18.0.6",
    // @types 开头的是对应包的 TypeScript 类型声明
    "@typescript-eslint/eslint-plugin": "^5.33.0",
    "@typescript-eslint/parser": "^5.33.0",
      
    // webpack loader：解析对应文件
    "csv-loader": "^3.0.5",
    "sass-loader": "^13.0.2",
    "xml-loader": "^1.2.1",
    "ts-loader": "^9.3.1",
    "less-loader": "^11.0.0",
      
    // eslint全家桶
    "eslint": "^8.21.0",
    "eslint-config-ali": "^14.0.1", // ali前端规约
    "eslint-config-prettier": "^8.5.0", // 关闭所有不必要或可能与[Prettier]冲突的规则
    "eslint-import-resolver-typescript": "^3.4.0", // 添加 ts 语法支持  eslint-plugin-import
    "eslint-plugin-import": "^2.26.0", // ES6+  import/export 语法支持
    "eslint-plugin-prettier": "^4.2.1", // prettier语法支持
    "eslint-plugin-react": "^7.30.1", // react语法支持
    "eslint-plugin-react-hooks": "^4.6.0", // hooks语法支持
    "eslint-webpack-plugin": "^3.2.0", 
    
    // webpack plugin
    "fork-ts-checker-webpack-plugin": "^7.2.13", // 避免webpack中检测ts类型
    "html-webpack-plugin": "^5.5.0", // 简化HTML文件的创建 ，配合webpack包含hash的bundle使用
    "mini-css-extract-plugin": "^2.6.1", // css拆分
    "optimize-css-assets-webpack-plugin": "^6.0.1", // css压缩
    "terser-webpack-plugin": "^5.3.3", // 使用 terser 压缩 js （terser 是一个管理和压缩 ES6+ 的工具）
    "webpack-bundle-analyzer": "^4.5.0", // webpack打包体积可视化分析
    "webpack-cli": "^4.10.0", // 提供脚手架命令
    "webpack": "^5.74.0", // webpack引擎
    "webpack-dev-server": "^4.9.3", // 开发环境的live server
     
    // 工具
    "husky": "^8.0.1", // 自动配置 Git hooks 钩子
    "less": "^4.1.3", // css类型
    "sass": "^1.54.3", // css类型
    "typescript": "^4.7.4", // ts
    "lint-staged": "^13.0.3", // 对暂存的git文件运行linter
    
    // prettier 格式化
    "prettier": "^2.7.1",
    "pretty-quick": "^3.1.3", // 在更改的文件上运行 prettier
  }
  ```