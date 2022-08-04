import React, { useRef, useState, useEffect } from 'react'
import { message, Col, Row, Form, Modal, Upload, Radio, Image } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormUploadButton,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form'
import { create, filexist, getPosterList, sliceUpload, update } from '@/services/video'
import { getPageList } from '@/services/category'
// import ProCard from '@ant-design/pro-card'
import { useSetState } from 'ahooks'

import { base_url, md5File } from '@/utils'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 },
}

export default (props) => {
  let { tableRowData, visible } = props
  let { modalType } = tableRowData
  const fileInfoRef = useRef(null)
  const [posterList, setPosterList] = useState([])

  const [fileList, setFileList] = useSetState({
    posterList: [],
    videoList: [],
  })

  const formRef = useRef()
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()

  // 详情数据
  const [detail] = useState({
    ...tableRowData,
    radio: 'auto',
    type: '0',
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
          setFileList({
            posterList: [
              { uid: '', name: '', status: 'done', url: base_url + tableRowData.poster },
            ],
            videoList: [{ uid: '', name: '', status: 'done', url: base_url + tableRowData.url }],
          })
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
    // accept: 'video/*',
    withCredentials: true,
    beforeUpload: async (file) => {
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
              poster_file_name:
                values?.poster?.[0]?.response?.data?.file_name ||
                values?.poster_file_name ||
                tableRowData?.poster_file_name,
              // video_file_name: values?.poster?.[0]?.response?.data?.file_name,
              // type: 0,
              video_file_name:
                values?.video_file_name?.[0]?.response?.url ||
                values?.video_file_name ||
                tableRowData?.video_file_name,
            }
            if (params.radio == 'auto') {
              params.poster_file_name = values.posterauto
            }
            delete params.modalType
            delete params.radio
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
              name="title"
              label="资源标题"
              placeholder="请输入资源标题"
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          <Col span={24}>
            <ProFormSelect
              name="category"
              label="资源主题"
              placeholder="请选择资源主题"
              request={async () => {
                const { data } = await getPageList({ page: 1, page_size: 9998 })
                return data.paging_data.map((item) => ({ label: item.name, value: item.id }))
              }}
              rules={[{ required: true, message: '不能为空' }]}
            />
          </Col>

          {modalType != 'edit' && (
            <>
              <Col span={24}>
                <ProFormRadio.Group
                  name="type"
                  label="资源类型"
                  options={[
                    {
                      label: '电视类',
                      value: '0',
                    },
                    {
                      label: '广播类',
                      value: '1',
                    },
                  ]}
                />
              </Col>
              <Col span={24}>
                <ProFormDependency name={['type']}>
                  {({ type }) => {
                    console.log(type)
                    if (type == '0') {
                      return (
                        <ProFormRadio.Group
                          name="radio"
                          label="封面方式"
                          options={[
                            {
                              label: '自动截取',
                              value: 'auto',
                            },
                            {
                              label: '手动上传',
                              value: 'manual',
                            },
                          ]}
                        />
                      )
                    } else {
                      // 自动
                      return null
                    }
                  }}
                </ProFormDependency>
              </Col>

              <Col span={24}>
                <ProFormDependency name={['radio', 'type']}>
                  {({ radio, type }) => {
                    console.log(radio)
                    if (radio == 'manual' || type == '1') {
                      return (
                        <ProFormUploadButton
                          name="poster"
                          label="封面图"
                          max={1}
                          // fileList={fileList.posterList}
                          rules={[{ required: true, message: '不能为空' }]}
                          fieldProps={{
                            name: 'file',
                            action: 'api/hn/bpsa/common/file/upload',
                            listType: 'picture-card',
                            ...uploadProps,
                            accept: 'image/*',
                          }}
                          action="api/hn/bpsa/common/file/upload"
                        />
                      )
                    } else {
                      // 自动
                      return (
                        <Form.Item
                          name="posterauto"
                          label="封面图"
                          rules={[
                            {
                              required: true,
                            },
                          ]}>
                          <Radio.Group>
                            {posterList?.map((item) => (
                              <Radio
                                value={item.poster_file_name}
                                key={item.poster_file_name}
                                style={{ alignItems: 'center' }}>
                                <Image width={100} src={base_url + item.poster_file_url} />
                              </Radio>
                            ))}
                            {/* <Radio value={1} style={{ alignItems: 'center' }}>
                              <Image
                                width={100}
                                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                              />
                            </Radio>
                            <Radio value={2}>B</Radio>
                            <Radio value={3}>C</Radio>
                            <Radio value={4}>D</Radio> */}
                          </Radio.Group>
                        </Form.Item>
                      )
                    }
                  }}
                </ProFormDependency>
              </Col>

              <Col span={24}>
                <ProFormUploadButton
                  name="video_file_name"
                  label="资源内容"
                  max={1}
                  // fileList={fileList.videoList}
                  rules={[{ required: true, message: '不能为空' }]}
                  action="api/hn/bpsa/common/file/upload"
                  fieldProps={{
                    name: 'file',
                    listType: 'picture-card',
                    ...uploadProps,
                    accept: 'video/mp4,audio/mp3',
                    beforeUpload: async (file) => {
                      let pattern = /^.*\.(?:mp4|mp4|mp3)$/i
                      let isMp4 = pattern.test(file.name)
                      // if (!fileType) {
                      //   message.error(`${file.name} 不是excel文件`)
                      //   return false
                      // }

                      if (!isMp4) {
                        Modal.error({
                          title: '文件格式错误，不允许上传~',
                        })
                        return false
                      }
                      let fileInfo = await md5File(file)
                      console.log('fileInfo', fileInfo)
                      fileInfoRef.current = {
                        ...fileInfo,
                        file_name: file.name,
                      }
                      return isMp4 ? true : Upload.LIST_IGNORE
                    },
                    customRequest: async (option) => {
                      const { file } = option
                      console.log('customRequest', file)
                      try {
                        // 使用第三方服务进行文件上传
                        const { size, md5Key, fileList, file_name } = fileInfoRef.current
                        const { data } = await filexist({
                          type: 1,
                          md5: md5Key,
                          file_name,
                        })
                        const { exist, file_name: res_file_name } = data
                        console.log('resfilexist', data)
                        if (exist == 1) {
                          // 文件已存在
                          const { data: posterData } = await getPosterList(res_file_name)
                          const { poster_grab_list } = posterData
                          setPosterList(poster_grab_list || [])
                          option.onSuccess(
                            {
                              name: file_name,
                              url: res_file_name,
                            },
                            file
                          )
                          return
                        } else {
                          // 文件不存在
                          // option.onSuccess(
                          //   {
                          //     name: file_name,
                          //     url: res_file_name,
                          //   },
                          //   file
                          // )

                          const sliceReq = fileList.map((fileItem, index) => {
                            const formData = new FormData()
                            formData.append('type', 1) // 每次传输文件要带上文件总大小
                            formData.append('md5', md5Key) // 每次传输文件要带上文件总大小
                            formData.append('file', fileItem.file) // 每次传输文件要带上文件总大小
                            formData.append('file_name', fileItem.name) // 每次传输文件要带上文件总大小
                            formData.append('slice_index', fileItem.key)
                            formData.append('slice_total_index', fileList.length)
                            return sliceUpload(formData)
                          })

                          // const result = await uploadService.upload(file)
                          Promise.all(sliceReq).then(async (res) => {
                            console.log('上传成功')
                            // option.onSuccess(res?.url)
                            option.onSuccess(
                              {
                                name: file_name,
                                url: res_file_name,
                              },
                              file
                            )
                            const { data: posterData } = await getPosterList(res_file_name)
                            const { poster_grab_list } = posterData
                            setPosterList(poster_grab_list || [])
                            fileInfoRef.current = null
                          })
                        }

                        // onSuccess的回调参数可以在 UploadFile.response 中获取
                        // option.onSuccess(result.url)
                      } catch (error) {
                        option.onError(error)
                      }
                    },
                    data: {
                      type: 1, //VIDEO
                    },
                  }}
                />
              </Col>
            </>
          )}
        </Row>
      </ModalForm>
    </>
  )
}

// a27575e105b3476a8ae98c1ae1c0d1a4.png
