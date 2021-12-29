import React from 'react'

import { Form, Input, Button, Col, Space } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'

export default function Itemlist(props) {
  const { field, fieldsList, right } = props

  return (
    <>
      <Form.List name={[field.name, 'detailFieldConfigs']}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((innerField) => {
                return (
                  <React.Fragment key={innerField.key}>
                    {/* 表结构 */}
                    <Col span={8}>
                      <Form.Item
                        key={field.key}
                        name={[innerField.name, 'fieldCn']}
                        fieldKey={[innerField.key, 'fieldCn']}
                        label="字段中文"
                        rules={[
                          { required: true, message: '必填' },
                          { pattern: /^\w+$/, message: '请输入正确命名格式' },
                        ]}>
                        <Input placeholder="请输入参数结构/structs name" />
                      </Form.Item>
                    </Col>
                    {/* 参数类型 */}
                    <Col span={6}>
                      <Form.Item
                        key={field.key}
                        name={[innerField.name, 'fieldEn']}
                        fieldKey={[innerField.key, 'fieldEn']}
                        label="字段英文"
                        rules={[
                          { required: true, message: '必填' },
                          { pattern: /^\w+$/, message: '请输入正确命名格式' },
                        ]}>
                        <Input placeholder="请输入字段英文" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        key={field.key}
                        name={[innerField.name, 'fieldRoute']}
                        fieldKey={[innerField.key, 'fieldRoute']}
                        label="字段路径"
                        rules={[
                          { required: true, message: '必填' },
                          { pattern: /^\w+$/, message: '请输入正确命名格式' },
                        ]}>
                        <Input placeholder="请输入字段路径" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Space>
                        <Button
                          type="text"
                          disabled={fieldsList.length === 1 && fields.length === 1}
                          onClick={() => {
                            remove(innerField.name)
                          }}>
                          <MinusCircleOutlined />
                        </Button>
                      </Space>
                    </Col>
                  </React.Fragment>
                )
              })}

              <Button
                className="child_add_btn"
                style={{
                  right: right + 'px',
                }}
                onClick={() => add({ fieldCn: '', fieldEn: null, fieldRoute: '' })}>
                新增行
              </Button>
            </>
          )
        }}
      </Form.List>
    </>
  )
}
