import React, { useRef, useState, useEffect } from 'react'
import { Col, Row, Tag } from 'antd'
import { ModalForm } from '@ant-design/pro-form'
import ProDescriptions from '@ant-design/pro-descriptions'
import ProTable from '@ant-design/pro-table'

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

        console.log('detail', tableRowData)
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
      <ProTable
        dataSource={[tableRowData]}
        rowKey="name"
        columns={[
          {
            title: '专家名称',
            dataIndex: 'name',
            width: 'auto',
          },
          {
            title: '评审经历',
            dataIndex: 'project_name',
            render: (_) => {
              return (
                <>
                  {Array.isArray(_)
                    ? _.map((item) => (
                        <div key={item} className="pb-2">
                          <Tag color="blue">{item}</Tag>
                        </div>
                      ))
                    : _}
                </>
              )
            },
          },
          // {
          //   title: '备注信息',
          //   dataIndex: 'remark',

          //   hideInSearch: true,
          //   width: 120,
          // },

          // {
          //   title: '创建时间',
          //   dataIndex: 'create_time',
          //   hideInSearch: true,
          //   width: 100,
          // },
        ]}
        search={false}
        pagination={false}
        options={false}></ProTable>
    </ModalForm>
  )
}
