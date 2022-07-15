import React, { useState, useRef } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Image } from 'antd'

import EditorForm from './Form'
import DetailForm from './DetailForm'
import { del, getPageList } from '@/services/carousel'
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
      title: '轮播图名称',
      dataIndex: 'name',
      with: 150,
    },
    {
      title: '轮播图',
      dataIndex: 'slide_show_file_url',
      hideInSearch: true,
      render: (row) => <Image width={100} height={50} src={base_url + row} />,
      // width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: '启用',
        1: '禁用',
      },
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
      // width: 120,
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
        <div key="edit">
          <a
            onClick={() => {
              // const { id, title, type, category_id, year, poster_file_name, video_file_name } =
              //   record

              console.log({ record })
              record.modalType = 'edit'
              onEdit(record)
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
            size: 10,
            // status: 0,
          }

          const { data } = await getPageList(relParams)
          console.log('data', data)
          return {
            data: data || [],
            success: true,
            total: data?.count || 0,
          }
        }}
        pagination={false}
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
