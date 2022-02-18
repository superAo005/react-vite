import React, { useRef } from 'react'
import ProTable from '@ant-design/pro-table'
import { useNavigate } from 'react-router-dom'
import { getStatsList } from '@/services/expert'

import { Tag } from 'antd'

function TableList() {
  const actionRef = useRef()
  const formRef = useRef()
  const navigate = useNavigate()

  const showButton = (needRole) => {
    const allRoles = JSON.parse(localStorage.getItem('roleList'))
    debugger
    return !allRoles.includes(needRole)
  }
  const initColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '抽取专家',
      dataIndex: 'expert_select_details',
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

    {
      title: '备注信息',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '项目创建人',
      dataIndex: 'creator',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      width: 150,
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        if (showButton('0003dd6b8d534e8eb075fb6a0a590003')) {
          return [
            <a
              key="del"
              onClick={() => {
                // onDel(record)
                navigate(`/extract`, { state: { record } })
              }}>
              重新抽取
            </a>,
          ]
        }
      },
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

          console.log('relParams', relParams)
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
