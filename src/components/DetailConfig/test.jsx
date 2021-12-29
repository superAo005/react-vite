import React from 'react'

import { Form, Input, Button, Row, Col } from 'antd'

import './index.css'
import Itemlist from './ItemList'
import DetailConfig from './index'
import { RiskEditor } from '@/components/RiskEditor'

const defaulData = {
  detailConfigs: [
    {
      fieldType: 'table',
      detailFieldConfigs: [
        { fieldCn: 'name', fieldEn: 'string', fieldRoute: 'fieldRoute' },
        { fieldCn: 'name', fieldEn: 'string33', fieldRoute: 'fieldRoute' },
      ],
    },
    {
      fieldType: 'table2',
      detailFieldConfigs: [{ fieldCn: 'name', fieldEn: 'string', fieldRoute: 'fieldRoute' }],
    },
  ],
  scriptBody: 'let a =1dfgdf',
}

const onFinish = (values) => {
  console.log('Received values of form:', values)
}
const editorDidMount = (editor, monaco) => {
  // console.log(editor, monaco)
}
const sideOptions = {
  list: [],
}
const data = [
  'Racing ',
  'Japanese ',
  'Australian ',
  'Man charged o',
  'Los Angeles',
  'Los Angeles',
  'Los Angeles',
  'Los Angeles',
  'Los Angeles',
  'Los Angeles',
  'Los Angeles',
]
export default function Test(props) {
  const [form] = Form.useForm()

  return (
    <Form form={form} name="dynamic_form_nest_item" onFinish={onFinish} initialValues={defaulData}>
      {/* <DetailConfig name="detailConfigs" right="20"></DetailConfig> */}
      <Form.Item name="scriptBody">
        <RiskEditor
          className="h-[250px]"
          sideOptions={sideOptions}
          listSource={data}
          editorDidMount={editorDidMount}></RiskEditor>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
