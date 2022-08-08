import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Col, Row, Form } from 'antd'
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form'
import { create, edit } from '@/services/user'
import { getPageList } from '@/services/role'
import { getPageList as getOrgList } from '@/services/org'
// import ProCard from '@ant-design/pro-card'

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
  const [orgList, setOrgList] = useState([])
  const onCancel = () => {
    formRef.current.resetFields()
  }

  // 获取详情
  useEffect(() => {
    ;(async () => {
      if (visible) {
        const { data } = await getPageList({})
        setRoleList(data)

        const { data: orgData } = await getOrgList({
          page: 1,
          page_size: 20,
        })
        console.log({ orgData })
        setOrgList(orgData?.paging_data || [])
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
              role_id: tableRowData.role_id + '',
            })
          })()
        } else {
          modalForm.setFieldsValue({
            role_id: data[0].role_id,
          })
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
              role_id_list: [values.role_id],
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
              name="login_account"
              label="登录账号"
              placeholder="请输入登录账号"
              rules={[
                { required: true, message: '不能为空' },
                {
                  validator: (_, value) => {
                    // TODO
                    let regu = /^[a-z][a-z0-9_]{2,63}$/
                    if (regu.test(value)) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject(
                        new Error('请输入小写字母、数字、下划线(以字母开头,最少3位)')
                      )
                    }
                  },
                },
              ]}
            />
          </Col>
          {modalType != 'edit' && (
            <Col span={24}>
              <ProFormText
                name="pwd"
                label="登录密码"
                placeholder="请输入登录密码"
                rules={[{ required: true, message: '不能为空' }]}
              />
            </Col>
          )}

          <Col span={24}>
            <ProFormText
              name="name"
              label="用户名"
              placeholder="请输入用户名"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          {modalType == 'edit' && (
            <Col span={24}>
              <ProFormText name="pwd" label="新密码" placeholder="请输入新登录密码" />
            </Col>
          )}
          <Col span={24}>
            <ProFormText name="mobile" label="手机号" placeholder="请输入手机号" />
          </Col>
          <Col span={24}>
            <ProFormSelect
              name="org_id"
              options={orgList}
              fieldProps={{
                fieldNames: { label: 'name', value: 'id' },
              }}
              label="所属单位"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
          <Col span={24}>
            <ProFormSelect
              name="role_id"
              options={roleList}
              fieldProps={{
                fieldNames: { label: 'name', value: 'id' },
              }}
              label="角色"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}
