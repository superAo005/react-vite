// import TagsCanvas from '@/components/TagsCanvas'
import { Row, Col, Button, Form } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import ProForm, { ProFormText, ProFormDigit } from '@ant-design/pro-form'

// import TagCanvas from './tagcanvas'
import TagCanvas from 'tag-canvas'
const tags = [
  { value: 'Javascript', weight: 30 },
  { value: 'React', weight: 30 },
  { value: 'HTML5', weight: 20 },
  { value: 'CSS3', weight: 20 },
  { value: 'PHP', weight: 30 },
  { value: 'Git', weight: 20 },
  { value: 'Redux', weight: 20 },
  { value: 'NodeJS', weight: 20 },
]
export default function Index(props) {
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
  }

  const formRef = useRef()
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()

  const [detail] = useState({})

  const onCancel = () => {
    formRef.current.resetFields()
  }
  useEffect(() => {
    // TagCanvas.Start(id, `${id}-tags`, { weight, weightFrom, ...options })
    TagCanvas.Start('tagCanvas', `tags`, {
      textColour: null,
      dragControl: 1,
      decel: 0.95,
      textHeight: 14,
      minSpeed: 0.01,
      initial: [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)],
    })
  }, [])
  const getSpeed = () => {
    return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)]
  }
  const handleStart = () => {
    TagCanvas.SetSpeed('tagCanvas', [5, 1])
  }
  const handleStop = () => {
    TagCanvas.SetSpeed('tagCanvas', getSpeed())
  }
  return (
    <>
      <Row>
        <Col span={6} className="pt-60 ">
          <ProForm
            initialValues={detail}
            formRef={formRef}
            form={modalForm}
            key="modalAddAndEdit"
            {...formItemLayout}
            className="extract-form"
            layout="horizontal"
            labelAlign="left"
            submitter={{
              // 配置按钮文本
              searchConfig: {
                submitText: '抽取',
                resetText: '重置',
              },
              // 配置按钮的属性
              resetButtonProps: {
                style: {
                  // 隐藏重置按钮
                  display: 'none',
                },
              },
              submitButtonProps: {
                style: {
                  width: '345px',
                  marginLeft: '15px',
                },
              },
              render: (props, doms) => {
                return [...doms.reverse()]
              },
            }}
            onFinish={async (values) => {
              try {
                await form.validateFields()

                console.log('values', values)
                // let params = {
                //   ...tableRowData,
                //   ...values,
                // }
                // if (modalType == 'edit') {
                //   await edit(params)
                // } else {
                //   await create(params)
                // }
                return true
              } catch (errorInfo) {
                console.log('Failed:', errorInfo)
              }
            }}>
            <Row className="">
              <Col span={24}>
                <ProFormText
                  name="project_name"
                  label="所属项目"
                  placeholder="请输入项目名称"
                  rules={[{ required: true, message: '不能为空' }]}
                />
              </Col>

              <Col span={24}>
                <ProFormDigit
                  label="抽取个数"
                  name="input-number"
                  min={1}
                  max={10}
                  rules={[{ required: true, message: '不能为空' }]}
                  fieldProps={{ precision: 0 }}
                />
              </Col>
            </Row>
          </ProForm>
        </Col>
        <Col span={18}>
          <canvas className="canvas h-full w-full" id="tagCanvas">
            <div id={`tags`} className="tag-cloud-tags">
              <ul>
                {tags.map((tag) => {
                  if (tag.value) {
                    return (
                      <li key={tag.value}>
                        <a data-weight={tag.weight}>{tag.value}</a>
                      </li>
                    )
                  }
                  return (
                    <li key={tag}>
                      <a>{tag}</a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </canvas>

          <div className="batch flexbox">
            {tags.map((tag) => {
              return (
                <div key={tag.value} className="player">
                  {tag.value}
                </div>
              )
            })}
          </div>
        </Col>
      </Row>
    </>
  )
}
