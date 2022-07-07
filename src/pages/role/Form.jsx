import React, { useRef, useState, useEffect } from 'react'
import { Button, TreeSelect, Col, Row, Form } from 'antd'
import { ModalForm, ProFormText, ProFormTreeSelect } from '@ant-design/pro-form'

const { SHOW_PARENT, SHOW_ALL } = TreeSelect
import { create, update, getPermList } from '@/services/role'
// import ProCard from '@ant-design/pro-card'

const treeData = [
  {
    name: '用户管理',
    identity: 'user',
    children: [
      {
        name: '用户查询',
        identity: 'user:query',
      },
      {
        name: '用户新增',
        identity: 'user:add',
      },
      {
        name: '用户修改',
        identity: 'user:update',
      },
      {
        name: '用户删除',
        identity: 'user:del',
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
        const permRes = await getPermList()
        console.log({ permRes })
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
              sort: 0,
              // perm_id_list: ['00020002fffe4dbcae12cae76c133285'],
            }
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
              label="角色名称"
              placeholder="请输入角色名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormText
              name="identity"
              label="角色标识"
              placeholder="请输入角色标识"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormTreeSelect
              name="perm_id_list"
              label="角色权限"
              placeholder="请选择角色权限"
              request={async () => {
                const permRes = await getPermList()

                console.log('request')
                return permRes.data
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
                fieldNames: {
                  label: 'name',
                  value: 'id',
                  children: 'sub_perm_list',
                },
              }}
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}