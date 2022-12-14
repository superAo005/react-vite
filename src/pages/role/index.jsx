import React, { useRef } from 'react'
import ProTable from '@ant-design/pro-table'

import { Tag } from 'antd'

import { getPageList } from '@/services/role'

function TableList() {
  const actionRef = useRef()
  const formRef = useRef()

  const initColumns = [
    {
      title: '角色名称',
      dataIndex: 'role_name',
      width: '200px',
    },
    {
      title: '拥有权限',
      dataIndex: 'perms',
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
    //   title: '备注信息',
    //   dataIndex: 'remark',
    //   hideInSearch: true,
    // },

    // {
    //   title: '操作',
    //   key: 'option',
    //   width: 150,
    //   valueType: 'option',
    //   fixed: 'right',
    //   align: 'center',
    //   render: (_, record) => [
    //     <a
    //       key="del"
    //       onClick={() => {
    //         // onDel(record)
    //         navigate(`/extract`, { state: { record } })
    //       }}>
    //       重新抽取
    //     </a>,
    //   ],
    // },
  ]

  return (
    <>
      <ProTable
        headerTitle=""
        rowKey="role_id"
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

          const { data } = await getPageList(relParams)
          // const { data } = await getStatsList(relParams)

          return {
            data: data || [],
            success: true,
            total: data?.length || 0,
          }
        }}
        pagination={false}
        search={false}
        scroll={{ x: 1200 }}
        manualRequest={false}
        toolBarRender={false}
      />
      ,
    </>
  )
}

export default TableList
