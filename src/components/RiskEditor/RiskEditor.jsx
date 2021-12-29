import { useEffect, useRef, useState } from 'react'

import { List } from 'antd'

import './index.css'
// -- Monaco Editor Imports --
import * as monaco from 'monaco-editor'
// import styles from 'monaco-editor/min/vs/editor/editor.main.css'
// import 'monaco-editor/min/vs/editor/editor.main.css'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}

// 编辑器的选项
const editor_option = {
  automaticLayout: false, // 自适应布局
  scrollBeyondLastLine: true, // 取消代码后面空白
  // fixedOverflowWidgets: true, // 超出编辑器大小的使用fixed属性显示
  language: 'java',
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line',
  fixedOverflowWidgets: false, // 超出编辑器大小的使用fixed属性显示
  theme: 'vs-light',
  wordWrap: true, //折行展示
  //   minimap: {
  //     enabled: false, // 不要小地图
  //   },
}

export default function CodeEditor(props) {
  const [editor, setEditor] = useState(null)
  const editor_ref = useRef(null)
  const { options, value } = props
  const mergeOptions = Object.assign({}, editor_option, options)
  const editorDidMount = (editor) => {
    editor.onDidChangeModelContent((event) => {
      props?.onChange(editor.getValue(), event)
    })
    // props.
    props?.editorDidMount(editor, monaco)
  }
  useEffect(() => {
    editor?.dispose()
    const editorInstance = monaco.editor.create(
      document.querySelector('#monaco_editor'),
      {
        value,
        ...mergeOptions,
      }
      // {
      //   storageService: {
      //     /* eslint-disable */
      //     get() {},
      //     remove() {},
      //     getBoolean(key) {
      //       return true
      //     },
      //     getNumber(key) {
      //       return 0
      //     },
      //     store() {},
      //     onWillSaveState() {},
      //     onDidChangeStorage() {},
      //     /* eslint-enable */
      //   },
      // }
    )

    setEditor(editorInstance)

    // console.log(editorInstance.getActions())
    // console.log(editorInstance)
    editorDidMount(editorInstance)
    return () => {
      editor_ref.current = null
      editor?.dispose()
      console.log('卸载')
    }
  }, [])

  const changeInsert = (val) => {
    if (editor) {
      let selection = editor.getSelection()
      editor.executeEdits(null, [
        {
          range: selection,
          text: `$!{${val}}` || `${Math.random()}\n`,
          forceMoveMarkers: true,
        },
      ])
    }
  }

  return (
    <>
      <div id="monaco_editor_container" className={props.className}>
        <div id="monaco_editor" style={{ flex: 1 }} ref={editor_ref}></div>

        <div className="side_container">
          <List
            size="small"
            bordered
            dataSource={props.listSource}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a
                    key="list-insert"
                    onClick={() => {
                      changeInsert(item)
                    }}>
                    插入
                  </a>,
                ]}>
                {item}
              </List.Item>
            )}
          />
        </div>
      </div>
    </>
  )
}
