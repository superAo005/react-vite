import React, { useState, useEffect } from 'react'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { DomEditor } from '@wangeditor/editor'
export default function WangEditor(props) {
  const [editor, setEditor] = useState(null) // 存储 editor 实例

  //   // 模拟 ajax 请求，异步设置 html
  //   useEffect(() => {
  //     setTimeout(() => {
  //       setHtml('<p>hello&nbsp;<strong>world</strong>.</p>\n<p><br></p>')
  //     }, 1500)
  //   }, [])

  const toolbarConfig = {
    excludeKeys: [
      //   'headerSelect',
      'group-image', // 排除菜单组，写菜单组 key 的值即可
      'group-video',
      'insertTable',
      'codeBlock',
    ],
  }
  const editorConfig = {
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor
  useEffect(() => {
    const toolbar = DomEditor.getToolbar(editor)
    console.log({ toolbar })

    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100, marginTop: '15px' }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={props.value}
          onCreated={setEditor}
          onChange={(editor) => {
            props.onChange(editor.getHtml())
          }}
          mode="default"
          style={{ height: '500px' }}
        />
      </div>
    </>
  )
}
