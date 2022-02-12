import React, { useState, useRef, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'

import { getStatsList } from '@/services/expert'

function TableList() {
  const actionRef = useRef()
  const formRef = useRef()

  const initColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '抽取专家',
      dataIndex: 'name',
      width: 120,
      render: (_) => {
        return <>{Array.isArray(_) ? _.map((item) => <p key={item.name}>{item.name}</p>) : _}</>
      },
    },

    {
      title: '备注信息',
      dataIndex: 'remark',

      hideInSearch: true,
      width: 120,
    },
    {
      title: '项目创建人',
      dataIndex: 'creator',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      hideInSearch: true,
      width: 100,
    },
  ]

  return (
    <>
      <ProTable
        headerTitle=""
        rowKey="expert_id"
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

          const { data } = await getStatsList(relParams)

          return {
            data: data?.data || [],
            success: true,
            total: data?.page_info?.total_data || 0,
          }
        }}
        search={{
          defaultCollapsed: false,
          labelWidth: 80,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        scroll={{ x: 1200 }}
        manualRequest={false}
        toolBarRender={false}
      />
      ,
    </>
  )
}

export default TableList
