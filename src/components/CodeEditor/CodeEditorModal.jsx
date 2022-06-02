import React, { useState, useEffect } from 'react'
import { Modal, message } from 'antd'
import { CodeEditor } from '@/components/CodeEditor'
import { ModalTest } from '@/components/ScriptTest/index'
import { compile, parse } from '@/services/script'
import { getEditorData } from '@/services/feature-manage'
import { useSetState } from 'ahooks'
export default function index(props) {
  const {
    scriptVisible,
    setScriptVisible,
    width,
    handleOk,
    valueScript,
    showTags = [true, true, false, true],
    sceneType = 'Attribute',
    valueType = null,
  } = props
  // 辑器所有数据 - 特征、函数、数据视图,属性
  const [dataSource, setDataSource] = useState([[], [], [], []])
  // 脚本测试
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [scriptInfo, setScriptInfo] = useSetState({
    sceneType: sceneType,
    scriptBody: valueScript,
    scriptNo: '',
    scriptType: 'JAVA',
    valueType: valueType,
  })
  const [inputParams, setInputParams] = useState([])
  const [isOk, setIsOk] = useState(false)

  const [editor, setEditor] = useState()

  const editorDidMount = (editor) => {
    setEditor(editor)
  }
  // 脚本测试 --end

  /**
   * 编译
   * @param {String} value  编辑器输入得内容
   */
  const onCompile = async (value) => {
    if (value) {
      setScriptInfo({
        scriptBody: value,
        valueType,
      })
      let res = await parse({
        ...scriptInfo,
        scriptBody: value,
        valueType,
      })
      if (res.code === '0') {
        let res2 = await compile({
          ...scriptInfo,
          scriptBody: value,
          paramDtoList: res.body.paramDtoList,
          valueType,
        })
        if (res2.code === '0') {
          message.success('编译成功!')
          setIsOk(true)
        } else {
          Modal.error({
            width: '50%',
            title: '编译失败',
            content: <pre className="code">{res2.message}</pre>,
            zIndex: 1100,
          })
        }
      } else {
        Modal.error({
          width: '50%',
          title: '编译失败',
          content: <pre className="code">{res.message}</pre>,
          zIndex: 1100,
        })
      }
    } else {
      setIsOk(true)
      setScriptInfo({
        scriptBody: '',
      })
      message.success('编译成功')
    }
  }
  /**
   * 测试
   *@param {String} value  编辑器输入得内容
   */
  const onTest = async (value) => {
    let res = await parse({
      ...scriptInfo,
      scriptBody: value,
      valueType,
    })
    if (res.code === '0') {
      let res2 = await compile({
        ...scriptInfo,
        scriptBody: value,
        paramDtoList: res.body.paramDtoList,
        valueType,
      })
      if (res2.code === '0') {
        // message.success('编译成功!')
        setIsModalVisible(true)
        setScriptInfo({
          scriptBody: value,
          valueType,
        })
        setInputParams(res?.body?.paramDtoList)
      } else {
        Modal.error({
          width: '50%',
          title: '编译失败',
          content: <pre className="code">{res2.message}</pre>,
          zIndex: 1100,
        })
      }
    } else {
      Modal.error({
        width: '50%',
        title: '编译失败',
        content: <pre className="code">{res.message}</pre>,
        zIndex: 1100,
      })
    }
  }
  const handleCancel = () => {
    if (editor) {
      editor?.getModel()?.setValue(valueScript || '')
    }
    setScriptVisible(false)
  }
  useEffect(() => {
    ;(async () => {
      // 属性
      let dvScopeTypes = []
      switch (sceneType) {
        case 'Attribute':
          dvScopeTypes = ['ATTRIBUTE', 'ATTRIBUTE_AND_FEATURE']
          break
        case 'CUSTOM_DECISION':
          dvScopeTypes = []
          break
      }
      let res = await getEditorData({
        dvScopeTypes,
      })
      if (res.code === '0') {
        const { dataViews = [], features = [], functions = [], attributeDicts = [] } = res.body
        setDataSource([dataViews, functions, features, attributeDicts])
      }
    })()
  }, [])
  return (
    <>
      <Modal
        width={width}
        title="取值脚本"
        visible={scriptVisible}
        maskClosable={false}
        onOk={() => {
          if (isOk) {
            handleOk(scriptInfo.scriptBody)
            if (editor) {
              editor?.getModel()?.setValue('')
            }
            setIsOk(false)
          } else {
            message.warning('请编译通过再保存!!!')
          }
        }}
        onCancel={handleCancel}
        zIndex={1001}>
        <CodeEditor
          // side={false}
          side={{ dataSource: dataSource, width: 404, showTags: showTags }}
          onCompile={onCompile}
          editorDidMount={editorDidMount}
          onTest={onTest}
          value={valueScript}
        />
      </Modal>
      {isModalVisible && (
        <ModalTest
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          scriptInfo={scriptInfo}
          inputParams={inputParams}></ModalTest>
      )}
    </>
  )
}
