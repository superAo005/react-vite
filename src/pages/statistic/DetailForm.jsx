import React, { useRef, useState, useEffect } from 'react'
import { Col, Row, Tag } from 'antd'
import { ModalForm } from '@ant-design/pro-form'
import ProDescriptions from '@ant-design/pro-descriptions'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }
  const { tableRowData, visible } = props
  const formRef = useRef()
  // 详情数据
  const [detail, setDetail] = useState({})

  // const [sqlDataSource, setSqlDataSource] = useState(false)

  // 获取详情
  useEffect(() => {
    if (visible) {
      ;(async () => {
        let data = {}
        data.script = '11'
        setDetail(data)
      })()
    }
  }, [visible])

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
            column={1}
            columns={[
              {
                title: '项目名称',
                dataIndex: 'name',
                width: 120,
              },
              {
                title: '抽取专家',
                dataIndex: 'expert_select_details',
                hideInSearch: true,
                render: (_) => {
                  return (
                    <>
                      {Array.isArray(_)
                        ? _.map((item) => (
                            <Tag color="blue" key={item.name}>
                              {item.name}
                            </Tag>
                          ))
                        : _}
                    </>
                  )
                },
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
