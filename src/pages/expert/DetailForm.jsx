import React, { useRef, useState, useEffect } from 'react'
import { Col, Row } from 'antd'
import { ModalForm } from '@ant-design/pro-form'
import ProDescriptions from '@ant-design/pro-descriptions'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }
  const { tableRowData, visible, listEnum } = props
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
      width="550px"
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
        <Col span={20} offset={3}>
          <ProDescriptions
            dataSource={tableRowData}
            column={2}
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
              },
              {
                title: '手机号',
                dataIndex: 'mobile',
              },
              {
                title: 'QQ号',
                dataIndex: 'qq',
              },
              {
                title: 'Email',
                dataIndex: 'email',
              },
              {
                title: '民族',
                dataIndex: 'nation',
              },
              {
                title: '政治面貌',
                dataIndex: 'political_status',
              },
              {
                title: '籍贯',
                dataIndex: 'birthplace',
              },
              {
                title: '毕业院校',
                dataIndex: 'graduate_school',
              },
              {
                title: '专业',
                dataIndex: 'major',
              },

              {
                title: '学历',
                dataIndex: 'education',
              },
              {
                title: '学位',
                dataIndex: 'degree',
              },
              {
                title: '单位',
                dataIndex: 'company',
              },
              {
                title: '职务',
                dataIndex: 'job',
              },
              {
                title: '职称',
                dataIndex: 'professional_title',
              },
              {
                title: '研究成果',
                dataIndex: 'research_findings',
              },
              {
                title: '擅长领域',
                dataIndex: 'areas_of_expertise_id',
                valueEnum: listEnum,
              },
              {
                title: '备注信息',
                dataIndex: 'remark',

                width: 120,
              },

              {
                title: '创建时间',
                dataIndex: 'create_time',
                width: 100,
              },
            ]}></ProDescriptions>
        </Col>
      </Row>
    </ModalForm>
  )
}
