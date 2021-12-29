import React, { useRef } from 'react'

import { Form, Input, Button, Row, Col } from 'antd'

import './index.css'
import Itemlist from './ItemList'

const DetailConfig = (props) => {
  const { name, right } = props

  return (
    <>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {console.log(fields)}
            {fields.map((field) => (
              <div className="item_container" key={field.key}>
                <Row key={field.key}>
                  <Col span={8}>
                    <Form.Item
                      key={field.key}
                      fieldKey={[field.key, 'fieldType']}
                      name={[field.name, 'fieldType']}
                      label="字段分类"
                      rules={[
                        { required: true, message: '必填' },
                        { pattern: /^\w+$/, message: '请输入正确命名格式' },
                      ]}>
                      <Input placeholder="字段分类" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Button
                      style={{ marginLeft: '20px' }}
                      onClick={() => {
                        remove(field.name)
                      }}>
                      删除分类
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Itemlist right={right} fieldsList={fields} field={field} removeBase={remove} />
                </Row>
              </div>
            ))}

            <Row>
              <Col span={2}>
                <Form.Item>
                  <Button
                    onClick={() =>
                      add({
                        fieldType: '',
                        detailFieldConfigs: [{ fieldCn: '', fieldEn: '', fieldRoute: '' }],
                      })
                    }
                    block>
                    添加分类
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            {/* <Row>
              <Col span={24} offset={0}>
                <Button
                  onClick={() => {
                    form.resetFields()
                    form.setFieldsValue({
                      ...defaulData,
                    })
                  }}>
                  重置
                </Button>
              </Col>
            </Row> */}
          </>
        )}
      </Form.List>
    </>
  )
}
export default DetailConfig
