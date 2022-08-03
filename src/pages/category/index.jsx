import React, { useState, useRef, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Popconfirm } from 'antd'

import EditorForm from './Form'
import DetailForm from './DetailForm'
import { del, getPageList } from '@/services/category'
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
      title: '主题名称',
      dataIndex: 'name',
    },
    {
      title: '是否菜单',
      dataIndex: 'is_menu',
      hideInSearch: true,
      valueEnum: {
        0: '是',
        1: '否',
      },
    },
    // {
    //   title: '菜单名称',
    //   dataIndex: 'menu_name',
    //   hideInSearch: true,
    // },
    {
      title: '主题描述',
      dataIndex: 'desc',
      hideInSearch: true,
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
              record.modalType = 'edit'
              onEdit(record)
            }}>
            编辑
          </a>
        </div>,
        <Popconfirm
          key="delete"
          title={`确认删除吗?`}
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            onDel(record)
          }}>
          <a key="del">删除</a>,
        </Popconfirm>,
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
