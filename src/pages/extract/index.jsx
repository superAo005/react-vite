// import TagsCanvas from '@/components/TagsCanvas'
import { Row, Col, Button, Form, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import ProForm, { ProFormText, ProFormDigit, ProFormTextArea } from '@ant-design/pro-form'

// import TagCanvas from './tagcanvas'
import TagCanvas from 'tag-canvas'
import { getPageList, selectList } from '@/services/expert'
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

const waitTime = (time = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
export default function Index(props) {
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
  }

  const formRef = useRef()
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()

  const [detail] = useState({})
  const [selectedList, setSelectedList] = useState([])
  const [expertTags, setExpertTags] = useState([])

  const onCancel = () => {
    formRef.current.resetFields()
  }

  useEffect(() => {
    ;(async () => {
      const { data } = await getPageList({
        page: 1,
        page_size: 999,
      })
      console.log('data', data)
      setExpertTags(data?.data)
      TagCanvas.Start('tagCanvas', `tags`, {
        textColour: null,
        dragControl: 1,
        decel: 0.95,
        textHeight: 14,
        minSpeed: 0.01,
        initial: [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)],
      })
    })()
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
  const handleSubmit = async () => {
    if (selectedList.length === 0) {
      message.error('请先抽取专家')
      return
    }
    const values = await formRef.current?.validateFieldsReturnFormatValue?.()
    let params = {
      ...values,
      type: 1,
      expert_id_list: selectedList.map((item) => item.expert_id),
    }
    const { data } = await selectList(params)
    message.success('抽取成功，请到统计中查看')
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
              // submitButtonProps: {
              //   style: {
              //     width: '345px',
              //     marginLeft: '15px',
              //   },
              // },
              render: (props, doms) => {
                return [
                  ...doms.reverse(),
                  <Button htmlType="button" type="primary" onClick={handleSubmit} key="edit">
                    提交
                  </Button>,
                ]
              },
            }}
            onFinish={async (values) => {
              try {
                await form.validateFields()

                console.log('values', values)
                let params = {
                  ...values,
                  type: 0,
                }
                handleStart()
                const { data } = await selectList(params)
                await waitTime()
                handleStop()
                setSelectedList(data?.expert_list)
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
                <ProFormTextArea
                  name="remark"
                  label="备注信息"
                  placeholder="请输入备注信息 "
                  rules={[{ required: true, message: '不能为空' }]}
                />
              </Col>
              <Col span={24}>
                <ProFormDigit
                  label="抽取个数"
                  name="number"
                  min={1}
                  max={5}
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
                {expertTags.map((tag) => {
                  if (tag.expert_id) {
                    return (
                      <li key={tag.expert_id}>
                        <a data-weight={20}>{tag.name}</a>
                      </li>
                    )
                  }
                  // return (
                  //   <li key={tag}>
                  //     <a>{tag}</a>
                  //   </li>
                  // )
                })}
              </ul>
            </div>
          </canvas>

          <div className="batch flexbox">
            {selectedList.length > 0 &&
              selectedList.map((tag) => {
                return (
                  <div key={tag.expert_id} className="player">
                    {tag.expert_name}
                  </div>
                )
              })}
          </div>
        </Col>
      </Row>
    </>
  )
}
