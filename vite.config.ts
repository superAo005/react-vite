import { ConfigEnv, UserConfigExport } from 'vite'
// import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react'

import vitePluginImp from 'vite-plugin-imp'
// import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import { viteMockServe } from 'vite-plugin-mock'

const path = require('path')

// const uat = 'http://idata.fat4628.qa.nt.ctripcorp.com'

export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2018',
      // do not set it as the context-path (this app uses "static")
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendors: ['@reduxjs/toolkit', 'react-redux'],
          },
        },
      },
    },
    server: {
      port: 3005, // 你需要定义的端口号
      // proxy: {
      //   '/api/': {
      //     target: uat,
      //     changeOrigin: true,
      //     secure: false,
      //   },
      // },
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
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            // style: (name) => {
            //   if (/CompWithoutStyleFile/i.test(name)) {
            //     // This will not import any style file
            //     return false
            //   }
            //   if (name === 'col' || name === 'row') {
            //     return 'antd/lib/style/index.css'
            //   }
            //   return `antd/es/${name}/style/index.css`
            // },

            style: (name) => `antd/es/${name}/style/css.js`,
          },
        ],
      }),
    ],
  }
}
