import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Col, Row, Form } from 'antd'
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form'

import WangEditor from '@/components/WangEditor'
import { create, update } from '@/services/laws'
// import ProCard from '@ant-design/pro-card'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 19 },
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
        width="1100px"
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
            console.log({ params })
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
              label="通知标题"
              placeholder="请输入通知标题"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          {/* <Col span={24}>
            <ProFormDependency name={['ismenu']}>
              {({ ismenu }) => {
                if (ismenu) {
                  return (
                    <ProFormText
                      name="menu_name"
                      label="菜单名称"
                      placeholder="请输入菜单名称,不填取主题名称"
                    />
                  )
                } else {
                  return null
                }
              }}
            </ProFormDependency>
          </Col> */}

          <Col span={24}>
            <ProForm.Item label="内容" name="content">
              <WangEditor />
            </ProForm.Item>
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}
