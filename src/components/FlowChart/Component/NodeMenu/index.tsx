import React from 'react'
import { Menu } from '@antv/x6-react-components'
import { Node } from '@antv/x6'
import ReactDOM from 'react-dom'
import FlowChart from '../..'
import { NODE_TYPE, NODE_TYPE_CONFIG } from '../../config/nodes'
import { INodeData } from '../../dataManager'
import './index.scss'

enum MENU_TYPE {
  'EDIT' = 'EDIT',
  'DELETE' = 'DELETE',
}
export default (node: Node, containerRef: HTMLElement, flowRef: FlowChart) => {
  const getIsShowEdit = () => {
    const { nodeData } = node?.getData<INodeData>() || {}
    const { type } = nodeData || {}
    return type !== NODE_TYPE.START
  }
  const getIsShowDelete = () => {
    const canDeteleNode = flowRef.verifyManager.verifyCanDeteleNode(node?.id)
    return canDeteleNode
  }
  const getChildNodeType = () => {
    const childType = flowRef.verifyManager.getAddNodeMenu(node?.id)
    if (!childType?.length)
      return <Menu.Item disabled key="empty" name="empty" text="无可添加节点" />
    return (
      <Menu.SubMenu text="添加子节点">
        {childType?.map((item) => {
          return (
            <Menu.Item key={item.type} name={item.type} text={NODE_TYPE_CONFIG[item.type]?.name} />
          )
        })}
      </Menu.SubMenu>
    )
  }
  const handleMenuClick = (name: MENU_TYPE | NODE_TYPE) => {
    const { deleteNode, addNode, deleteNodeMenu } = flowRef.nodeManager
    const { onNodeEdit } = flowRef
    const { busiData, nodeData } = node?.getData<INodeData>() || {}
    switch (name) {
      case MENU_TYPE.EDIT:
        onNodeEdit && onNodeEdit(node?.id, { busiData, nodeData })
        break
      case MENU_TYPE.DELETE:
        deleteNode && deleteNode(node?.id)
        break
      // 增加节点
      default:
        addNode && addNode(name, node?.id)
        break
    }
    deleteNodeMenu(node)
  }
  const getMenu = () => {
    const menu = (
      <Menu onClick={handleMenuClick}>
        {getChildNodeType()}
        {getIsShowEdit() && <Menu.Item name={MENU_TYPE.EDIT}>编辑节点</Menu.Item>}
        {getIsShowDelete() && <Menu.Item name={MENU_TYPE.DELETE}>删除节点</Menu.Item>}
      </Menu>
    )
    return menu
  }
  ReactDOM.render(getMenu(), containerRef)
}
