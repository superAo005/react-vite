import { ConfigEnv, UserConfigExport } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import styleImport, { AntdResolve } from 'vite-plugin-style-import'
// import basicSsl from '@vitejs/plugin-basic-ssl'

// import vitePluginImp from 'vite-plugin-imp'

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
        {
          find: /^@babel\/runtime-corejs3\/core-js-stable$/,
          replacement: path.resolve(path.resolve(__dirname), 'node_modules/core-js-pure/es'),
        },
        {
          find: /^@babel\/runtime-corejs3\/core-js-stable\/json\/stringify$/,
          replacement: path.resolve(
            path.resolve(__dirname),
            'node_modules/core-js-pure/es/json/stringify'
          ),
        },
        // {
        //   find: /^@babel\/runtime-corejs3$/,
        //   replacement: path.resolve(path.resolve(__dirname), 'node_modules/core-js-pure/es'),
        // },
        // {
        //   find: /^@material-ui\/pickers$/,
        //   replacement: resolve(__dirname, "./node_modules/@material-ui/pickers/esm"),
        // }
        // {
        //   find: '@babel/runtime-corejs3/core-js-stable/json/stringify',
        //   replacement: 'SOME_PACKAGE_NAME/dist/xxx.es.js',
        // },
      ],
    },

    plugins: [
      // basicSsl(),
      react(),
      // monacoEditorPlugin(),
      viteMockServe({
        // default
        mockPath: 'mock',
        localEnabled: command === 'serve',
      }),

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
        resolves: [AntdResolve()],
        // libs: [
        //   {
        //     libraryName: 'antd',
        //     esModule: true,
        //     resolveStyle: (name) => {
        //       return `antd/es/${name}/style/index`
        //     },
        //   },
        // ],
      }),
    ],
    build: {
      target: ['es2018', 'chrome86'],
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
      devSourcemap: true,
    },
    server: {
      port: 3005, // 你需要定义的端口号
      // "preinstall": "npx only-allow pnpm",
      // https: true,
      proxy: {
        '/api/': {
          target: 'http://39.105.10.134:8999',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    optimizeDeps: {
      include: [
        'react-router-dom',
        'axios',
        'react-redux',
        'react',
        'react-dom',
        'redux-persist',
        'lodash-es',
        'spark-md5',
      ],
    },
  }
}
// @babel/runtime-corejs3/core-js-stable/json/stringify
