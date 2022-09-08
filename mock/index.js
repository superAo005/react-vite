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
  {
    url: '/api/getCreator',
    method: 'get',
    response: () => {
      return {
        code: 0,
        msg: '请求成功',
        data: { a: 1, b: 2, c: 3 },
      }
    },
  },
  {
    url: '/api/hnbc/psas/auth/to/login',
    method: 'POST',
    response: () => {
      return {
        res: 1,
        data: {
          cellphone_number: '18888888888',
          login_account: 'superadmin',
          real_name: '管理员',
          roles: ['user:view', 'role:view'],
          token:
            'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJobmJjLmNvbSIsInN1YiI6IjE4ODg4ODg4ODg4IiwiaWF0IjoxNjQ1OTM4ODMxLCJhdWQiOiIxODg4ODg4ODg4OCIsImV4cCI6MTY0NTk1NjgzMSwiWFVJRCI6IjMyNGNjZTA1ZGY2MTQwN2M5MGRmZjEyZmQ1OGEwNTgxIn0.OxVEY8aWM9AbcYq90V6mkMlAoCErZTtdUrcIkRv9ssY',
          role_id: '0001ec6b8d534e8eb075fb6a0a590001',
        },
      }
    },
  },
  {
    url: '/api/hnbc/psas/user/list/query',
    method: 'POST',
    response: () => {
      return {
        res: 1,
        data: {
          data: [
            {
              uid: '324cce05df61407c90dff12fd58a0581',
              uid2: '324cce05df61407c90dff12fd58a0581',
              login_account: 'superadmin',
              real_name: '管理员',
              mobile: '18888888888',
              status: 0,
              role_id: '0001ec6b8d534e8eb075fb6a0a590001',
              role_name: '超级管理员',
              create_time: '2022-02-13 21:51:28',
              update_time: '2022-02-13 22:51:52',
            },
            {
              uid: '715a7e65d5154586bd9c55a16525a745',
              login_account: 'zjj',
              real_name: '张专家',
              mobile: '14519008765',
              status: 0,
              role_id: '0003dd6b8d534e8eb075fb6a0a590003',
              role_name: '专家',
              create_time: '2022-02-13 22:49:22',
              update_time: '2022-02-13 22:49:22',
            },
            {
              uid: '9b55b612dcaf46d9aed026a98543ac9b',
              login_account: 'liuws',
              real_name: '刘完山',
              mobile: '16789098765',
              status: 0,
              role_id: '0003dd6b8d534e8eb075fb6a0a590003',
              role_name: '专家',
              create_time: '2022-02-13 22:50:38',
              update_time: '2022-02-13 22:50:38',
            },
            {
              uid: '9e80dd30845548359da80a92608c0a40',
              login_account: 'admin',
              real_name: '平台用户1',
              mobile: '15512341234',
              status: 0,
              role_id: '0002fc9b8d534e8eb075eb6a0a590002',
              role_name: '平台用户',
              create_time: '2022-02-13 22:48:26',
              update_time: '2022-02-17 19:32:15',
            },
            {
              uid: '9f3abb7198c0431ca1c2bf0f43477c58',
              login_account: 'maqing',
              real_name: '马庆',
              mobile: '15478652341',
              status: 0,
              role_id: '0003dd6b8d534e8eb075fb6a0a590003',
              role_name: '专家',
              create_time: '2022-02-13 22:51:09',
              update_time: '2022-02-13 22:51:09',
            },
          ],
          page_info: { cur_page: 1, total_data: 5, max_page: 1, page_size: 10 },
        },
      }
    },
  },
]
