import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Col, Row, Form } from 'antd'
import { ModalForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form'
// import ProCard from '@ant-design/pro-card'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 6 },
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
        width="900px"
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
          {/* <Col span={12}>
            
            <ProFormSelect
              options={[
                {
                  value: 'cp',
                  label: 'CP数据源',
                },
              ]}
              name="sourceType"
              label="数据源类型"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col> */}

          <Col span={12}>
            <ProFormText name="sourceNo" label="数据源编号" placeholder="系统自动生成" disabled />
          </Col>
          <Col span={12}>
            <ProFormText
              name="sourceName"
              label="数据源名称"
              placeholder="请输入数据源名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormText
              name="sourceCHName"
              label="数据源简称"
              placeholder="请输入简称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={12}>
            <ProFormTextArea
              name="sourceDesc"
              label="数据源描述"
              placeholder="请输入数据源描述 "
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <ProFormText
              name="topic"
              label="topic"
              placeholder=""
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={12}>
            {/* <ProFormText
              name="sourceToQmqTopic"
              label="ToQmqTopic"
              placeholder=""
              rules={[{ required: true, message: '不能为空' }]}
            /> */}

            <ProFormSelect
              name="cp"
              label="接入点"
              showSearch
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <ProFormSelect
              name="schemaNo"
              label="schemaNo"
              showSearch
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}
