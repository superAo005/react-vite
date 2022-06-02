import React, { PureComponent, Component, useState, useRef } from 'react'

import CodeEditor from './CodeEditor'
import TestEditor from './TestEditor'

// import CreateForm from '../Modal/CreateForm'
export default function RiskEditor(props) {
  const { value, onChange, onCompile, onTest, showHead = true,side=false } = props

  
  const [testEditorVisible, setTestEditorVisible] = useState(false)
  const [editor, setEditor] = useState()

  /**
   * 创建需求
   */
  const handleTest = (val, done) => {
    onTest(val, editor.getValue(), done)
  }

  const editorDidMount = (editor) => {
    setEditor(editor)
  }
  const handleTestModal = () => {
    setTestEditorVisible(true)
  }

  const handleTestChange = async () => {
    // console.log('testchange ', val)
  }

  return (
    <>
      <CodeEditor
        value={value}
        onCompile={onCompile}
        onChange={onChange}
        showHead={showHead}
        onTest={handleTestModal}
        editorDidMount={editorDidMount}
        side={side}></CodeEditor>
      {/* <CodeEditor showHead={true} side={false}></CodeEditor> */}

      <TestEditor
        testEditorVisible={testEditorVisible}
        setTestEditorVisible={setTestEditorVisible}
        onChange={handleTestChange}
        onTest={handleTest}></TestEditor>
    </>
  )
}
