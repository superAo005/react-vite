import { useEffect, useRef, useState } from 'react'

import { List, Button } from 'antd'

import getIntelliSense from './api'

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
import useUpdate from './hooks/useUpdate'

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
  // theme: 'vs-dark',
  wordWrap: true, //折行展示
  //   minimap: {
  //     enabled: false, // 不要小地图
  //   },
}

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
function getCode() {
  return [
    `import java.util.Random ;

public class Example {
public static void main (String[] args){
 // Generate a random number between 1-100. (See generateRandomNumber method.)
 int random = generateRandomNumber(100);

 // Output generated number.
 System.out.println("Generated number: " + random + "\n");

 // Loop between 1 and the number we just generated.
 for (int i=1; i<=random; i++){
   // If i is divisible by both 3 and 5, output "FizzBuzz".
   if (i % 3 == 0 && i % 5 == 0){
     System.out.println("FizzBuzz");
   }
   // If i is divisible by 3, output "Fizz"
   else if (i % 3 == 0){
     System.out.println("Fizz");
   }
   // If i is divisible by 5, output "Buzz".
   else if (i % 5 == 0){
     System.out.println("Buzz");
   }
   // If i is not divisible by either 3 or 5, output the number.
   else {
     System.out.println(i);
   }
 }
}

/**
 Generates a new random number between 0 and 100.
 @param bound The highest number that should be generated.
 @return An integer representing a randomly generated number between 0 and 100.
*/
private static int generateRandomNumber(int bound){
 // Create new Random generator object and generate the random number.
 Random randGen = new Random();
 int randomNum = randGen.nextInt(bound);

 // If the random number generated is zero, use recursion to regenerate the number until it is not zero.
 if (randomNum < 1){
   randomNum = generateRandomNumber(bound);
 }

 return randomNum;
}
}`,
  ].join('\n')
}

// '[Sun Mar 7 16:02:00 2004] [notice] @@Apache/1.3.29 (Unix) configured -- resuming normal operations',
// '[Sun Mar 7 16:02:00 2004] @@query_new_flow_data_002() [info] Server built: Feb 27 2004 13:56:37',
// '[Sun Mar 7 16:02:00 2004] **query_new_flow_data_002() [info] Server built: Feb 27 2004 13:56:37',

