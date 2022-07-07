import React, { useState, useRef, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Tag } from 'antd'

import EditorForm from './Form'
import DetailForm from './DetailForm'
import { del, getPageList } from '@/services/role'

function TableList() {
  const actionRef = useRef()
  const formRef = useRef()

  const [detailModalVisit, setDetailModalVisit] = useState(false)
  const [editModalVisit, setEditModalVisit] = useState(false)
  const [tableRowData, setTableRowData] = useState({})
  const [editRowData, setEditRowData] = useState({})

  const initColumns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: '200px',
    },
    {
      title: '角色标识',
      dataIndex: 'identity',
      width: '200px',
    },
    {
      title: '拥有权限',
      dataIndex: 'perm_assign_list',
      hideInSearch: true,
      render: (_) => {
        return (
          <>
            {Array.isArray(_)
              ? _.map((item) => (
                  <Tag color="blue" key={item.name}>
                    {item.name}
                  </Tag>
                ))
              : _}
          </>
        )
      },
    },

    // {
    //   title: '创建时间',
    //   dataIndex: 'create_time',
    //   hideInSearch: true,
    // },
    // {
    //   title: '更新时间',
    //   dataIndex: 'update_time',
    //   hideInSearch: true,
    // },
    {
      title: '操作',
      key: 'option',
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
        <a
          key="edit"
          onClick={() => {
            record.modalType = 'edit'
            record.perm_id_list = record.perm_assign_list.map((item) => item.id)
            record.auth = ['0-1-1', '0-1-2', '0-2-0']
            onEdit(record)
          }}>
          编辑
        </a>,
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
        rowKey="uid"
        columns={initColumns}
        actionRef={actionRef}
        formRef={formRef}
        request={async (params) => {
          const relParams = {
            ...params,
            page: params.current,
            page_size: params.pageSize,
          }

          const { data } = await getPageList(relParams)

          return {
            data: data || [],
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
        title="查看详情"
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
    </>
  )
}

export default TableList
