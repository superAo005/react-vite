import React, { useState, useRef, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Image } from 'antd'

import EditorForm from './Form'
import DetailForm from './DetailForm'
import { del, getPageList } from '@/services/video'
import { base_url } from '@/utils'

function TableList() {
  const actionRef = useRef()
  const formRef = useRef()

  const [detailModalVisit, setDetailModalVisit] = useState(false)
  const [editModalVisit, setEditModalVisit] = useState(false)
  const [tableRowData, setTableRowData] = useState({})
  const [editRowData, setEditRowData] = useState({})

  const initColumns = [
    {
      title: '视频标题',
      dataIndex: 'title',
    },
    {
      title: '封面图',
      dataIndex: 'poster',
      hideInSearch: true,
      render: (row) => <Image width={100} height={50} src={base_url + row} />,
      width: 150,
    },
    {
      title: '视频主题',
      dataIndex: 'category_name',
      hideInSearch: true,
    },
    {
      title: '播放次数',
      dataIndex: 'play_times',
      hideInSearch: true,
      // width: 120,
    },
    {
      title: '下载次数',
      dataIndex: 'download_times',
      hideInSearch: true,
      // width: 120,
    },
    {
      title: '发布时间',
      dataIndex: 'publish_time',
      hideInSearch: true,
      // width: 100,
    },

    {
      title: '操作',
      key: 'option',
      width: 150,
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, record) => [
        // <a
        //   key="look"
        //   onClick={() => {
        //     onView(record)
        //   }}>
        //   查看
        // </a>,
        <div
          key="edit"
          className={record.status == '上线' || record.status == '上线' ? 'disabled' : ''}>
          <a
            onClick={() => {
              const {
                id,
                title,
                type,
                category_id,
                poster,
                url,
                year,
                poster_file_name,
                url_file_name,
              } = record
              onEdit({
                id,
                title,
                type,
                poster: poster_file_name,
                video_file_name: url_file_name,
                category: category_id,
                year,
                modalType: 'edit',
              })
            }}>
            编辑
          </a>
        </div>,
        <a
          key="del"
          onClick={() => {
            onDel(record)
          }}>
          删除
        </a>,
      ],
    },
  ]

  const reload = () => {
    actionRef.current.reload()
  }

  /**
   * 查看数据源
   */
  const onView = async (record) => {
    setDetailModalVisit(true)
    setTableRowData(record)
  }
  /**
   * 编辑数据源
   */
  const onEdit = async (record) => {
    setEditModalVisit(true)

    setEditRowData(record)
  }
  const onDel = async (record) => {
    await del(record.id)
    reload()
  }
  return (
    <>
      <ProTable
        headerTitle=""
        rowKey="id"
        columns={initColumns}
        actionRef={actionRef}
        formRef={formRef}
        // rowSelection={{
        //   // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        //   // 注释该行则默认不显示下拉选项
        //   // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        //   selectedRowKeys,
        //   // onChange: onSelectChange,
        //   onChange: (selectedRowKeys) => {
        //     console.log('selectedRowKeys changed: ', selectedRowKeys)
        //     setSelectedRowKeys(selectedRowKeys)
        //   },
        // }}
        request={async (params) => {
          const relParams = {
            ...params,
            page: params.current,
            page_size: params.pageSize,
          }

          const { data } = await getPageList(relParams)

          return {
            data: data?.paging_data || [],
            success: true,
            total: data?.count || 0,
          }
        }}
        search={{
          defaultCollapsed: false,
          labelWidth: 80,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button
              key="add"
              type="primary"
              onClick={() => {
                onEdit({
                  modalType: 'add',
                })
              }}>
              新增
            </Button>,
          ],
        }}
        scroll={{ x: 1200 }}
        manualRequest={false}
        toolBarRender={false}
      />
      <DetailForm
        key="EditorFormDetail"
        title="查看"
        visible={detailModalVisit}
        onVisibleChange={setDetailModalVisit}
        tableRowData={tableRowData}
        onEdit={onEdit}
        reload={reload}></DetailForm>
      <EditorForm
        key="EditorFormEdit"
        visible={editModalVisit}
        onVisibleChange={setEditModalVisit}
        tableRowData={editRowData}
        title={editRowData.modalType == 'edit' ? '编辑' : '新增'}
        reload={reload}></EditorForm>
      ,
    </>
  )
}

export default TableList
