import React, { useState, useRef, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message } from 'antd'

// import { connect } from 'react-redux'

import DataSourceForm from './Form'
import DataSourceDetailForm from './DetailForm'

function TableList(props) {
  const { statusEnum, sourceType } = props
  // let tempData = []
  const actionRef = useRef()
  const formRef = useRef()

  // const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const [detailModalVisit, setDetailModalVisit] = useState(false)
  const [editModalVisit, setEditModalVisit] = useState(false)
  const [tableRowData, setTableRowData] = useState({})
  const [editRowData, setEditRowData] = useState({})
  // const [drawerVisit, setDrawerVisit] = useState(false)

  const initColumns = [
    {
      title: '数据源编号',
      dataIndex: 'sourceNo',
      width: 100,
    },
    {
      title: '数据源名称',
      dataIndex: 'sourceName',
      width: 120,
    },
    // {
    //   title: 'sourceToQmqTopic',
    //   dataIndex: 'sourceToQmqTopic',
    //   // width: 120,
    //   hideInSearch: true,
    // },
    // {
    //   title: 'sourceFromQmqTopic',
    //   dataIndex: 'sourceFromQmqTopic',
    //   // width: 120,
    //   hideInSearch: true,
    // },

    {
      title: '描述',
      dataIndex: 'sourceDesc',

      hideInSearch: true,
      width: 120,
    },
    {
      title: '分类',
      dataIndex: 'demandType',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      valueEnum: statusEnum,
    },
    {
      title: '查询场景',
      dataIndex: 'sourceType',
      hideInTable: true,
      width: 120,
      valueEnum: sourceType,
      initialValue: '0',
      // valueEnum: {
      //   0: { text: 'CP源' },
      // },
    },

    // {
    //   title: '数据来源',
    //   dataIndex: 'demandType',
    //   hideInTable: true,
    //   width: 120,
    // },
    // TODO 从后台接口获取
    {
      title: 'CP点',
      dataIndex: 'demandType',
      hideInTable: true,
      width: 120,
      valueEnum: {
        0: { text: 'CP源' },
      },
    },

    {
      title: '创建人',
      dataIndex: 'createPerson',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '更新人',
      dataIndex: 'updatePerson',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      hideInSearch: true,
      width: 100,
    },

    {
      title: '操作',
      key: 'option',
      width: 150,
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      render: (_, record) => [
        <a
          key="look"
          onClick={() => {
            onView(record)
          }}>
          查看
        </a>,
        <div
          key="edit"
          className={record.status == '上线' || record.status == '上线' ? 'disabled' : ''}>
          <a
            onClick={() => {
              record.modalType = 'edit'
              onEdit(record)
            }}>
            编辑
          </a>
        </div>,
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

  return (
    <>
      <ProTable
        headerTitle=""
        rowKey="sourceNo"
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
            pageNo: params.current,
          }
          console.log(relParams)
          const body = {}
          // const { body, code, message: msg } = await query(relParams)
          // if (code != 0) {
          //   message.error(msg)
          // }
          // tempData = body?.dtoList
          return {
            data: body?.dtoList || [],
            success: true,
            total: body?.total || 0,
          }
        }}
        search={{
          defaultCollapsed: false,
          labelWidth: 120,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button
              key="submit"
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
        scroll={{ x: 1500 }}
        manualRequest={false}
        toolBarRender={false}
      />
      <DataSourceDetailForm
        key="DataSourceFormDetail"
        title="数据源查看"
        visible={detailModalVisit}
        onVisibleChange={setDetailModalVisit}
        tableRowData={tableRowData}
        onEdit={onEdit}
        reload={reload}></DataSourceDetailForm>
      <DataSourceForm
        key="DataSourceFormEdit"
        visible={editModalVisit}
        onVisibleChange={setEditModalVisit}
        tableRowData={editRowData}
        title={editRowData.modalType == 'edit' ? '数据源编辑' : '数据源新增'}
        reload={reload}></DataSourceForm>
      ,
    </>
  )
}

export default TableList
