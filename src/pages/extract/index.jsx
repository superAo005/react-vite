// import TagsCanvas from '@/components/TagsCanvas'
import { Row, Col, Button, Form, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import ProForm, { ProFormText, ProFormDigit, ProFormTextArea } from '@ant-design/pro-form'

import { useLocation } from 'react-router-dom'
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
  const location = useLocation()
  console.log('location', location.state)
  const formRef = useRef()
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const state = location.state
  const [detail] = useState({
    project_name: state?.record?.name,
    remark: state?.record?.remark,
  })
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

      // modalForm.setFieldsValue({ project_name: state.name, remark: state.remark })

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
      message.error('??????????????????')
      return
    }
    const values = await formRef.current?.validateFieldsReturnFormatValue?.()
    let params = {
      ...values,
      type: 1,
      expert_id_list: selectedList.map((item) => item.expert_id),
    }
    if (state?.record?.pid) {
      params['pid'] = state?.record?.pid
    }
    const { data } = await selectList(params)
    message.success('????????????????????????????????????')
  }
  return (
    <>
      <Row className="bg-white ">
        <Col flex="500px" className="pt-60 pl-5 pb-5">
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
              // ??????????????????
              searchConfig: {
                submitText: '??????',
                resetText: '??????',
              },
              // ?????????????????????
              resetButtonProps: {
                style: {
                  // ??????????????????
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
                    ??????
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
                if (state?.record?.pid) {
                  params['pid'] = state?.record?.pid
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
                  label="????????????"
                  placeholder="?????????????????????"
                  rules={[{ required: true, message: '????????????' }]}
                />
              </Col>
              <Col span={24}>
                <ProFormTextArea
                  name="remark"
                  label="????????????"
                  placeholder="????????????????????? "
                  rules={[{ required: true, message: '????????????' }]}
                />
              </Col>
              <Col span={24}>
                <ProFormDigit
                  label="????????????"
                  name="number"
                  min={1}
                  max={5}
                  rules={[{ required: true, message: '????????????' }]}
                  fieldProps={{ precision: 0 }}
                />
              </Col>
            </Row>
          </ProForm>
        </Col>
        <Col flex="auto">
          <canvas className="canvas h-full w-full" id="tagCanvas">
            <div id={`tags`} className="tag-cloud-tags">
              <ul>
                {expertTags.map((tag) => {
                  if (tag.expert_id) {
                    return (
                      <li key={tag.expert_id}>
                        <a href="javascript:void(0);" data-weight={20}>
                          {tag.name}
                        </a>
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
