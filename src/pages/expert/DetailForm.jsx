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
            column={1}
            columns={[
              {
                title: '专家姓名',
                dataIndex: 'name',
                width: 120,
              },
              {
                title: '性别',
                dataIndex: 'gender',
                valueEnum: {
                  0: '男',
                  1: '女',
                },
                hideInSearch: true,
              },

              {
                title: '民族',
                dataIndex: 'gender',
                hideInSearch: true,
              },
              {
                title: '政治面貌',
                dataIndex: 'political_status',
                hideInSearch: true,
              },
              {
                title: '籍贯',
                dataIndex: 'birthplace',
                hideInSearch: true,
              },
              {
                title: '毕业院校',
                dataIndex: 'graduate_school',
                hideInSearch: true,
              },
              {
                title: '专业',
                dataIndex: 'major',
                hideInSearch: true,
              },

              {
                title: '学历',
                dataIndex: 'education',
                hideInSearch: true,
              },
              {
                title: '学⼠',
                dataIndex: 'degree',
                hideInSearch: true,
              },
              {
                title: '公司名称',
                dataIndex: 'company',
                hideInSearch: true,
              },
              {
                title: '职称',
                dataIndex: 'professional_title',
                hideInSearch: true,
              },
              {
                title: '研究成果',
                dataIndex: 'research_findings',
                hideInSearch: true,
              },
              {
                title: '擅长领域',
                dataIndex: 'areas_of_expertise_id',
                hideInSearch: true,
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
