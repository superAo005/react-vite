/* 布局排版管理
 * @Author: superao
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-31 19:54:04
 */
import { Graph, Node } from '@antv/x6'
import FlowChart from '.'
import { isFull, toggleFull } from './Component/FullScreen'
import { RECTANGLE_NODE } from './Component/RectangleNode'
import { IToolBarType } from './Component/ToolBar'
import { NODE_TYPE } from './config/nodes'
import { IEdgeData, INode, INodeData } from './dataManager'
interface INodeManagerParam {
  flowRef: FlowChart
}
interface IPosition {
  x: number
  y: number
}

export default class Layout {
  graphRef: Graph
  flowRef: FlowChart
  layoutMargin = {
    x: 60,
    // 太小的话 连接线会拐弯
    y: 70,
  }
  constructor(data: INodeManagerParam) {
    this.flowRef = data?.flowRef
    this.graphRef = data?.flowRef?.getGraphRef()
    // this.init()
  }
  // ================ START 以下是布局相关 START ================
  getNodeBBoxSize(nodeId: string): { width: number; height: number } {
    const node = this.graphRef.getCellById(nodeId)
    const view = this.graphRef.findViewByCell(node)
    const bbox = view?.getBBox()
    return {
      width: Math.max(bbox?.width, RECTANGLE_NODE.defaultWidth),
      height: Math.max(bbox?.height, RECTANGLE_NODE.defaultHeight),
    }
  }
  getNodePosition(nodeId: string): { x?: number; y?: number } {
    const node = this.graphRef.getCellById(nodeId)
    return node?.getProp('position')
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
    console.log('newPosition', nodeId, newPosition)
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
  // 指定父节点id 对其子节点进行排序
  // 排序标准:
  // 如果子节点是路由节点则按level进行排序，level越小 优先级越高，排列越靠左
  // 如果子节点不是路由 则原顺序返回
  sortChildNodeByRouteLevel(parentNodeId = this.flowRef.rootNodeId) {
    const childNodes = this.flowRef.nodeManager.getChildNode(parentNodeId)
    const hasRoute = childNodes?.find(
      (item) => item.getData<INodeData>()?.nodeData?.type === NODE_TYPE.ROUTE
    )
    if (hasRoute) {
      childNodes?.sort((a, b) => {
        const aType = a.getData<INodeData>()?.nodeData?.type
        const bType = b.getData<INodeData>()?.nodeData?.type
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
  // 排序标准: x坐标升序
  sortChildNodesByPositionX(parentNodeId: string) {
    const childNodes = this.flowRef.nodeManager.getChildNode(parentNodeId)
    childNodes?.sort((a, b) => {
      const aX = a.getProp('position')?.x
      const bX = b.getProp('position')?.x
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
  sortParentNodesByPositionY(parentNodeId: string) {
    const childNodes = this.flowRef.nodeManager.getParentNode(parentNodeId)
    childNodes?.sort((a, b) => {
      const aY = a.getProp('position')?.y
      const bY = b.getProp('position')?.y
      return aY - bY
    })
    return childNodes
  }
  // 指定父节点 id
  // 返回新增一个子节点的画布位置
  calculateNodePositon = (parentNodeId?: string) => {
    // 没有父节点，按根节点对待
    if (!parentNodeId)
      return {
        x: (this.flowRef.graphContainerRef?.offsetWidth - RECTANGLE_NODE.defaultWidth) / 2,
        y: 30,
      }
    const sortedChildNodes = this.sortChildNodesByPositionX(parentNodeId)
    const rightmostNode = sortedChildNodes[sortedChildNodes?.length - 1]
    const rightmostNodeView = this.graphRef.findViewByCell(rightmostNode)
    const node = this.graphRef.getCellById(parentNodeId) as Node
    const view = this.graphRef.findViewByCell(node)
    const { x, y } = node?.getProp('position') || {}
    const { x: rightmostX } = rightmostNode?.getProp('position') || {}
    const newX = rightmostX
      ? rightmostX +
        this.layoutMargin.x +
        // 计算先于渲染的话，返回的节点宽度不准确
        Math.max(rightmostNodeView?.getBBox()?.width, RECTANGLE_NODE.defaultWidth)
      : x
    const newY = y + this.layoutMargin.y + view?.getBBox()?.height
    return {
      x: newX,
      y: newY,
    }
  }
  /**
   * 从根节点开始
   * 将父节点与子节点垂直对齐
   * 不是绝对对齐【因为在移动某子节点过程后，其父节点可能就不居中了】， 但是布局相对好些
   * @param needFormatNodeIds 需要处理的节点集合，不传默认所有的父节点都要计算
   * @memberof Layout
   */
  formatParentPositionXToCenter = (needFormatNodeIds?: string[]) => {
    const updateNodePositionX = (nodeId: string) => {
      const childNodes = this.sortChildNodesByPositionX(nodeId)
      if (childNodes?.length <= 1) return
      const [leftMostNode] = childNodes
      const rightMostNode = childNodes[childNodes?.length - 1]
      const rightMostNodeView = this.graphRef.findViewByCell(rightMostNode)
      const leftMostNodeView = this.graphRef.findViewByCell(leftMostNode)
      const nodeView = this.graphRef.findViewByCell(this.graphRef.getCellById(nodeId))
      const rightMostNodeViewWidth = rightMostNode
        ? Math.max(rightMostNodeView?.getBBox().width, RECTANGLE_NODE.defaultWidth)
        : 0
      const leftMostNodeViewWidth = leftMostNode
        ? Math.max(leftMostNodeView?.getBBox().width, RECTANGLE_NODE.defaultWidth)
        : 0
      const leftCenter = leftMostNode?.getProp('position')?.x + leftMostNodeViewWidth / 2
      const rightCenter = rightMostNode?.getProp('position')?.x + rightMostNodeViewWidth / 2
      const x =
        leftCenter +
        (rightCenter - leftCenter) / 2 -
        Math.max(nodeView?.getBBox()?.width / 2, RECTANGLE_NODE.defaultWidth / 2)
      this.updateNodePosition(nodeId, {
        x,
      })
      childNodes.forEach((childNode) => {
        // 不传默认都要重新布局
        if (!needFormatNodeIds || needFormatNodeIds?.includes(childNode?.id)) {
          updateNodePositionX(childNode?.id)
        }
      })
    }
    updateNodePositionX(this.flowRef.rootNodeId)
  }
  /**
   * 指定节点id
   * 将 节点id所在子树的右侧节点 集体右移
   * 右移距离
   * @param nodeId
   * @returns
   */
  formatAtNodeTreeRightNodes(nodeId: string) {
    const node = this.graphRef.getCellById(nodeId)
    const view = this.graphRef.findViewByCell(node)
    const getAtNodeTreeRightNodes = () => {
      // ? 为什么取第一个父节点
      const [parentNode] = this.flowRef.nodeManager.getParentNode(nodeId) || []
      const sortedChildNodes = this.sortChildNodesByPositionX(parentNode?.id)
      console.log('sortedChildNodes', nodeId, sortedChildNodes)
      // 没有子节点 则直接返回
      // 不需要新空间 无需重排
      if (sortedChildNodes?.length <= 1) return []
      const rightMostChildNode = sortedChildNodes[sortedChildNodes?.length - 1]
      const rightMostNodeX = rightMostChildNode?.getProp('position')?.x
      const atRightNodes = this.flowRef.getGraphData()?.nodes?.filter((item) => {
        const itemX = item.position?.x
        const isNodeSibling = sortedChildNodes?.find(
          (sortedChildNodesItem) => sortedChildNodesItem?.id === item.id
        )
        return itemX >= rightMostNodeX && !isNodeSibling
      })
      return atRightNodes
    }
    const atRightNodes = getAtNodeTreeRightNodes()
    const translateX =
      this.layoutMargin.x + Math.max(view?.getBBox()?.width, RECTANGLE_NODE.defaultWidth)
    // 非前序节点的其他右侧节点 集体右移,给新增节点腾地方
    atRightNodes?.forEach((item) => {
      this.updateNodePosition(item?.id, { x: translateX }, { isRelative: true })
    })
    // 因为上面节点整体右移了，所以这里把画布往回拉一拉
    this.graphRef.translate(
      this.graphRef.translate()?.tx - translateX / 2,
      this.graphRef.translate()?.ty
    )
  }
  /**
   * 在X轴方向上格式化
   * 指定节点id
   * 从指定id开始往上查找前序节点；并给前序节点重置X轴方向的位置
   */
  formatLayoutWhenAddNode(nodeId: string) {
    this.formatAtNodeTreeRightNodes(nodeId)
    const predecessorsNodesId = this.flowRef.dataManager.transNode2NodeId(
      this.flowRef.nodeManager.getPredecessors(nodeId)
    )
    this.formatParentPositionXToCenter(predecessorsNodesId)
  }
  /**
   * 指定节点
   *  1 从节点开始 往下查询；依据路由节点的优先级排序
   *  2 从节点开始 依次遍历子节点 重新计算子节点 x坐标
   * @param nodeId
   */
  formatLayoutX(nodeId = this.flowRef.rootNodeId, nodes?: INode[]) {
    // nodes = nodes ? nodes : this.flowRef.getGraphData()?.nodes
    const nodePosition = this.getNodePosition(nodeId)
    const childNodes = this.sortChildNodeByRouteLevel(nodeId)
    console.log('sortChildNodeByRouteLevel', nodeId, childNodes)
    childNodes.forEach((childNode, i) => {
      const preSiblingNode = childNodes[i - 1]
      const preSiblingNodePosition = this.getNodePosition(preSiblingNode?.id)
      const preSiblingNodeBBoxSize = this.getNodeBBoxSize(preSiblingNode?.id)
      const x =
        i > 0
          ? preSiblingNodePosition?.x + preSiblingNodeBBoxSize?.width + this.layoutMargin.x
          : nodePosition?.x
      console.log('preSiblingNode', childNode?.id, preSiblingNodePosition?.x)
      console.log('childNode', childNode?.id, x)
      // this.flowRef.dataManager.updateNodePositionMeta(
      this.updateNodePosition(
        childNode?.id,
        {
          x,
        }
        // nodes
      )
      i >= 1 && this.formatAtNodeTreeRightNodes(childNode.id)
    })
    childNodes.forEach((childNode) => {
      this.formatLayoutX(childNode?.id)
    })
  }
  /**
   * 指定节点id
   * 从指定id开始往下查找后继节点；并给后继节点重置Y轴方向的位置
   * 后继节点的y坐标 参考y值最大[最靠下]的父节点的y左边
   */
  formatLayoutY(nodeId: string = this.flowRef.rootNodeId, nodes?: INode[]) {
    // nodes = nodes ? nodes : this.flowRef.getGraphData()?.nodes
    if (!nodeId) return
    const childNodes = this.flowRef.nodeManager.getChildNode(nodeId)
    if (childNodes?.length) {
      childNodes?.forEach((item) => {
        const parentNodes = this.sortParentNodesByPositionY(item?.id)
        if (!parentNodes?.length) return
        const bottomMostParentNode = parentNodes[parentNodes?.length - 1]
        // const updatedNodes = this.flowRef.dataManager.updateNodePositionMeta(
        const updatedNodes = this.updateNodePosition(
          item.id,
          {
            y:
              this.getNodePosition(bottomMostParentNode.id)?.y +
              this.layoutMargin.y +
              // Math.random() * (parentNodes?.length - 1) * this.layoutMargin.y +
              this.getNodeBBoxSize(bottomMostParentNode.id).height,
          }
          // nodes
        )
        // return this.formatLayoutY(item.id, updatedNodes)
        return this.formatLayoutY(item.id)
      })
    }
    // return nodes
  }
  // TODO
  formatOtherRootNode = () => {
    const rootNodes = this.flowRef.nodeManager.getRootNodes()?.filter((item) => {
      item.id !== this.flowRef.rootNodeId
    })
    const nodePosition = this.getNodePosition(this.flowRef.rootNodeId)
    if (rootNodes?.length) {
      rootNodes.forEach((node, i) => {
        const preSiblingNode = rootNodes[i - 1]
        const preSiblingNodePosition = this.getNodePosition(preSiblingNode?.id)
        const preSiblingNodeBBoxSize = this.getNodeBBoxSize(preSiblingNode?.id)
        const x =
          i > 0
            ? preSiblingNodePosition?.x + preSiblingNodeBBoxSize?.width + this.layoutMargin.x
            : nodePosition?.x
        this.updateNodePosition(node?.id, {
          x,
        })
      })
    }
  }
  /**
   * 全局格式化
   * 1、Y轴 布局；更新节点y坐标
   * 2、X轴布局：
   *  2.1 从根节点开始 往下查询；依据路由节点的优先级排序
   *  2.2 从根节点开始 依次遍历子节点 重新计算子节点 x坐标
   *      依赖 calculateNodePositon、formatAtNodeTreeRightNodes
   */
  formatLayout() {
    const formatLayoutYNodes = this.formatLayoutY()
    this.formatLayoutX(this.flowRef.rootNodeId, formatLayoutYNodes)
    this.formatParentPositionXToCenter()
  }
  // ================ END 以上是布局相关 END ================

  // ================ 以下是操作相关 ================
  // https://x6.antv.vision/zh/docs/api/view/cellview/#highlight
  // 自带的highlight 不太好用
  // 取消 highlight时 需要传 一模一样的参数
  highlight = (
    nodeIds: string[],
    style?: {
      borderColor: string
    }
  ) => {
    const { borderColor = '#FEB663' } = style || {}
    if (!nodeIds?.length) return
    nodeIds.forEach((item) => {
      const cell = this.graphRef.getCellById(item)
      const ieEdge = this.graphRef.isEdge(cell)
      // 给边调用 highlight方法 体验不好
      // 1、箭头不会被高亮
      // 2、拖动边后 高亮的线条不会跟随移动
      if (ieEdge) {
        cell.setData({
          lineStroke: cell.getAttrs()?.line.stroke,
        })
        cell.attr('line/stroke', borderColor || 'red')
      } else {
        cell.setData<INodeData>({
          ...cell.getData<INodeData>(),
          nodeData: {
            ...cell.getData<INodeData>()?.nodeData,
            isHighLight: true,
            highLightColor: borderColor,
          },
        })
      }
    })
  }
  unHighlight = (nodeIds: string[]) => {
    nodeIds.forEach((item) => {
      const cell = this.graphRef.getCellById(item)
      const ieEdge = this.graphRef.isEdge(cell)
      const view = this.graphRef.findViewByCell(item)
      if (ieEdge) {
        const { lineStroke } = cell.getData<IEdgeData>()
        cell.attr('line/stroke', lineStroke)
        return
      }
      cell.setData<INodeData>({
        ...cell.getData<INodeData>(),
        nodeData: {
          ...cell.getData<INodeData>()?.nodeData,
          isHighLight: false,
        },
      })
    })
  }
  fullScreen() {
    toggleFull(this.flowRef.graphContainerRef)
    // 切换全屏后，容器的大小会变 所以需要重置下，否则计算的居中位置 视觉上有误差
    // 给全屏动作 一点时间
    setTimeout(() => {
      this.adaptive()
    }, 100)
  }
  adaptive() {
    const graphContainerRef = this.flowRef.graphContainerRef
    const isFullScreen = isFull(this.flowRef.graphContainerRef)
    // 切换全屏后，容器的大小会变 所以需要重置下，否则计算的居中位置 视觉上有误差
    this.flowRef
      .getGraphRef()
      ?.resize(
        isFullScreen ? screen.width : graphContainerRef?.parentElement.offsetWidth,
        isFullScreen ? screen.height : graphContainerRef?.parentElement.offsetHeight
      )
    this.graphRef.scaleContentToFit({ padding: 100, maxScale: 1.5 })
    this.graphRef.centerContent()
  }
  toolBarTap = (type: IToolBarType) => {
    switch (type) {
      case IToolBarType.ZOOM_IN:
        this.graphRef.zoom(0.1)
        break
      case IToolBarType.ZOOM_OUT:
        this.graphRef.zoom(-0.1)
        break
      case IToolBarType.ADAPTIVE:
        this.adaptive()
        break
      case IToolBarType.FULLSCREEN:
        this.fullScreen()
        break
      case IToolBarType.FORMAT_PAINTER:
        this.formatLayout()
        break

      default:
        break
    }
    //
  }
}
