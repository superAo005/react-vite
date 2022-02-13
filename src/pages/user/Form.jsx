import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Col, Row, Form } from 'antd'
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form'
import { create, edit } from '@/services/user'
// import ProCard from '@ant-design/pro-card'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
  }

  let { tableRowData, visible } = props
  let { modalType, sourceNo } = tableRowData
  const formRef = useRef()
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  // 详情数据
  const [detail] = useState({
    ...tableRowData,
    identity_type: '0',
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

          modalForm.setFieldsValue({
            ...tableRowData,
            identity_type: tableRowData.identity_type + '',
          })
        })()
      } else {
        modalForm.setFieldsValue({})
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
            if (modalType == 'edit') {
              await edit(params)
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
              name="login_account"
              label="登录账号"
              placeholder="请输入登录账号"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          {modalType != 'edit' && (
            <Col span={24}>
              <ProFormText
                name="pwd"
                label="登录密码"
                placeholder="请输入登录密码"
                rules={[{ required: true, message: '不能为空' }]}
              />
            </Col>
          )}

          <Col span={24}>
            <ProFormText
              name="real_name"
              label="真实姓名"
              placeholder="请输入真实姓名"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          {modalType == 'edit' && (
            <Col span={24}>
              <ProFormText name="pwd" label="新密码" placeholder="请输入新登录密码" />
            </Col>
          )}
          <Col span={24}>
            <ProFormText
              name="mobile"
              label="手机号"
              placeholder="请输入手机号"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={24}>
            <ProFormSelect
              name="identity_type"
              valueEnum={{
                0: '平台管理⼯作⼈员',
                1: '平台使⽤⼈员',
                2: '专家',
              }}
              label="身份类别"
              placeholder="请输入备注信息 "
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}
