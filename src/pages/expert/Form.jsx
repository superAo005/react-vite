import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Col, Row, Form } from 'antd'
import { ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form'
// import ProCard from '@ant-design/pro-card'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 17 },
  }

  let { tableRowData, visible } = props
  let { modalType, sourceNo } = tableRowData
  const formRef = useRef()
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()

  // 详情数据
  const [detail] = useState({
    sourceType: 'cp',
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
          let data = {}
          // setDetail(data)

          modalForm.setFieldsValue(data)
        })()
      } else {
        modalForm.setFieldsValue({
          sourceType: 'cp',
        })
      }
    }
  }, [sourceNo, visible])

  return (
    <>
      <ModalForm
        title={props.title}
        visible={props.visible}
        onVisibleChange={props.onVisibleChange}
        initialValues={detail}
        formRef={formRef}
        form={modalForm}
        width="700px"
        key="modalAddAndEdit"
        {...formItemLayout}
        layout="horizontal"
        labelAlign="left"
        modalProps={{
          onCancel: onCancel,
        }}
        onFinish={async (values) => {
          try {
            await form.validateFields()

            let params = {
              ...values,
            }
            // let { code, message: msg } = await add(params)

            // if (code == 0) {
            //   message.success('提交成功')
            //   props.reload()
            //   return true
            // } else {
            //   message.error(msg)
            //   return false
            // }
          } catch (errorInfo) {
            console.log('Failed:', errorInfo)
          }
        }}>
        <Row>
          <Col span={24}>
            <ProFormText
              name="sourceCHName"
              label="专家名称"
              placeholder="请输入专家名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormTextArea
              name="sourceDesc"
              label="备注信息"
              placeholder="请输入备注信息 "
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}
