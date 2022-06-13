import { e } from 'dist/assets/react.da867d6c'

const completioncss = [
  {
    label: '####css11',
    // kind: 0,
    insertText: '##css test1()',
    detail: '看看详情是啥效果',
    documentation: '{\n\t"dependencies": {\n\t\t\n\t}\n}\n',
    //   insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: '##css21',
    //   kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'Test2',
    description: '2.1',
  },
  {
    label: '##css41',
    kind: 14,
    insertText: 'Test3',
    description: '3.1, 3.2, 3.3',
  },
  {
    label: '##css31',
    //   kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'Test4',
    description: '4.1',
    //   insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: '##css51',
    //   kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'Test5',
    description: '5.1',
    //   insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: '##css61',
    insertText: 'Test6',
    description: '6.1',
    //   insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
]

const completion2 = [
  {
    label: '@@css11',
    // kind: 0,
    insertText: '@@css test1()',
    detail: '看看详情是啥效果',
    documentation: '{\n\t"dependencies": {\n\t\t\n\t}\n}\n',
    //   insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: '@@css21',
    //   kind: monaco.languages.CompletionItemKind.Function,
    insertText: '@@css21',
    description: '2.1',
  },
  {
    label: '@@css41',
    kind: 14,
    insertText: '@@css41',
    description: '3.1, 3.2, 3.3',
  },
  {
    label: '@@css31',
    //   kind: monaco.languages.CompletionItemKind.Function,
    insertText: '@@css31',
    description: '4.1',
    //   insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: '@@css51',
    //   kind: monaco.languages.CompletionItemKind.Function,
    insertText: '@@css51',
    description: '5.1',
    //   insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
  {
    label: '@@css61',
    insertText: '@@css61',
    description: '6.1',
    //   insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  },
]
export default [
  {
    url: '/api/intellisense',
    method: 'get',
    response: (req) => {
      const word = req.query.word
      console.log({ word: req.query.word })
      if (word.startsWith('##')) {
        return {
          code: 0,
          msg: '请求成功',
          data: completioncss,
        }
      } else if (word.startsWith('@@')) {
        return {
          code: 0,
          msg: '请求成功',
          data: completion2,
        }
      } else {
        return {
          code: 0,
          msg: '请求成功',
          data: [],
        }
      }
    },
  },
]
