import React, { useRef, useState, useEffect } from 'react'
import { Button, TreeSelect, Col, Row, Form } from 'antd'
import { ModalForm, ProFormText, ProFormTreeSelect } from '@ant-design/pro-form'

const { SHOW_PARENT, SHOW_ALL } = TreeSelect
import { create, edit } from '@/services/user'
import { getPageList } from '@/services/role'
// import ProCard from '@ant-design/pro-card'

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
      },
    ],
  },
  {
    title: 'Node3',
    value: '0-2',
    children: [
      {
        title: 'Child Node6',
        value: '0-2-0',
      },
      {
        title: 'Child Node7',
        value: '0-2-1',
      },
      {
        title: 'Child Node8',
        value: '0-2-2',
      },
    ],
  },
]

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
    role_id: '0',
  })
  const [roleList, setRoleList] = useState([])
  const onCancel = () => {
    formRef.current.resetFields()
  }

  // 获取详情
  useEffect(() => {
    ;(async () => {
      if (visible) {
        // const { data } = await getPageList({})
        // setRoleList(data)
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
              // role_id: tableRowData.role_id + '',
            })
          })()
        } else {
          // modalForm.setFieldsValue({
          //   role_id: data[0].role_id,
          // })
        }
      }
    })()
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
              name="name"
              label="角色名称"
              placeholder="请输入角色名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormTreeSelect
              name="auth"
              label="角色权限"
              placeholder="请选择角色权限"
              request={async () => {
                return treeData
              }}
              fieldProps={{
                showArrow: false,
                filterTreeNode: true,
                showSearch: true,
                dropdownMatchSelectWidth: false,
                // labelInValue: true,
                autoClearSearchValue: true,
                multiple: true,
                maxTagCount: 2,
                treeCheckable: true,
                showCheckedStrategy: SHOW_ALL,
                // treeNodeFilterProp: 'title',
                // fieldNames: {
                //   label: 'title',
                // },
              }}
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}
