import React, { useState, useRef, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, message } from 'antd'

import EditorForm from './Form'
import DetailForm from './DetailForm'
import { Select, Radio } from 'antd'

const { Option } = Select

const children = []
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
}

function handleChange(value) {
  console.log(`Selected: ${value}`)
}
function TableList() {
  const actionRef = useRef()
  const formRef = useRef()

  const [detailModalVisit, setDetailModalVisit] = useState(false)
  const [editModalVisit, setEditModalVisit] = useState(false)
  const [tableRowData, setTableRowData] = useState({})
  const [editRowData, setEditRowData] = useState({})

  const initColumns = [
    {
      title: '专家姓名',
      dataIndex: 'name',
      width: 120,
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
      {/* <Select
        mode="multiple"
        placeholder="Please select"
        defaultValue={['a10', 'c12']}
        onChange={handleChange}
        getPopupContainer={() => document.getElementById('content')}
        style={{ width: '100%' }}>
        {children}
      </Select> */}
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
          function randomString(e) {
            e = e || 32
            var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
              a = t.length,
              n = ''
            for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
            return n
          }
          // alert(randomString(6));

          return {
            data: body?.dtoList || [{ remark: randomString(10086) }],
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
      <DetailForm
        key="EditorFormDetail"
        title="数据源查看"
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
