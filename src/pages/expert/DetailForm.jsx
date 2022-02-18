import React, { useRef, useState, useEffect } from 'react'
import { Col, Row } from 'antd'
import { ModalForm } from '@ant-design/pro-form'
import ProDescriptions from '@ant-design/pro-descriptions'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }
  const { tableRowData, visible } = props
  const { sourceNo } = tableRowData
  const formRef = useRef()
  console.log('tableRowData', tableRowData)
  // 详情数据
  const [detail, setDetail] = useState({
    selectSource: 'cp',
    sql: 'select * from table',
  })

  // const [sqlDataSource, setSqlDataSource] = useState(false)

  const columns = [
    {
      title: 'field',
      dataIndex: 'field',
      width: '30%',
      editable: () => {
        return false
      },
    },
    {
      title: 'type',
      key: 'state',
      dataIndex: 'type',
      valueType: 'select',
      editable: () => false,
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
      editable: () => {
        return false
      },
    },
  ]

  // 获取详情
  useEffect(() => {
    if (visible) {
      ;(async () => {
        let data = {}
        data.script = '11'
        setDetail(data)
      })()
    }
  }, [sourceNo, visible])

  return (
    <ModalForm
      title={props.title}
      visible={props.visible}
      onVisibleChange={props.onVisibleChange}
      initialValues={detail}
      formRef={formRef}
      width="450px"
      {...formItemLayout}
      layout="horizontal"
      labelAlign="left"
      submitter={{
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}>
      <Row>
        <Col span={16} offset={6}>
          <ProDescriptions
            dataSource={tableRowData}
            // request={async () => {
            //   return Promise.resolve({
            //     success: true,
            //     data: {
            //     },
            //   })
            // }}
            column={1}
            columns={[
              {
                title: '专家姓名',
                dataIndex: 'name',
                width: 120,
              },

              {
                title: '备注信息',
                dataIndex: 'remark',

                hideInSearch: true,
                width: 120,
              },

              {
                title: '创建时间',
                dataIndex: 'create_time',
                hideInSearch: true,
                width: 100,
              },
            ]}></ProDescriptions>
        </Col>
      </Row>
    </ModalForm>
  )
}
