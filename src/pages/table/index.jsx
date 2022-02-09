import React, { useState, useRef, useEffect, useCallback } from 'react'
import ProTable from '@ant-design/pro-table'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal, Space } from 'antd'
export default function Index(props) {
  const actionRef = useRef()
  const formRef = useRef()
  // 批量上下线
  // 批量上下线 --end
  const initColumns = [
    {
      title: '函数名称',
      dataIndex: 'funcName',
    },
    {
      title: '函数描述',
      dataIndex: 'funcDesc',
    },
    {
      title: '函数状态',
      dataIndex: 'draftEnable',
      hideInSearch: true,
    },

    {
      title: '创建人',
      dataIndex: 'createUserName',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      hideInSearch: true,
      valueType: 'dateTime',
      hideInTable: true,
    },
    {
      title: '更新人',
      dataIndex: 'updateUserName',
    },
    {
      title: '更新时间',
      dataIndex: 'updateAt',
      hideInSearch: true,
      valueType: 'dateTime',
      sorter: (a, b) => a.updateAt - b.updateAt,
    },
    {
      title: '操作',
      key: 'option',
      width: 200,
      valueType: 'option',
      fixed: 'right',
      align: 'left',
      render: (_, record) => {
        // if (isCanOption(roles, ['attribute_dict:edit'])) {
        return [
          <a
            key="edit"
            onClick={() => {
              onView(record)
            }}>
            查看
          </a>,
          <a
            key="edit"
            onClick={() => {
              onCopy(record)
            }}>
            复制
          </a>,
        ]
        // }
        // return null
      },
    },
  ]
  /**
   * 复制
   * @param {object} record
   */
  const onCopy = async (record) => {
    // goto(`feature-manage/func/details?type=copy&ruleNo=${record.funcName}`)
  }

  /**
   * 查看
   * @param {object} record
   */
  const onView = (record) => {
    // goto(`/feature-manage/func/detailsView?ruleNo=${record.funcName}`)
  }

  /**
   * 删除
   * @param {string} id
   */
  const onDelete = () => {
    Modal.confirm({
      title: '确认删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk: async (close) => {
        // let res = await deleteFeatureFunction({
        //   funcNames: selectedRowKeys,
        // })
        // if (res.code === '0') {
        //   message.success('删除成功')
        //   actionRef.current.reload()
        // } else {
        //   close()
        // }
      },
      // centered: true,
    })
  }

  const reload = useCallback(() => {
    actionRef.current.reload()
  }, [])

  return (
    <>
      <ProTable
        headerTitle=""
        rowKey="funcName"
        actionRef={actionRef}
        formRef={formRef}
        request={async (params, sorter) => {
          const sorterKey = Object.keys(sorter)[0]
          const sorterVal = Object.values(sorter)[0]
          const relParams = {
            ...params,
            pageNo: params.current,
            ascendBy: sorterVal === 'ascend' ? sorterKey : undefined,
            descendBy: sorterVal === 'descend' ? sorterKey : undefined,
          }
          delete relParams.current
          const body = {}
          // const { body, code, message: msg } = await getFuncList(relParams)
          return {
            data: body?.data || [],
            success: true,
            total: body?.totalCount || 0,
          }
        }}
        columns={initColumns}
        search={{
          defaultCollapsed: false,
          labelWidth: '100',
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button
              icon={<PlusOutlined />}
              key="submit"
              type="primary"
              onClick={() => {
                // goto(`feature-manage/func/details?type=add`)
              }}>
              新建
            </Button>,
          ],
        }}
        manualRequest={false}
        scroll={{
          x: 1100,
        }}
        // rowSelection={{
        //   selectedRowKeys,
        //   onChange: onSelectChange,
        // }}
        // toolBarRender={() => [
        //   <Button key="show" disabled={selectedRowKeys.length === 0} onClick={handleOnline}>
        //     批量申请上线
        //   </Button>,
        //   <Button key="out" disabled={selectedRowKeys.length === 0} onClick={handleOffline}>
        //     批量申请下线
        //   </Button>,
        //   <Button key="add" disabled={selectedRowKeys.length === 0} onClick={handleBatchAddRelease}>
        //     批量添加到待发布清单
        //   </Button>,
        //   <Button key="del" disabled={selectedRowKeys.length === 0} onClick={onDelete}>
        //     批量删除
        //   </Button>,
        // ]}
        // options={{
        //   search: false,
        //   show: false,
        //   density: false,
        //   setting: true,
        //   reload: false,
        // }}
      ></ProTable>
      {/* 批量申请上线/下线 */}
    </>
  )
}

// export default function Index(props) {
//   return <>table页面</>
// }
