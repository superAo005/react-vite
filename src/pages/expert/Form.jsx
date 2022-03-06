import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Col, Row, Form } from 'antd'
import { ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form'
import { create, edit } from '@/services/expert'
// import ProCard from '@ant-design/pro-card'

import { validatorMobile } from '@/utils'
export default (props) => {
  const formItemLayout = {
    labelCol: { span: 6 },
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
        width="750px"
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
        <Row className="pl-2">
          <Col span={12}>
            <ProFormText
              name="name"
              label="专家名称"
              placeholder="请输入专家名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          {modalType != 'edit' && (
            <>
              <Col span={12}>
                <ProFormText
                  name="login_account"
                  label="登录账号"
                  placeholder="请输入登录账号"
                  rules={[{ required: true, message: '不能为空' }]}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="pwd"
                  label="登录密码"
                  placeholder="请输入登录密码"
                  rules={[{ required: true, message: '不能为空' }]}
                />
              </Col>
              <Col span={12}>
                <ProFormText
                  name="mobile"
                  label="手机号"
                  placeholder="请输入手机号"
                  rules={[{ required: true, message: '不能为空' }, { validator: validatorMobile }]}
                />
              </Col>
            </>
          )}

          <Col span={12}>
            <ProFormSelect
              name="gender"
              valueEnum={{
                0: '男',
                1: '女',
              }}
              label="性别"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={12}>
            <ProFormText
              name="nation"
              label="民族"
              placeholder="请输入民族"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={12}>
            <ProFormText
              name="political_status"
              label="政治面貌"
              placeholder="请输入政治面貌"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={12}>
            <ProFormText
              name="birthplace"
              label="籍贯"
              placeholder="请输入籍贯"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="education"
              label="学历"
              placeholder="请输入学历"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="degree"
              label="学位"
              placeholder="请输入学位"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="graduate_school"
              label="毕业院校"
              placeholder="请输入毕业院校"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="major"
              label="专业"
              placeholder="请输入专业"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="company"
              label="公司名称"
              placeholder="请输入公司名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="professional_title"
              label="职称"
              placeholder="请输入职称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="research_findings"
              label="研究成果"
              placeholder="请输入研究成果"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={12}>
            <ProFormSelect
              name="areas_of_expertise_id"
              valueEnum={{
                0: '男',
                1: '女',
              }}
              label="擅长领域"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
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
