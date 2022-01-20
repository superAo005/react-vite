import { ConfigEnv, UserConfigExport } from 'vite'
// import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import * as path from 'path'
import styleImport from 'vite-plugin-style-import'

import vitePluginImp from 'vite-plugin-imp'

// import usePluginImport from 'vite-plugin-importer'

// import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import { viteMockServe } from 'vite-plugin-mock'
import { dependencies } from './package.json'

const reactVendorPackages = ['react', 'react-dom', 'react-router-dom']
const reduxVendorPackages = ['@reduxjs/toolkit', 'react-redux']

// 分包
function renderChunks(deps: Record<string, string>) {
  let chunks = {}
  Object.keys(deps).forEach((key) => {
    if (reactVendorPackages.includes(key)) return
    if (reduxVendorPackages.includes(key)) return
    chunks[key] = [key]
  })
  return chunks
}
// const uat = 'http://idata.fat4628.qa.nt.ctripcorp.com'

export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    resolve: {
      // alias: {
      //   '@': path.resolve(__dirname, './src'),
      // },
      alias: [
        {
          find: '@',
          replacement: path.resolve(path.resolve(__dirname), 'src'),
        },
        {
          find: '~antd',
          replacement: path.resolve(path.resolve(__dirname), 'node_modules/antd'),
        },
      ],
    },

    plugins: [
      // reactRefresh(),
      react(),
      // monacoEditorPlugin(),
      viteMockServe({
        // default
        mockPath: 'mock',
        localEnabled: command === 'serve',
      }),
      // usePluginImport({
      //   libraryName: 'antd',
      //   libraryDirectory: 'es',
      //   style: true,
      // }),
      // vitePluginImp({
      //   libList: [
      //     {
      //       libName: 'antd',
      //       // style: (name) => {
      //       //   if (/CompWithoutStyleFile/i.test(name)) {
      //       //     // This will not import any style file
      //       //     return false
      //       //   }
      //       //   if (name === 'col' || name === 'row') {
      //       //     return 'antd/lib/style/index.css'
      //       //   }
      //       //   return `antd/es/${name}/style/index.css`
      //       // },

      //       style: (name) => `antd/es/${name}/style/css.js`,
      //     },
      //   ],
      // }),
      styleImport({
        libs: [
          {
            libraryName: 'antd',
            esModule: true,
            resolveStyle: (name) => {
              return `antd/es/${name}/style/index`
            },
          },
        ],
      }),
      // vitePluginImp({
      //   libList: [
      //     {
      //       libName: 'antd',
      //       style: (name) => {
      //         const less = fs.existsSync(
      //           path.resolve(__dirname, `node_modules/antd/es/${name}/style/index.less`)
      //         )
      //         if (less) {
      //           return `antd/es/${name}/style/index.less`
      //         } else {
      //           const css = fs.existsSync(
      //             path.resolve(__dirname, `node_modules/antd/es/${name}/style/css.js`)
      //           )
      //           if (css) {
      //             return `antd/es/${name}/style/css.js`
      //           } else {
      //             return false
      //           }
      //         }
      //       },
      //       libDirectory: 'es',
      //     },
      //   ],
      // }),
    ],
    build: {
      target: 'es2018',
      // do not set it as the context-path (this app uses "static")
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            react: reactVendorPackages,
            redux: reduxVendorPackages,
            ...renderChunks(dependencies),
          },
        },
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
    server: {
      port: 3005, // 你需要定义的端口号
      // "preinstall": "npx only-allow pnpm",

      // proxy: {
      //   '/api/': {
      //     target: uat,
      //     changeOrigin: true,
      //     secure: false,
      //   },
      // },
    },
  }
}
