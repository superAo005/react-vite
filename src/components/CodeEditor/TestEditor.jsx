import BaseEditor from './BaseEditor'

import React, { useState, useRef } from 'react'

import { Button, Modal } from 'antd'

export default (props) => {
  let { testEditorVisible, setTestEditorVisible, onTest } = props
  // 弹框
  const [testVal, setTestVal] = useState('')
  // const formRef = useRef()
  const [editor, setEditor] = useState()


  const editorDidMount = (editor, monaco) => {
    setEditor(editor)
  }
  const handleOk = async () => {
    onTest(editor.getValue(), handleCancel)
    // setTestEditorVisible(false)
  }
  const handleChange = async (val) => {
    // console.log('testval', val)
  }

  const handleCancel = async () => {
    setTestEditorVisible(false)
  }

  return (
    <Modal
      visible={testEditorVisible}
      width="800px"
      title="脚本测试"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          测试
        </Button>,
      ]}>
      <BaseEditor
        value={testVal}
        onChange={handleChange}
        side={false}
        editorDidMount={editorDidMount}
        showFooter={false}></BaseEditor>
    </Modal>
  )
}
