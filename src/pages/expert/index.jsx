import React, { useState, useRef, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message, Popconfirm } from 'antd'

import EditorForm from './Form'
import DetailForm from './DetailForm'
import { del, getPageList } from '@/services/expert'
import { getPageList as getFieldList } from '@/services/fields'

function TableList() {
  const actionRef = useRef()
  const formRef = useRef()

  const [detailModalVisit, setDetailModalVisit] = useState(false)
  const [editModalVisit, setEditModalVisit] = useState(false)
  const [tableRowData, setTableRowData] = useState({})
  const [editRowData, setEditRowData] = useState({})
  const [listEnum, setListEnum] = useState({})

  // 获取详情
  useEffect(() => {
    ;(async () => {
      // 领域 list
      const { data } = await getFieldList({
        page: 1,
        pageSize: 20,
        page_size: 20,
      })
      const list = data?.data || []
      const listEnumMap = list?.reduce((pre, next) => {
        pre[next.id] = next.name
        return pre
      }, {})

      setListEnum(listEnumMap)
    })()
  }, [])

  const initColumns = [
    {
      title: '专家姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        0: '男',
        1: '女',
      },
      hideInSearch: true,
    },

    {
      title: '民族',
      dataIndex: 'gender',
      hideInSearch: true,
    },
    {
      title: '政治面貌',
      dataIndex: 'political_status',
      hideInSearch: true,
    },
    {
      title: '籍贯',
      dataIndex: 'birthplace',
      hideInSearch: true,
    },
    {
      title: '毕业院校',
      dataIndex: 'graduate_school',
      hideInSearch: true,
    },
    {
      title: '专业',
      dataIndex: 'major',
      hideInSearch: true,
    },

    {
      title: '学历',
      dataIndex: 'education',
      hideInSearch: true,
    },
    {
      title: '学⼠',
      dataIndex: 'degree',
      hideInSearch: true,
    },
    {
      title: '公司名称',
      dataIndex: 'company',
      hideInSearch: true,
    },
    {
      title: '职称',
      dataIndex: 'professional_title',
      hideInSearch: true,
    },
    {
      title: '研究成果',
      dataIndex: 'research_findings',
      hideInSearch: true,
    },
    {
      title: '擅长领域',
      dataIndex: 'areas_of_expertise_id',
      hideInSearch: true,
      valueEnum: listEnum,
    },

    {
      title: '备注信息',
      dataIndex: 'remark',

      hideInSearch: true,
      width: 120,
    },

    {
      title: '创建时间',
      dataIndex: 'create_time',
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

        <Popconfirm key="del" title="确定删除吗?" onConfirm={() => onDel(record)}>
          <a key="del">删除</a>
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
    await del(record.expert_id)
    reload()
  }
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

          const { data = {} } = await getPageList(relParams)

          return {
            data: data?.data || [],
            success: true,
            total: data?.page_info?.total_data || 0,
          }
        }}
        search={{
          defaultCollapsed: false,
          labelWidth: 80,
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
        scroll={{ x: 1000 }}
        manualRequest={false}
        toolBarRender={false}
      />
      <DetailForm
        key="EditorFormDetail"
        title="查看"
        visible={detailModalVisit}
        listEnum={listEnum}
        onVisibleChange={setDetailModalVisit}
        tableRowData={tableRowData}
        onEdit={onEdit}
        reload={reload}></DetailForm>
      <EditorForm
        key="EditorFormEdit"
        visible={editModalVisit}
        onVisibleChange={setEditModalVisit}
        listEnum={listEnum}
        tableRowData={editRowData}
        title={editRowData.modalType == 'edit' ? '编辑' : '新增'}
        reload={reload}></EditorForm>
      ,
    </>
  )
}

export default TableList
