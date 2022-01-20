import React, { useRef, useState, useImperativeHandle } from 'react'
import { EditableProTable } from '@ant-design/pro-table'
// import ProCard from '@ant-design/pro-card'
import { Button, Col, Modal } from 'antd'

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function cloneDeep(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = cloneDeep(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
// import { cloneDeep } from 'lodash-es'
import ParamList from './ParamList'
const defaultData = [
  {
    id: Date.now().toString(),
    expectResult: ``,
    result: '',
    isExpect: false,
    paramDtoList: [],
  },
]
export default function ModalTest(props) {
  const { inputParams, scriptInfo = {}, width = '1200px' } = props

  const { visible, setVisible } = props
  defaultData[0].paramDtoList = cloneDeep(inputParams)
  const data = cloneDeep(defaultData)
  const actionRef = useRef()
  const [editableKeys, setEditableRowKeys] = useState(() => data.map((item) => item.id))
  const [dataSource, setDataSource] = useState(() => data)

  console.log('dataSource')
  console.log(dataSource)
  useImperativeHandle(props.onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      handleTest: handleTest,
      setDataSource: setDataSource,
    }
  })

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '100px',
      editable: false,

      render: (_, row, index) => index + 1,
    },
    {
      title: '入参',
      dataIndex: 'paramDtoList',
      width: '30%',
      renderFormItem: () => {
        return <ParamList inputParams={inputParams} />
      },
      render: (_) => {
        return (
          <>
            {Array.isArray(_)
              ? (_ || []).map((item) => (
                  <>
                    <Col span={8} key={item.paramName} style={{ marginBottom: '10px' }}>
                      <span style={{ width: '100%' }}>{item.paramName}:</span>
                      <span style={{ width: '100%' }}>{item.value}</span>
                    </Col>
                  </>
                ))
              : _}
          </>
        )
      },
    },
    {
      title: '预期结果',
      dataIndex: 'expectResult',
    },

    {
      title: '输出结果',
      dataIndex: 'result',
      // 不允许编辑
      editable: false,
    },
    {
      title: '符合预期',
      dataIndex: 'isExpect',
      // 不允许编辑
      editable: false,
      render: (_, row) => {
        console.log(_)
        // 比对预期结果于结果的值
        return <>{row.expectResult == row.result ? '符合' : '不符合'}</>
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id)
          }}>
          编辑
        </a>,
      ],
    },
  ]

  const handleCopy = (row) => {
    let id = Date.now().toString()
    const cloneRow = cloneDeep(row)

    const data = [
      ...dataSource,
      {
        ...cloneRow,
        id,
      },
    ]
    setDataSource(data)
    setEditableRowKeys([...editableKeys, id])
    // onChange(data)
  }

  const handleTest = () => {
    const paramGroupList = dataSource.map((item) => ({ paramDtoList: item.paramDtoList }))
    const params = {
      paramGroupList,
      ...scriptInfo,
    }

    // TODO 在这里发请求然后比对结果,给dataSource 赋值执行结果
    console.log(params)
    console.log(dataSource)
  }
  const handleOk = () => {
    setVisible(false)
  }

  const handleCancel = () => {
    // scriptRef.current.setDataSource(defaultData)
    const data = cloneDeep(defaultData)
    console.log('cloneDeep', data)
    let id = Date.now().toString()
    setDataSource([
      {
        ...data[0],
        id,
      },
    ])

    setEditableRowKeys([id])

    setVisible(false)
  }
  return (
    <>
      <Modal
        width={width}
        title="测试脚本"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleTest}>
            测试
          </Button>,
        ]}>
        <div style={{ height: '70vh', overflowY: 'auto' }}>
          <EditableProTable
            columns={columns}
            rowKey="id"
            actionRef={actionRef}
            value={dataSource}
            onChange={setDataSource}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({
                id: Date.now().toString(),
                expectResult: ``,
                result: '',
                isExpect: false,
                paramDtoList: cloneDeep(inputParams),
              }),
            }}
            toolBarRender={false}
            editable={{
              type: 'multiple',
              editableKeys,
              actionRender: (row, config, defaultDoms) => {
                return [
                  <>
                    <a onClick={() => handleCopy(row)}>复制</a>
                  </>,
                  defaultDoms.delete,
                ]
              },
              onValuesChange: (record, recordList) => {
                console.log(recordList, 'recordList')
                setDataSource(recordList)
                // onChange(recordList)
              },
              onChange: setEditableRowKeys,
            }}
          />
        </div>
      </Modal>
    </>
  )
}