export default function CodeEditor(props) {
  const [editor, setEditor] = useState(null)
  const editor_ref = useRef(null)
  const { options, value } = props
  const mergeOptions = Object.assign({}, editor_option, options)
  const editorDidMount = (editor) => {
    editor.onDidChangeModelContent((event) => {
      props?.onChange && props?.onChange(editor.getValue(), event)
      // editor.trigger('keyboard', 'editor.action.triggerSuggest', {})
      setTimeout(() => {
        editor.trigger('keyboard', 'editor.action.triggerSuggest', {})
      }, 200) // 延迟执行))
    })
    // props.
    props?.editorDidMount && props?.editorDidMount(editor, monaco)
  }
  monaco.languages.setLanguageConfiguration('java', {
    // wordPattern: /[a-zA-Z]+|([^`~!@#%^&*()-=+[{]}\|;:'",.<>\/?\s]+)/,
    wordPattern: /[a-zA-Z$*@#]+/,
  })
  monaco.languages.setMonarchTokensProvider('java', {
    defaultToken: '',
    tokenPostfix: '.java',
    keywords: [
      'abstract',
      'continue',
      'for',
      'new',
      'switch',
      'assert',
      'default',
      'goto',
      'package',
      'synchronized',
      'boolean',
      'do',
      'if',
      'private',
      'this',
      'break',
      'double',
      'implements',
      'protected',
      'throw',
      'byte',
      'else',
      'import',
      'public',
      'throws',
      'case',
      'enum',
      'instanceof',
      'return',
      'transient',
      'catch',
      'extends',
      'int',
      'short',
      'try',
      'char',
      'final',
      'interface',
      'static',
      'void',
      'class',
      'finally',
      // 'long',
      'strictfp',
      'volatile',
      'const',
      'float',
      'native',
      'super',
      'while',
      'true',
      'false',
    ],
    operators: [
      '=',
      '>',
      '<',
      '!',
      '~',
      '?',
      ':',
      '==',
      '<=',
      '>=',
      '!=',
      '&&',
      '||',
      '++',
      '--',
      '+',
      '-',
      '*',
      '/',
      '&',
      '|',
      '^',
      '%',
      '<<',
      '>>',
      '>>>',
      '+=',
      '-=',
      '*=',
      '/=',
      '&=',
      '|=',
      '^=',
      '%=',
      '<<=',
      '>>=',
      '>>>=',
    ],
    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
    tokenizer: {
      root: [
        [/\[error.*/, 'custom-error'],
        [/\[notice.*/, 'custom-notice'],
        [/\[info.*/, 'custom-info'],
        [/[@]{2}[a-z][a-z0-9_]{2,63}/, 'custom-@@'],
        [/[*]{2}[a-z][a-z0-9_]{2,63}/, 'custom-@@'],
        [/[#]{2}[a-z][a-z0-9_]{2,63}/, 'custom-@@'],
        [/[$]{1}[a-z][a-z0-9_]{2,63}/, 'custom-@@'],
        [/\[[a-zA-Z 0-9:]+\]/, 'custom-date'],
        // identifiers and keywords
        [
          /[a-zA-Z_$][\w$]*/,
          {
            cases: {
              '@keywords': { token: 'keyword.$0' },
              '@default': 'identifier',
            },
          },
        ],
        // whitespace
        { include: '@whitespace' },
        // delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [
          /@symbols/,
          {
            cases: {
              '@operators': 'delimiter',
              '@default': '',
            },
          },
        ],
        // @ annotations.
        // [/@\s*[a-zA-Z_\$][\w\$]*/, 'annotation'],
        // numbers
        [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, 'number.float'],
        [/0[xX](@hexdigits)[Ll]?/, 'number.hex'],
        [/0(@octaldigits)[Ll]?/, 'number.octal'],
        [/0[bB](@binarydigits)[Ll]?/, 'number.binary'],
        [/(@digits)[fFdD]/, 'number.float'],
        [/(@digits)[lL]?/, 'number'],
        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],
        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string'],
        // characters
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
        [/'/, 'string.invalid'],
      ],
      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@javadoc'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],
      comment: [
        [/[^\/*]+/, 'comment'],
        // [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
        // [/\/\*/,    'comment.invalid' ],    // this breaks block comments in the shape of /* //*/
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment'],
      ],
      //Identical copy of comment above, except for the addition of .doc
      javadoc: [
        [/[^\/*]+/, 'comment.doc'],
        // [/\/\*/, 'comment.doc', '@push' ],    // nested comment not allowed :-(
        [/\/\*/, 'comment.doc.invalid'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc'],
      ],
      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop'],
      ],
    },
  })

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme('myCoolTheme', {
    base: 'vs-dark',
    inherit: false,

    rules: [
      { token: 'custom-info', foreground: '808080' },
      { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
      { token: 'custom-notice', foreground: 'FFA500' },
      { token: 'custom-@@', foreground: '569CD6' },
      { token: 'custom-date', foreground: '008800' },
      { token: '', foreground: 'D4D4D4', background: '1E1E1E' },
      { token: 'invalid', foreground: 'f44747' },
      { token: 'emphasis', fontStyle: 'italic' },
      { token: 'strong', fontStyle: 'bold' },
      { token: 'variable', foreground: '74B0DF' },
      { token: 'variable.predefined', foreground: '4864AA' },
      { token: 'variable.parameter', foreground: '9CDCFE' },
      { token: 'constant', foreground: '569CD6' },
      { token: 'comment', foreground: '608B4E' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'number.hex', foreground: '5BB498' },
      { token: 'regexp', foreground: 'B46695' },
      { token: 'annotation', foreground: 'cc6666' },
      { token: 'type', foreground: '3DC9B0' },
      { token: 'delimiter', foreground: 'DCDCDC' },
      { token: 'delimiter.html', foreground: '808080' },
      { token: 'delimiter.xml', foreground: '808080' },
      { token: 'tag', foreground: '569CD6' },
      { token: 'tag.id.pug', foreground: '4F76AC' },
      { token: 'tag.class.pug', foreground: '4F76AC' },
      { token: 'meta.scss', foreground: 'A79873' },
      { token: 'meta.tag', foreground: 'CE9178' },
      { token: 'metatag', foreground: 'DD6A6F' },
      { token: 'metatag.content.html', foreground: '9CDCFE' },
      { token: 'metatag.html', foreground: '569CD6' },
      { token: 'metatag.xml', foreground: '569CD6' },
      { token: 'metatag.php', fontStyle: 'bold' },
      { token: 'key', foreground: '9CDCFE' },
      { token: 'string.key.json', foreground: '9CDCFE' },
      { token: 'string.value.json', foreground: 'CE9178' },
      { token: 'attribute.name', foreground: '9CDCFE' },
      { token: 'attribute.value', foreground: 'CE9178' },
      { token: 'attribute.value.number.css', foreground: 'B5CEA8' },
      { token: 'attribute.value.unit.css', foreground: 'B5CEA8' },
      { token: 'attribute.value.hex.css', foreground: 'D4D4D4' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.sql', foreground: 'FF0000' },
      { token: 'keyword', foreground: '569CD6' },
      { token: 'keyword.flow', foreground: 'C586C0' },
      { token: 'keyword.json', foreground: 'CE9178' },
      { token: 'keyword.flow.scss', foreground: '569CD6' },
      { token: 'operator.scss', foreground: '909090' },
      { token: 'operator.sql', foreground: '778899' },
      { token: 'operator.swift', foreground: '909090' },
      { token: 'predefined.sql', foreground: 'FF00FF' },
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4',
      'editor.inactiveSelectionBackground': '#3A3D41',
      'editorIndentGuide.background': '#404040',
      'editorIndentGuide.activeBackground': '#707070',
      'editor.selectionHighlightBackground': '#ADD6FF26',
    },
  })
  useEffect(() => {
    editor?.dispose()
    const editorInstance = monaco.editor.create(
      document.querySelector('#monaco_editor'),
      {
        value: getCode(),
        ...mergeOptions,
        theme: 'myCoolTheme',
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
    // monaco.languages.registerCompletionItemProvider('java', {
    //   triggerCharacters: ['*'],

    //   provideCompletionItems: (model, position) => {
    //     const wordBeforePosition = model.getWordUntilPosition({
    //       lineNumber: position.lineNumber,
    //       column: position.column - 1,
    //     })
    //     const wordUntilPosition = model.getWordUntilPosition(position)

    //     if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
    //       const keywords = completionTriggerKeywords

    //       const suggestions = keywords.map((id) => ({
    //         label: id.label,
    //         kind: id.kind,
    //         documentation: id.documentation,
    //         insertText: id.insertText,
    //         detail: id.detail,
    //         insertTextRules: id.insertTextRules,
    //         range: {
    //           startLineNumber: position.lineNumber,
    //           startColumn: wordUntilPosition.startColumn,
    //           endLineNumber: position.lineNumber,
    //           endColumn: wordUntilPosition.endColumn - 1,
    //         },
    //       }))
    //       return { suggestions }
    //     }
    //   },
    // })

    const ins = monaco.languages.registerCompletionItemProvider('java', {
      triggerCharacters: ['@'],
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
        if (wordUntilPosition.word.trim().length > 2) {
          return getIntelliSense(wordUntilPosition.word).then((res) => {
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
        } else {
          return { suggestions: [] }
        }
      },
    })
    console.log({
      ins,
    })
    // console.log(editorInstance.getActions())
    // console.log(editorInstance)
    editorDidMount(editorInstance)
    return () => {
      editor_ref.current = null
      editor?.dispose()
      ins?.dispose()
      console.log('卸载')
    }
  }, [])

  useEffect(() => {
    console.log('useUpdate', value)

    // if (value !== editor.getValue()) {
    //   editor.executeEdits('', [
    //     {
    //       range: editor.getModel().getFullModelRange(),
    //       text: value,
    //       forceMoveMarkers: true,
    //     },
    //   ])
    //   editor.pushUndoStop()
    // }
    if (editor) {
      editor.trigger('keyboard', 'editor.action.triggerSuggest', {})
    }
    // editor.trigger('keyboard', 'editor.action.triggerSuggest', {})
  }, [value])

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

  const handletriggerSuggest = () => {
    if (editor) {
      editor.trigger('keyboard', 'editor.action.triggerSuggest', {})
    }
  }
  return (
    <>
      <Button onClick={handletriggerSuggest}></Button>
      <Button type="primary" onClick={handletriggerSuggest}>
        handletriggerSuggest
      </Button>

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
