import React, { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { useNavigate } from 'react-router-dom'
import { getStatsList } from '@/services/expert'
import DetailForm from './DetailForm'
import ReviewsForm from './ReviewsForm'

import { Tag } from 'antd'

function TableList() {
  const actionRef = useRef()
  const formRef = useRef()
  const navigate = useNavigate()
  const [detailModalVisit, setDetailModalVisit] = useState(false)
  const [editModalVisit, setEditModalVisit] = useState(false)
  const [tableRowData, setTableRowData] = useState({})
  const [reviewModalVisit, setReviewModalVisit] = useState(false)
  const [reviewData, setReviewData] = useState({})
  const [editRowData, setEditRowData] = useState({})
  const showButton = (needRole) => {
    const allRoles = JSON.parse(localStorage.getItem('roleList'))
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
                  <Tag color="blue" key={item.name} onClick={() => onReviewView(item)}>
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
              key="look"
              onClick={() => {
                onView(record)
              }}>
              查看
            </a>,
            <a
              key="del"
              onClick={() => {
                // onDel(record)
                navigate(`/extract`, { state: { record } })
              }}>
              重新抽取
            </a>,
          ]
        } else {
          return [
            <a
              key="look"
              onClick={() => {
                onView(record)
              }}>
              查看
            </a>,
          ]
        }
      },
    },
  ]
  const reload = () => {
    actionRef.current.reload()
  }

  /**
   * 查看详情
   */
  const onView = async (record) => {
    setDetailModalVisit(true)
    setTableRowData(record)
  }

  /**
   * 查看专家评审经历
   */
  const onReviewView = async (record) => {
    setReviewModalVisit(true)
    setReviewData(record)
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
        rowKey="pid"
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
      <DetailForm
        key="EditorFormDetail"
        title="查看"
        visible={detailModalVisit}
        onVisibleChange={setDetailModalVisit}
        tableRowData={tableRowData}
        onEdit={onEdit}
        reload={reload}></DetailForm>
      <ReviewsForm
        key="ReviewsForm"
        title="查看"
        visible={reviewModalVisit}
        onVisibleChange={setReviewModalVisit}
        tableRowData={reviewData}
        onEdit={onEdit}
        reload={reload}></ReviewsForm>
      ,
    </>
  )
}

export default TableList
