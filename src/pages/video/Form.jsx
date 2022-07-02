import React, { useRef, useState, useEffect } from 'react'
import { Button, message, Col, Row, Form, Modal, Upload } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form'
import { create, edit } from '@/services/expert'
import { getPageList } from '@/services/category'
// import ProCard from '@ant-design/pro-card'

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
  }

  let { tableRowData, visible } = props
  let { modalType } = tableRowData
  const formRef = useRef()
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()

  // 详情数据
  const [detail] = useState({
    ...tableRowData,
  })

  // tableRowData
  console.log('tableRowData', tableRowData)
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
          // let data = {}
          // setDetail(data)
          modalForm.setFieldsValue(tableRowData)
        })()
      } else {
        modalForm.setFieldsValue({})
      }
    }
  }, [visible])

  // const uploadProps = {
  //   beforeUpload: beforeUploadFile,
  //   onDownload: onDownload,
  //   onRemove: onRemove,
  //   withCredentials: true,
  //   maxCount: 1,
  //   // onChange: onChange,
  //   // showUploadList: {
  //   //   showDownloadIcon,
  //   //   showRemoveIcon,
  //   // },
  // }
  const uploadProps = {
    headers: {
      // 'rsk-sso-token': getCookie(ssokey),
      // 'user-work-domain': workDomain,
    },
    withCredentials: true,
    beforeUpload: (file) => {
      let pattern = /^.*\.(?:xls|xlsx)$/i
      let fileType = pattern.test(file.name)
      const isLt100M = file.size / 1024 / 1024 < 100
      // if (!fileType) {
      //   message.error(`${file.name} 不是excel文件`)
      //   return false
      // }
      debugger
      if (!isLt100M) {
        Modal.error({
          title: '超过100M限制，不允许上传~',
        })
        return false
      }
      return isLt100M ? true : Upload.LIST_IGNORE
    },
    onChange(info) {
      if (info.file.status === 'done') {
        const res = info.file.response
        // let errorCon = res.body?.resultList?.map((item, i) => {
        //   if (!item.success) {
        //     return <p key={i}>{`第${item.rowIndex}行失败,失败原因:${item.msg}`}</p>
        //   }
        // })
        let errorCon = res?.body?.hasError
      } else if (info.file.status === 'error') {
        message.error(`文件上传失败`)
      }
    },
    onPreview: async (file) => {
      let src = file.url
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(file.originFileObj)
          reader.onload = () => resolve(reader.result)
        })
      }
      const image = new Image()
      image.src = src
      const imgWindow = window.open(src)
      imgWindow?.document.write(image.outerHTML)
    },
    // showUploadList: false,
    // multiple: true,
    // defaultFileList,
    data: {
      type: 0, //VIDEO_POSTER
    },
  }
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
            delete params.modalType
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
              name="title"
              label="视频标题"
              placeholder="请输入视频标题"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormSelect
              name="category"
              label="视频主题"
              placeholder="请选择视频标题"
              request={async () => {
                const { data } = await getPageList({ page: 1, page_size: 9998 })
                return data.paging_data.map((item) => ({ label: item.name, value: item.id }))
              }}
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormUploadButton
              name="poster"
              label="封面图"
              max={1}
              rules={[{ required: true, message: '不能为空' }]}
              fieldProps={{
                name: 'file',
                action: 'api/hn/bpsa/common/file/upload',
                listType: 'picture-card',
                ...uploadProps,
              }}
              action="api/hn/bpsa/common/file/upload"
            />
          </Col>

          <Col span={24}>
            <ProFormUploadButton
              name="video"
              label="视频内容"
              max={1}
              action="api/hn/bpsa/common/file/upload"
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                ...uploadProps,
                data: {
                  type: 1, //VIDEO_POSTER
                },
              }}
            />
          </Col>

          {/* <Col span={24}>
            <ProFormUploadButton
              name="video"
              label="视频内容"
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
              }}
            />
          </Col> */}

          {/* <Col span={24}>
            <ProFormTextArea
              name="remark"
              label="备注信息"
              placeholder="请输入备注信息 "
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col> */}
        </Row>
      </ModalForm>
    </>
  )
}

// a27575e105b3476a8ae98c1ae1c0d1a4.png
