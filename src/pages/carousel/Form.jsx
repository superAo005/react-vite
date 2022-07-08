import React, { useRef, useState, useEffect } from 'react'
import { Image, message, Col, Row, Form, Modal, Upload } from 'antd'
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormUploadButton,
} from '@ant-design/pro-form'
import { create, update } from '@/services/carousel'

import { base_url } from '@/utils'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
}

export default (props) => {
  let { tableRowData, visible } = props
  let { modalType } = tableRowData
  // const [fileList, setFileList] = useSetState({
  //   posterList: [],
  //   videoList: [],
  // })

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
    // setFileList({
    //   posterList: [],
    //   videoList: [],
    // })
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
          // setFileList({
          //   slideList: [
          //     {
          //       uid: '',
          //       name: '',
          //       status: 'done',
          //       url: base_url + tableRowData.slide_show_file_url,
          //     },
          //   ],
          // })
          modalForm.setFieldsValue(tableRowData)
        })()
      } else {
        modalForm.setFieldsValue({})
      }
    }
  }, [visible])

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
      type: 2, //VIDEO_POSTER
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
        width="600px"
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

              // type: 0,
              slide_show_file_name:
                values?.slide?.[0]?.response?.data?.file_name ||
                values?.slide ||
                tableRowData?.slide_show_file_name,
            }
            delete params.modalType
            delete params.slide_show_file_url
            delete params.slide
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
              label="轮播图名称"
              placeholder="请输入轮播图名称"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormDigit
              label="轮播图顺序"
              name="sort"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          {/* <Col span={24}>
            <ProFormRadio.Group
              name="status"
              label="是否启用:"
              options={[
                {
                  label: '是',
                  value: 0,
                },
                {
                  label: '否',
                  value: 1,
                },
              ]}
            />
          </Col> */}

          {modalType == 'edit' && (
            <Col span={24}>
              <ProForm.Item label="现有封面">
                <Image width={200} height={100} src={base_url + tableRowData.slide_show_file_url} />
              </ProForm.Item>
            </Col>
          )}
          <Col span={24}>
            <ProFormUploadButton
              name="slide"
              label="上传轮播图"
              max={1}
              // fileList={fileList.videoList}
              rules={modalType == 'edit' ? [] : [{ required: true, message: '不能为空' }]}
              fieldProps={{
                name: 'file',
                action: 'api/hn/bpsa/common/file/upload',
                listType: 'picture-card',
                ...uploadProps,
              }}
              action="api/hn/bpsa/common/file/upload"
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}

// a27575e105b3476a8ae98c1ae1c0d1a4.png
