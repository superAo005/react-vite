/* 节点管理
 * @Author: ymiaomiao.yang
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: ymiaomiao.yang
 * @Last Modified time: 2022-04-01 20:01:20
 */
import { Cell, Graph, Node } from '@antv/x6'
import React from 'react'
import '@antv/x6-react-shape'
import RectangleNode, { RECTANGLE_NODE } from './Component/RectangleNode'
import { NODE_TYPE, NODE_TYPE_CONFIG } from './config/nodes'
import FlowChart from '.'
import { Modal } from 'antd'
import { IBusiData, INodeData, IPosition } from './dataManager'
import nodeMenu from './Component/NodeMenu'
interface INodeManagerParam {
  flowRef: FlowChart
}
export enum PORT_TYPE {
  'IN' = 'IN',
  'OUT' = 'OUT',
}

const ports = {
  groups: {
    [PORT_TYPE.IN]: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          // 不能从这个链接桩出发去连接别人
          // 但是可以被连接
          magnet: 'passive',
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    },
    [PORT_TYPE.OUT]: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
        },
      },
    },
  },
  items: [
    {
      id: PORT_TYPE.IN,
      group: PORT_TYPE.IN,
    },
    {
      id: PORT_TYPE.OUT,
      group: PORT_TYPE.OUT,
    },
  ],
}
export default class NodeManager {
  graphRef: Graph
  flowRef: FlowChart
  constructor(data: INodeManagerParam) {
    this.flowRef = data?.flowRef
    this.graphRef = data?.flowRef?.getGraphRef()
    this.init()
  }
  /** 节点初始化 */
  private init() {
    this.registerNode()
  }
  private registerNode() {
    this.registerRectangleNode()
  }
  private registerRectangleNode() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    Graph.registerNode(
      RECTANGLE_NODE.name,
      {
        inherit: 'react-shape',
        component(node: Node) {
          return (
            <RectangleNode
              node={node}
              addNodeTool={self.flowRef.nodeManager.addNodeTool}
              renderNodeContent={self.flowRef.options.renderNodeContent}
            />
          )
        },
        ports,
        zIndex: 1,
        attrs: {
          root: {
            magnet: false,
          },
          body: {
            fill: '#fff',
            // stroke: '#000',
          },
        },
        data: {
          nodeData: {},
          busiData: {},
        },
      },
      true
    )
  }
  /** 获取根节点 */
  getRootNodes() {
    return this.graphRef.getRootNodes()
  }
  /**获取除开始节点以外的其他根节点 */
  getOtherRootNode() {
    const rootNodes = this.flowRef.nodeManager
      .getRootNodes()
      ?.filter((item) => item.id !== this.flowRef.rootNodeId)
    return rootNodes
  }
  /**
   * 获取所有游离节点
   */
  getFreeNode() {
    const rootNodes = this.getOtherRootNode()
    let nodes = [...rootNodes]
    rootNodes?.forEach((item) => {
      const childNodes = this.getSuccessors(item?.id) as unknown as Node[]
      nodes = [...nodes, ...childNodes]
    })
    return nodes
  }
  /** 获取叶子节点 */
  getLeafNodes() {
    return this.graphRef.getLeafNodes()
  }
  /** 获取父节点 */
  getParentNode(nodeId: string): Cell[] {
    if (!nodeId) return []
    const parentNodeId = this.flowRef
      .getGraphData()
      ?.edges?.filter((item) => item?.target?.cell === nodeId)
      ?.map((item) => item?.source?.cell)
    //! 自带函数有问题； 自动连线时，节点直接连到根节点时 返回的父节点有时不包含根节点
    // return this.graphRef.getPredecessors(node, { distance: 1, deep: true })
    return parentNodeId?.map((item) => this.graphRef.getCellById(item))
  }
  /**
   * 获取子节点
   * 返回指定类型的子节点 可选
   * */
  getChildNode(parentNodeId: string, nodeType?: NODE_TYPE): Cell[] {
    if (!parentNodeId) return []
    const parentNode = this.graphRef.getCellById(parentNodeId)
    const allChildren = this.graphRef.getSuccessors(parentNode, { distance: 1, breadthFirst: true })
    if (nodeType)
      return allChildren?.filter((item) => {
        const { nodeData } = item.getData<INodeData>() || {}
        return nodeData.type === nodeType
      })
    return allChildren || []
  }
  /** 节点的前序节点 不包含当前节点 */
  getPredecessors(nodeId: string): Cell[] {
    if (!nodeId) return []
    const node = this.graphRef.getCellById(nodeId)
    return this.graphRef.getPredecessors(node)
  }
  /** 节点的后续节点 不包含当前节点 */
  getSuccessors(nodeId: string): Cell[] {
    if (!nodeId) return []
    const node = this.graphRef.getCellById(nodeId)
    return this.graphRef.getSuccessors(node)
  }
  /**
   * 给定节点id
   * 从当前id开始，往上爬
   * 返回包含该节点的上游路径
   * @param paths 初始路径列表
   * @param index 需要处理第几条路径
   * @param isIncludeCurNode 返回的路径列表 里是否包含当前节点 默认不包含
   * */
  getUpPathNodes(
    nodeId: string,
    paths: Cell[][] = [],
    index = 0,
    isIncludeCurNode = false
  ): Cell<Cell.Properties>[][] {
    const parentNodes = this.getParentNode(nodeId)
    const curNode = this.graphRef.getCellById(nodeId)
    if (parentNodes?.length) {
      paths[index] = paths[index] || []
      const curPath = paths[index]
      const pathCopy = [...curPath]
      parentNodes.forEach((item, i) => {
        // 如果有多个父节点
        // 复制出一条新路径，并追加当前父节点
        if (i > 0) {
          paths.push([...pathCopy, item])
          return this.getUpPathNodes(item?.id, paths, paths?.length - 1)
        } else {
          curPath.push(item)
          return this.getUpPathNodes(item?.id, paths, index)
        }
      })
    }
    // 现在节点路径的顺序 是从下游指向上游
    // 做个反转，改成顺序： 上游  => 下游
    const reversePaths = paths?.map((item) => item.reverse())
    if (isIncludeCurNode) {
      reversePaths?.forEach((item) => item.push(curNode))
    }
    return reversePaths
  }
  /**
   * 给定节点id
   * 从当前id开始，往下爬
   * 返回所有包含该节点的下游路径
   * 其中路径列表不包含当前节点的id
   * */
  getDownPathNodes(nodeId: string, paths: Cell[][] = [], index = 0, isIncludeCurNode = false) {
    const childNodes = this.getChildNode(nodeId)
    const curNode = this.graphRef.getCellById(nodeId)
    if (childNodes?.length) {
      paths[index] = paths[index] || []
      const curPath = paths[index]
      const pathCopy = [...curPath]
      childNodes.forEach((item, i) => {
        // 如果有多个子节点
        // 复制出一条新路径，并追加当前子节点
        if (i > 0) {
          paths.push([...pathCopy, item])
          return this.getDownPathNodes(item?.id, paths, paths?.length - 1)
        } else {
          curPath.push(item)
          return this.getDownPathNodes(item?.id, paths, index)
        }
      })
    }
    if (isIncludeCurNode) {
      paths?.forEach((item) => item.unshift(curNode))
    }
    return paths
  }
  /**
   * x轴方向 新增节点
   * @param nodeType
   * @param parentNodeId
   */
  addNode = (nodeType: NODE_TYPE, parentNodeId?: string) => {
    const isRootNode = nodeType === NODE_TYPE.START
    const nodeConfig = NODE_TYPE_CONFIG[nodeType]
    const { name } = nodeConfig || {}
    const target = this.graphRef.addNode({
      id: isRootNode ? this.flowRef.rootNodeId : undefined,
      position: this.flowRef.layout?.calculateNodePositon(parentNodeId),
      shape: RECTANGLE_NODE.name,
      data: {
        nodeData: {
          type: nodeType,
          name,
        },
      },
    })
    parentNodeId &&
      this.flowRef.edgeManager.addEdge({
        source: {
          cell: parentNodeId,
          port: PORT_TYPE.OUT,
        },
        target: {
          cell: target?.id,
          port: PORT_TYPE.IN,
        },
      })
    this.flowRef.layout.formatLayoutWhenAddNode(target?.id)
    if (nodeType === NODE_TYPE.ROUTE) {
      const defaultNodes = this.getChildNode(parentNodeId, NODE_TYPE.ROUTE_DEFAULT)
      if (!defaultNodes?.length) {
        this.addNode(NODE_TYPE.ROUTE_DEFAULT, parentNodeId)
      }
    }
  }
  deleteNode = (nodeId: string) => {
    // 根节点不可以删除
    if (nodeId === this.flowRef.rootNodeId) return
    const node = this.graphRef.getCellById(nodeId)
    this.flowRef.highlight([nodeId])
    Modal.confirm({
      maskClosable: true,
      centered: true,
      content: '确认删除该节点吗',
      onOk: () => {
        const { nodeData } = (node?.data as INodeData) || {}
        if (nodeData?.type === NODE_TYPE.ROUTE) {
          const [parentNode] = this.getParentNode(nodeId) || []
          const routeNodes = this.getChildNode(parentNode?.id, NODE_TYPE.ROUTE)
          const defaultNodes = this.getChildNode(parentNode?.id, NODE_TYPE.ROUTE_DEFAULT)
          if (defaultNodes?.length && routeNodes?.length <= 1) {
            // 移除路由default节点
            defaultNodes[0]?.remove()
          }
        }
        // 移除当前节点
        node?.remove()
      },
      onCancel: () => {
        this.flowRef.unHighlight([nodeId])
      },
    })
  }
  editNode = (nodeId: string, data: INodeData) => {
    this.flowRef.onNodeEdit(nodeId, data)
  }
  updateNodeData(nodeId: string, data: IBusiData) {
    const cell = this.graphRef.getCellById(nodeId)
    const curData = cell?.getData<INodeData>()
    cell?.setData(
      {
        ...curData,
        busiData: {
          ...data,
        },
      },
      { overwrite: true }
    )
  }
  /**
   * 主要是给路由节点 排序用
   * 查找路由节点的优先级
   */
  getRouteNodeLevel(nodeId: string) {
    const edge = this.flowRef.getGraphData().edges?.find((item) => item.target?.cell === nodeId)
    return edge?.data?.level
  }
  addNodeTool = (node: Node) => {
    if (node.hasTool('button')) return
    node.addTools({
      name: 'button',
      args: {
        markup: [
          {
            tagName: 'foreignObject',
            attrs: {
              y: -20,
              x: node.getSize()?.width - 20,
              // 随便写的小宽度 下面有 overflow: 'visible'
              // 太大的话hover后 不好离开
              width: 1,
              height: 1,
              nodeToolForeignObjectId: node?.id,
              overflow: 'hidden',
            },
            children: [
              {
                tagName: 'body',
                ns: 'http://www.w3.org/1999/xhtml',
                attrs: {
                  xmlns: 'http://www.w3.org/1999/xhtml',
                  style: 'width: 100%; height: 100%; background: transparent;',
                },
                children: [
                  {
                    tagName: 'div',
                    className: 'node-menu',
                    attrs: {
                      id: node?.id,
                      style: 'width: 0; height: 0;',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    })
  }
  addNodeMenu = (node: Node) => {
    // node-tool-foreign-object-id 这个属性 取自addNodeTool里的nodeToolForeignObjectId
    const view = this.graphRef.view.$(`foreignObject[node-tool-foreign-object-id='${node?.id}']`)
    view[0] && view[0]?.setAttribute('overflow', 'visible')
    nodeMenu(node, document.getElementById(node?.id), this.flowRef)
  }
  deleteNodeMenu = (node: Node) => {
    const view = this.graphRef.view.$(`foreignObject[node-tool-foreign-object-id='${node?.id}']`)
    view[0] && view[0]?.setAttribute('overflow', 'hidden')
  }
  /** 获取节大小 */
  getNodeBBoxSize(nodeId: string): { width: number; height: number } {
    const node = this.graphRef.getCellById(nodeId)
    const view = this.graphRef.findViewByCell(node)
    const bbox = view?.getBBox()
    // 计算先于渲染的话，返回的节点宽度不准确
    return {
      width: Math.max(bbox?.width, RECTANGLE_NODE.defaultWidth),
      height: Math.max(bbox?.height, RECTANGLE_NODE.defaultHeight),
    }
  }
  /**
   *
   * @param nodeId
   * @param newPosition
   * @param options.isRelative 是否相对增加位移 默认 false
   */
  updateNodePosition(
    nodeId: string,
    newPosition: Partial<IPosition>,
    options?: { isRelative: boolean }
  ) {
    const { isRelative = false } = options || {}
    const node = this.graphRef.getCellById(nodeId)
    const position = node?.getProp('position')
    if (isRelative) {
      Object.keys(newPosition).forEach((key: keyof IPosition) => {
        newPosition[key] = position[key] + newPosition[key]
      })
    }
    node.setProp('position', {
      ...position,
      ...newPosition,
    })
  }
}
