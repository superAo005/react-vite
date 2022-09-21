import React, {  useRef} from 'react'
import ProTable from '@ant-design/pro-table'
import { Button} from 'antd'

import { Select, Radio } from 'antd'
// import useUrlState from '@ahooksjs/use-url-state'

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
  const initColumns = [
    {
      title: '用户',
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
      <ProTable
        headerTitle=""
        rowKey="sourceNo"
        columns={initColumns}
        actionRef={actionRef}
        formRef={formRef}
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
          setState(params)
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
      
    </>
  )
}

export default TableList
