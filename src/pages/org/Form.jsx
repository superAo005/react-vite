import { create, update } from '@/services/org'
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { Col, Form, Row } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
// import ProCard from '@ant-design/pro-card'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
  }

  let { tableRowData, visible } = props
  let { modalType } = tableRowData
  const formRef = useRef()
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()

  // 详情数据
  const [detail] = useState({
    ...tableRowData,
  })
  const onCancel = () => {
    formRef.current.resetFields()
  }

  // 获取详情
  useEffect(() => {
    if (visible) {
      if (modalType == 'edit') {
        ;(async () => {
          // const {
          //   body,
          //   code,
          //   message: msg,
          // } = await getDetail({
          //   sourceNo,
          // })
          // if (code != 0) {
          //   message.error(msg)
          // }
          // let data = body || {}
          // let data = {}
          // setDetail(data)
          modalForm.setFieldsValue(tableRowData)
        })()
      } else {
        modalForm.setFieldsValue({
          is_menu: 1,
        })
      }
    }
  }, [visible])

  return (
    <>
      <ModalForm
        title={props.title}
        visible={props.visible}
        onVisibleChange={props.onVisibleChange}
        initialValues={detail}
        formRef={formRef}
        form={modalForm}
        width="650px"
        key="modalAddAndEdit"
        {...formItemLayout}
        layout="horizontal"
        labelAlign="left"
        modalProps={{
          onCancel: onCancel,
        }}
        onFinish={async (values) => {
          try {
            await modalForm.validateFields()
            const { id } = tableRowData
            let params = {
              id,
              // ...tableRowData,
              ...values,
            }
            delete params.modalType
            if (modalType == 'edit') {
              await update(params)
            } else {
              await create(params)
            }
            props.reload()
            return true
          } catch (errorInfo) {
            console.log('Failed:', errorInfo)
          }
        }}>
        <Row className="pl-20">
          <Col span={24}>
            <ProFormText
              name="name"
              label="单位名称"
              placeholder="请输入名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormTextArea name="desc" label="描述信息" placeholder="请输入描述信息 " />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}
