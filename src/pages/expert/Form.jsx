import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Col, Row, Form } from 'antd'
import { ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form'
import { create, edit } from '@/services/expert'
// import ProCard from '@ant-design/pro-card'

import { validatorMobile } from '@/utils'
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

  // tableRowData
  console.log('tableRowData', tableRowData)
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
        modalForm.setFieldsValue({})
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
            await form.validateFields()

            let params = {
              ...tableRowData,
              ...values,
            }
            delete params.modalType
            if (modalType == 'edit') {
              await edit(params)
            } else {
              await create(params)
            }
            props.reload()
            formRef.current.resetFields()

            return true
          } catch (errorInfo) {
            console.log('Failed:', errorInfo)
          }
        }}>
        <Row className="pl-20">
          <Col span={24}>
            <ProFormText
              name="name"
              label="专家名称"
              placeholder="请输入专家名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          {modalType != 'edit' && (
            <>
              <Col span={24}>
                <ProFormText
                  name="login_account"
                  label="登录账号"
                  placeholder="请输入登录账号"
                  rules={[{ required: true, message: '不能为空' }]}
                />
              </Col>
              <Col span={24}>
                <ProFormText
                  name="pwd"
                  label="登录密码"
                  placeholder="请输入登录密码"
                  rules={[{ required: true, message: '不能为空' }]}
                />
              </Col>
              <Col span={24}>
                <ProFormText
                  name="mobile"
                  label="手机号"
                  placeholder="请输入手机号"
                  rules={[{ required: true, message: '不能为空' }, { validator: validatorMobile }]}
                />
              </Col>
            </>
          )}

          <Col span={24}>
            <ProFormTextArea
              name="remark"
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
