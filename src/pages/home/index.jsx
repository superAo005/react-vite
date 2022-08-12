import React, { useEffect, useRef, useState } from 'react'
// import ProCard from '@ant-design/pro-card'
import { Button, Modal } from 'antd'
import CodeEditor from '@/components/RiskEditor/RiskEditor'
import { ModalTest } from '@/components/ScriptTest/index'

export default function Index() {
  const [isModalVisible, setIsModalVisible] = useState(false)

  // const handleChange = (val) => {
  //   setDataSource(val)
  // }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const editorDidMount = (editor) => {}
  return (
    <>
      <div className="m-1">
        sss
        <Button type="primary" onClick={showModal}>
          Open Modal
        </Button>
        <CodeEditor className="w-96 h-96" editorDidMount={editorDidMount}></CodeEditor>
        {/* <Modal
          width="1200px"
          title="测试脚本"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>,
            // <Button key="submit" type="primary" onClick={handleOk}>
            //   测试
            // </Button>,
          ]}>
          <div style={{ height: '70vh', overflowY: 'auto' }}>
            <ScriptTest
              dataSource={dataSource}
              onChange={handleChange}
              scriptInfo={{
                sceneType: 'Function',
                scriptBody: 'let a  =1 ',
                scriptNo: '',
                scriptType: 'JAVA',
              }}
              inputParams={[
                {
                  dataType: 'BOOLEAN',
                  paramName: 'uid',
                  value: '',
                },
                {
                  dataType: 'LONG',
                  paramName: 'pid',
                  value: '',
                },
              ]}></ScriptTest>
          </div>
        </Modal> */}
        {/* <ModalTest
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          dataSource={defaultData}
          // onChange={handleChange}
          scriptInfo={{
            sceneType: 'Function',
            scriptBody: 'let a  =1 ',
            scriptNo: '',
            scriptType: 'JAVA',
          }}
          inputParams={[
            {
              dataType: 'BOOLEAN',
              paramName: 'uid',
              value: '',
            },
            {
              dataType: 'LONG',
              paramName: 'pid',
              value: '',
            },
          ]}></ModalTest> */}
        <ModalTest
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          scriptInfo={{
            sceneType: 'Function',
            scriptBody: 'let a  =1 ',
            scriptNo: '',
            scriptType: 'JAVA',
          }}
          inputParams={[
            {
              dataType: 'BOOLEAN',
              paramName: 'uid',
              value: '',
            },
            {
              dataType: 'LONG',
              paramName: 'pid',
              value: '',
            },
          ]}></ModalTest>
      </div>
    </>
  )
}
