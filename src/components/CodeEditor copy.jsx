import { useEffect, useRef, useState } from 'react'

import { Button, InputNumber, Select } from 'antd'
// -- Monaco Editor Imports --
import * as monaco from 'monaco-editor'
// import styles from 'monaco-editor/min/vs/editor/editor.main.css'
// import 'monaco-editor/min/vs/editor/editor.main.css'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import getIntelliSense from './RiskEditor/api'

const { Option } = Select

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

// /https://microsoft.github.io/monaco-editor/api/enums/monaco.languages.CompletionItemKind.html
const completionTriggerKeywords = [
  {
    label: 'test1',
    kind: monaco.languages.CompletionItemKind.Method,
    insertText: 'function test1()',
    detail: '看看详情是啥效果',
    documentation: 'function test1()',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: 'Test2',
    kind: monaco.languages.CompletionItemKind.Interface,
    insertText: 'Test2',
    description: '2.1',
  },
  {
    label: 'Test3',
    kind: 14,
    insertText: 'Test3',
    description: '3.1, 3.2, 3.3',
  },
  {
    label: 'Test4',
    kind: monaco.languages.CompletionItemKind.Class,
    insertText: 'Test4',
    description: '4.1',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: 'Test5',
    kind: monaco.languages.CompletionItemKind.Enum,
    insertText: 'Test5',
    description: '5.1',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: 'Test6',
    kind: monaco.languages.CompletionItemKind.Event,
    insertText: 'Test6',
    description: '6.1',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
]
// 编辑器的选项
const editor_option = {
  // automaticLayout: true, // 自适应布局
  scrollBeyondLastLine: false, // 取消代码后面空白
  // fixedOverflowWidgets: true, // 超出编辑器大小的使用fixed属性显示
  theme: 'vs-dark',
  language: 'javascript',
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line',
  automaticLayout: false,
}
export default function CodeEditor(props) {
  const [editor, setEditor] = useState(null)
  const editor_ref = useRef(null)
  const { options, value } = props
  console.log('value')
  console.log(value)
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

    monaco.languages.registerCompletionItemProvider('java', {
      triggerCharacters: ['*'],

      provideCompletionItems: (model, position) => {
        const wordBeforePosition = model.getWordUntilPosition({
          lineNumber: position.lineNumber,
          column: position.column - 1,
        })
        const wordUntilPosition = model.getWordUntilPosition(position)

        if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
          const keywords = completionTriggerKeywords

          const suggestions = keywords.map((id) => ({
            label: id.label,
            kind: id.kind,
            documentation: id.documentation,
            insertText: id.insertText,
            detail: id.detail,
            insertTextRules: id.insertTextRules,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: wordUntilPosition.startColumn,
              endLineNumber: position.lineNumber,
              endColumn: wordUntilPosition.endColumn - 1,
            },
          }))
          return { suggestions }
        }
      },
    })
    setEditor(editorInstance)
    monaco.languages.setLanguageConfiguration('java', {
      wordPattern: /[a-zA-Z]+/,
    })
    monaco.languages.registerCompletionItemProvider('java', {
      triggerCharacters: ['ds.', '.'],
      provideCompletionItems: async (model, position) => {
        const { lineNumber, column } = position
        // 光标前文本
        const textBeforePointer = model.getValueInRange({
          startLineNumber: lineNumber,
          startColumn: 0,
          endLineNumber: lineNumber,
          endColumn: column,
        })

        // let res = await getIntelliSense()
        // console.log('resA')
        // console.log(res)
        if (['ds.'].includes(textBeforePointer.trim())) {
          return {
            suggestions: [
              {
                label: 'connection("")', //显示的提示名称
                insertText: 'connection("")', //选择后粘贴到编辑器中的文字
              },
              {
                label: 'query("","")',
                insertText: 'query("","")',
              },
            ],
          }
        }
        if (['ds.connection("").'].includes(textBeforePointer)) {
          return {
            suggestions: [
              {
                label: 'query("")',
                insertText: 'query("")',
              },
            ],
          }
        }
      },
    })

    monaco.languages.registerCompletionItemProvider('java', {
      triggerCharacters: ['css'],
      provideCompletionItems: (model, position, context, token) => {
        const wordBeforePosition = model.getWordUntilPosition({
          lineNumber: position.lineNumber,
          column: position.column - 1,
        })
        const wordUntilPosition = model.getWordUntilPosition(position)

        console.log(context)
        console.log(token)

        console.log('csstriggerCharacters')
        console.log('wordBeforePosition', wordBeforePosition)
        console.log(wordUntilPosition)
        return getIntelliSense().then((res) => {
          // console.log('res', res)
          const suggestions = res.map((id) => ({
            label: id.label,
            kind: id.kind || 1,
            documentation: id.documentation,
            insertText: id.insertText,
            detail: id.detail,
            insertTextRules: id.insertTextRules || 4,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: wordUntilPosition.startColumn,
              endLineNumber: position.lineNumber,
              endColumn: wordUntilPosition.endColumn - 1,
            },
          }))
          return { suggestions }
        })
      },
    })

    console.log(editorInstance.getActions())
    console.log(editorInstance)
    editorDidMount(editorInstance)
    return () => {
      editor_ref.current = null
      editor?.dispose()
      console.log('卸载')
    }
  }, [value])

  const changeUndo = () => {
    if (editor) {
      editor.trigger('keyboard', 'undo', null)
    }
  }

  const changeRedo = () => {
    if (editor) {
      editor.trigger('keyboard', 'redo', null)
    }
  }
  const changeInsert = () => {
    if (editor) {
      let selection = editor.getSelection()
      editor.executeEdits(null, [
        {
          range: selection,
          text: `${Math.random()}\n`,
          forceMoveMarkers: true,
        },
      ])
    }
  }

  const handleFontSize = (fontSize) => {
    if (editor) {
      editor.updateOptions({
        fontSize,
      })
    }
  }
  const handleThemeChange = (theme) => {
    if (editor) {
      monaco.editor.setTheme(theme)
    }
  }
  const handleLangeleChange = (language) => {
    console.log(language)
    console.log('language')
    if (editor) {
      monaco.editor.setModelLanguage(editor.getModel(), language)
    }
  }

  const handleFormat = () => {
    if (editor) {
      // editor.getAction("editor.action.formatDocument").run()
      editor.trigger('keyboard', 'editor.action.formatDocument', null)
    }
  }

  return (
    <>
      <div className="mt-6 mb-6">
        <Button className="mr-2 w-[100px]" type="primary" onClick={changeUndo}>
          undo 撤销
        </Button>
        <Button className="mr-2" type="primary" onClick={changeRedo}>
          changeRedo 恢复
        </Button>

        <Button className="mr-2" type="primary" onClick={changeInsert}>
          insert 插入
        </Button>
        <span className="mr-2">
          <InputNumber defaultValue={14} onChange={handleFontSize}></InputNumber>
        </span>

        <span className="mr-2">
          <Select defaultValue="java" style={{ width: 120 }} onChange={handleLangeleChange}>
            <Option value="java">java</Option>
            <Option value="javascript">javascript</Option>
          </Select>
        </span>
        <Select defaultValue="vs-light" style={{ width: 120 }} onChange={handleThemeChange}>
          <Option value="vs-light">vs-light</Option>
          <Option value="vs-dark">vs-dark</Option>
        </Select>
      </div>
      <div
        id="monaco_editor"
        className="h-[400px] w-[900px]"
        style={{ flex: 1, margin: 30 }}
        ref={editor_ref}></div>
    </>
  )
}
