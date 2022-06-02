/* 数据管理
 * @Author: ymiaomiao.yang
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: ymiaomiao.yang
 * @Last Modified time: 2022-04-08 19:36:36
 */
import { Cell, Edge, Graph } from '@antv/x6'
import FlowChart from '.'
import { NODE_TYPE } from './config/nodes'
interface INodeManagerParam {
  flowRef: FlowChart
}
interface TerminalData {
  cell: string
  port: string
}
export interface IEdge extends Cell.Properties {
  /** edge 路径优先级 */
  data: IEdgeData
  source: TerminalData
  target: TerminalData
}
export interface INode extends Cell.Properties {
  data: INodeData
}
export interface GraphData {
  edges: IEdge[]
  nodes: INode[]
}

export interface ICustomerNodeData {
  type: NODE_TYPE
  name: string
  isHighLight: boolean
  highLightColor: string
}
export type IBusiData = Record<string, any>

export interface INodeData {
  busiData: IBusiData
  nodeData: ICustomerNodeData
}
export interface IEdgeData {
  level: number
  /** 取消高亮 复原线条颜色时用*/
  lineStroke?: string
}
export interface IPosition {
  x: number
  y: number
}
export default class NodeManager {
  graphRef: Graph
  flowRef: FlowChart
  constructor(data: INodeManagerParam) {
    this.flowRef = data?.flowRef
    this.graphRef = data?.flowRef?.getGraphRef()
  }
  /**
   * 在 nodes列表里查询 指定id的node
   * @param nodeId
   * @param graphData 默认取当前画布数据
   * @returns
   */
  getCellById(nodeId: string, graphData?: (INode | IEdge)[]): INode | IEdge {
    const { nodes: allNodes, edges: allEdges } = this.flowRef.getGraphData()
    graphData = graphData ? graphData : [...allNodes, ...allEdges]
    return graphData?.find((item) => item.id === nodeId)
  }
  /**
   * 查询 nodeId 的父节点
   * graphData 默认取当前画布数据
   * */
  getParentNode(nodeId: string, options?: { graphData?: GraphData }): INode[] {
    if (!nodeId) return []
    const { graphData = this.getGraphData() } = options || {}
    const parentNodeId = graphData?.edges
      ?.filter((item) => item?.target?.cell === nodeId)
      ?.map((item) => item?.source?.cell)
    return parentNodeId?.map((item) => this.getCellById(item, graphData?.nodes) as INode)
  }
  /**
   * 获取子节点
   * nodeType 只查询某一类型的子节点
   * graphData 只在改节点列表里查找子节点 不传默认取当前画布数据
   * */
  getChildNode(nodeId: string, options?: { nodeType?: NODE_TYPE; graphData?: GraphData }): INode[] {
    if (!nodeId) return []
    const { nodeType, graphData = this.getGraphData() } = options || {}
    const childNodeId = graphData?.edges
      ?.filter((item) => item?.source?.cell === nodeId)
      ?.map((item) => item?.target?.cell)
    let childNode = childNodeId?.map((item) => this.getCellById(item, graphData?.nodes) as INode)
    if (nodeType)
      childNode = childNode?.filter((item) => {
        return item.data?.nodeData.type === nodeType
      })
    return childNode
  }
  getSuccessors(
    nodeId: string,
    options?: { nodeType?: NODE_TYPE; graphData?: GraphData }
  ): INode[] {
    if (!nodeId) return []
    const { graphData = this.getGraphData() } = options || {}
    let nodes: INode[] = []
    const getSuccessor = (curId: string) => {
      const childNode = this.getChildNode(curId, { graphData })
      nodes = [...nodes, ...childNode]
      childNode.forEach((item) => {
        getSuccessor(item.id)
      })
    }
    getSuccessor(nodeId)
    return nodes
  }
  /**
   * 指定父节点id 对其子节点进行排序
   * 排序标准:
   * 如果子节点是路由节点则按level进行排序，level越小 优先级越高，排列越靠左
   * 如果子节点不是路由 则原顺序返回
   * @param parentNodeId
   * @returns
   */
  sortChildNodeByRouteLevel(
    parentNodeId = this.flowRef.rootNodeId,
    graphData?: GraphData
  ): INode[] {
    const childNodes = this.getChildNode(parentNodeId, { graphData })
    const hasRoute = childNodes?.find((item) => item.data?.nodeData?.type === NODE_TYPE.ROUTE)
    if (hasRoute) {
      return childNodes?.sort((a, b) => {
        const aType = a.data?.nodeData?.type
        const bType = b.data?.nodeData?.type
        // 不是路由 往后移
        if (aType !== NODE_TYPE.ROUTE) return 1
        if (bType !== NODE_TYPE.ROUTE) return -1
        const aLevel = this.flowRef.nodeManager.getRouteNodeLevel(a.id)
        const bLevel = this.flowRef.nodeManager.getRouteNodeLevel(b.id)
        return aLevel - bLevel
      })
    }
    return childNodes
  }
  /**x坐标升序 */
  sortByX(nodes: INode[]) {
    nodes?.sort((a, b) => {
      const aX = a?.position?.x
      const bX = b?.position?.x
      return aX - bX
    })
    return nodes
  }
  sortChildNodesByPositionX(parentNodeId: string, graphData: GraphData) {
    const childNodes = this.getChildNode(parentNodeId, { graphData })
    childNodes?.sort((a, b) => {
      const aX = a?.position?.x
      const bX = b?.position?.x
      return aX - bX
    })
    return childNodes
  }
  /** x坐标升序 */
  sortSuccessorsByPositionX(parentNodeId: string, graphData: GraphData) {
    const childNodes = this.getSuccessors(parentNodeId, { graphData })
    childNodes?.sort((a, b) => {
      const aX = a?.position?.x
      const bX = b?.position?.x
      return aX - bX
    })
    return childNodes
  }
  /**
   * 指定父节点id 对其子节点进行排序
   * 排序标准: y坐标升序
   * @param parentNodeId
   * @returns
   */
  sortParentNodesByPositionY(parentNodeId: string, graphData: GraphData) {
    const childNodes = this.getParentNode(parentNodeId, { graphData })
    childNodes?.sort((a, b) => {
      const aY = a.position?.y
      const bY = b.position?.y
      return aY - bY
    })
    return childNodes
  }
  sortParentNodesByPositionX(parentNodeId: string, graphData: GraphData) {
    const childNodes = this.getParentNode(parentNodeId, { graphData })
    return this.sortByX(childNodes)
  }
  getGraphData() {
    const cells = this.graphRef.toJSON()?.cells || []
    const edges = cells.filter((item) => item.shape === 'edge') as unknown as IEdge[]
    const nodes = cells.filter((item) => item.shape !== 'edge') as unknown as INode[]
    return {
      edges,
      nodes,
    }
  }
  /**
   * 转换
   * 并去重
   * @param nodes
   * @returns
   */
  transNode2NodeId(nodes: { id?: string }[]) {
    return Array.from(
      // 去重
      new Set(nodes?.map((item) => item.id))
    )
  }
  getAllNodeType(nodes: Cell[]) {
    return Array.from(
      // 去重
      new Set(
        nodes?.map((node) => {
          const { nodeData } = node.getData<INodeData>() || {}
          return nodeData.type
        })
      )
    )
  }
  /**
   * 重写节点meta数据
   * 直接修改入参node的position值 并返回
   * @param nodeId
   * @param newPosition
   * @param options.isRelative 是否相对增加位移 默认 false
   */
  updateNodePositionMeta(
    node: INode,
    newPosition: Partial<IPosition>,
    options?: { isRelative: boolean }
  ) {
    const { isRelative = false } = options || {}
    const position = node?.position
    if (isRelative) {
      Object.keys(newPosition).forEach((key: keyof IPosition) => {
        newPosition[key] = position[key] + newPosition[key]
      })
    }
    node.position = {
      ...position,
      ...newPosition,
    }
    node.position.x = Number(node.position.x.toFixed(1))
    node.position.y = Number(node.position.y.toFixed(1))
    // console.log('updateNodePositionMeta', node?.id, node.position)
    return node
  }
  /**
   * 过滤节点
   */
  filterNodes(nodes: INode[], dontNeedNodes: { id?: string }[]) {
    const dontNeedNodeIds = this.transNode2NodeId(dontNeedNodes)
    return nodes?.filter((item) => !dontNeedNodeIds?.includes(item.id))
  }
}
