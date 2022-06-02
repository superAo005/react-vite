/** 事件监听处理
 * https://x6.antv.vision/zh/docs/tutorial/intermediate/events
 * @Author: superao
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: superao
 * @Last Modified time: 2022-04-08 14:36:18
 */
import { Edge, Graph, Node } from '@antv/x6'
import { Size } from '@antv/x6/lib/types/common'
import Flow from '../FlowChart'
import { FLOW_CONFIG, FLOW_TYPE, IFLOW_CONFIG_ITEM } from './config/flows'
import { NODE_TYPE } from './config/nodes'
import { INode, INodeData } from './dataManager'
interface IEventManagerParam {
  flowRef: Flow
  type: FLOW_TYPE
}
export default class EventManager {
  graphRef: Graph
  graphType: FLOW_TYPE
  graphTypeConfig: IFLOW_CONFIG_ITEM
  flowRef: Flow
  constructor(props: IEventManagerParam) {
    this.flowRef = props.flowRef
    this.graphRef = props.flowRef?.getGraphRef()
    this.graphType = props.flowRef?.getGraphType()
    this.graphTypeConfig = FLOW_CONFIG[this.graphType]
    this.init()
  }
  private init() {
    if (!this.graphRef) return
    // 节点 的事件
    this.graphRef.on('node:click', ({ node }) => {
      this.handleNodeClick(node)
    })
    this.graphRef.on('node:dblclick', ({ node }) => {
      this.handleNodeDblclick(node)
    })
    this.graphRef.on('node:mouseenter', ({ x, y, e, node }) => {
      this.handleNodeMouseenter(node)
    })
    this.graphRef.on('node:mouseleave', ({ node }) => {
      this.handleNodeMouseleave(node)
    })
    // 更新节点内容后，节点的高度可能会变大
    // 所以重新更新其下后代节点的y坐标
    this.graphRef.on('node:change:size', (data) => {
      return this.handleNodeSizeChange(data)
    })
    // 边 的事件
    this.graphRef.on('edge:mouseenter', ({ edge }) => {
      this.handleEdgeMouseenter(edge)
    })
    this.graphRef.on('edge:mouseleave', ({ edge }) => {
      this.handleEdgeMouseleave(edge)
    })
    this.graphRef.on('edge:connected', ({ edge }) => {
      this.handleEdgeConnected(edge)
    })
  }
  updateY(node: Node) {
    const formatPositionYData = this.flowRef.layout.getFormatPositionYData(
      node?.id,
      this.flowRef.getGraphData()
    )
    this.flowRef.layout.updateGraphNodePosition(formatPositionYData?.nodes)
  }
  handleEdgeConnected(edge: Edge) {
    const node = this.flowRef.dataManager.getCellById(edge?.target?.cell) as INode
    const { nodeData } = node?.data || {}
    if (nodeData?.type === NODE_TYPE.ROUTE) {
      this.flowRef.edgeManager.addLabel(edge?.id)
    }
  }
  handleEdgeMouseenter = (edge: Edge) => {
    if (this.flowRef.verifyManager.verifyCanDeteleNode(edge?.target.cell)) {
      this.flowRef.edgeManager.addEdgeDeleteBtn(edge)
    }
  }
  handleEdgeMouseleave = (edge: Edge) => {
    this.flowRef.edgeManager.deleteEdgeDeleteBtn(edge)
  }
  /** 双击 */
  handleNodeDblclick(node: Node) {
    const { nodeData, busiData } = node?.getData<INodeData>() || {}
    this.flowRef?.onNodeDbClick(node?.id, { nodeData, busiData })
  }
  /** 单击 */
  handleNodeClick(node: Node) {
    const { nodeData, busiData } = node?.getData<INodeData>() || {}
    this.flowRef?.onNodeClick(node?.id, { nodeData, busiData })
  }
  /** 鼠标驶入 */
  handleNodeMouseenter(node: Node) {
    this.flowRef.nodeManager.addNodeMenu(node)
  }
  /** 鼠标离开 */
  handleNodeMouseleave(node: Node) {
    this.flowRef.nodeManager.deleteNodeMenu(node)
  }
  handleNodeSizeChange = (data: { node: Node; current: Size; previous: Size }) => {
    const {
      node,
      current, // 当前值
      previous,
    } = data || {}
    if (current.height !== previous.height) {
      // 获取节点的数据会有延迟，所以settimeout下
      setTimeout(() => {
        this.updateY(node)
      }, 50)
    }
  }
}
