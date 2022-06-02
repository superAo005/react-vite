/* 布局排版管理
 * @Author: superao
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: superao
 * @Last Modified time: 2022-04-08 20:32:42
 */
import { Graph, Node } from '@antv/x6'
import FlowChart from '.'
import { isFull, listenScreenChangeEvent, toggleFull } from './Component/FullScreen'
import { RECTANGLE_NODE } from './Component/RectangleNode'
import { IToolBarType } from './Component/ToolBar'
import { GraphData, IEdge, IEdgeData, INode, INodeData } from './dataManager'
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
  // 排版 节点间距
  layoutMargin = {
    x: 60,
    // 太小的话 连接线会拐弯
    y: 70,
  }
  constructor(data: INodeManagerParam) {
    this.flowRef = data?.flowRef
    this.graphRef = data?.flowRef?.getGraphRef()
    this.init()
  }
  init = () => {
    listenScreenChangeEvent(() => {
      setTimeout(() => {
        this.adaptive()
      }, 100)
    })
  }
  /**
   * 主要是 管理父子关系
   * 去掉某些边，让节点只可以查到一个父节点【方便计算节点的坐标】
   * 哪些边会被去掉：
   * 指向了同一个节点的边们，按graph.tojson返回的边的顺序【边被添加的顺序】
   * 保留第一个，剩余的剔除
   * @param edges
   * @returns
   */
  initEdge(edges: IEdge[]) {
    const targetMap: Record<string, IEdge[]> = {}
    edges?.forEach((item) => {
      const targetMapVal = targetMap[item.target.cell] || []
      targetMap[item.target.cell] = targetMapVal.concat(item)
    })
    /** 有多个父节点的节点id */
    const moreEdgeTargeNode = Object.keys(targetMap)?.filter((item) => targetMap[item].length > 1)
    let needPickOutEdge: IEdge[] = []
    moreEdgeTargeNode.forEach((item) => {
      const [first, ...other] = targetMap[item]
      needPickOutEdge = [...needPickOutEdge, ...other]
    })
    const needPickOutEdgeId = this.flowRef.dataManager.transNode2NodeId(needPickOutEdge)
    return edges?.filter((item) => {
      return !needPickOutEdgeId.includes(item.id)
    })
  }
  /**
   * 更新画布上节点坐标
   * @param nodeId
   */
  updateGraphNodePosition(nodes: INode[]) {
    nodes.forEach((nodeItem) => {
      const node = this.graphRef.getCellById(nodeItem?.id)
      const { x, y } = nodeItem.position
      if (typeof x === 'number' && !Number.isNaN(x) && typeof y === 'number' && !Number.isNaN(y))
        node.setProp('position', {
          ...nodeItem.position,
        })
    })
  }
  /**
   * 获取开始根节点的坐标
   * @returns
   */
  getRootNodePosition() {
    const rootNode = this.graphRef.getCellById(this.flowRef.rootNodeId) as Node
    const { x, y } = rootNode?.getPosition() || {}
    return {
      x,
      y,
    }
  }
  // !================ START 以下是布局计算相关 START ================
  /**
   * 计算新增节点的坐标
   * @param parentNodeId
   * @returns
   */
  calculateNodePositon = (parentNodeId?: string) => {
    // 没有父节点，按根节点对待
    const rootNodeNewX =
      (this.flowRef.graphContainerRef?.offsetWidth - RECTANGLE_NODE.defaultWidth) / 2
    if (!parentNodeId)
      return {
        x: Number(rootNodeNewX.toFixed(1)),
        y: 30,
      }
    const sortedChildNodes = this.flowRef.dataManager.sortSuccessorsByPositionX(
      parentNodeId,
      this.flowRef.getGraphData()
    )
    const rightmostNode = sortedChildNodes[sortedChildNodes?.length - 1]
    const node = this.flowRef.dataManager.getCellById(parentNodeId) as INode
    const { x, y } = node?.position || {}
    const { x: rightmostX } = rightmostNode?.position || {}
    const newX = rightmostX
      ? rightmostX +
        this.layoutMargin.x +
        this.flowRef.nodeManager.getNodeBBoxSize(rightmostNode?.id)?.width
      : x
    const newY =
      y + this.layoutMargin.y + this.flowRef.nodeManager.getNodeBBoxSize(node?.id)?.height
    return {
      x: Number(newX.toFixed(1)),
      y: Number(newY.toFixed(1)),
    }
  }
  /**
   * 从叶子节点开始
   * 自下而上
   * 将有多个子节点的父节点与子节点垂直居中对齐
   * @param needFormatLeafNodeIds 需要处理的节点集合，不传默认所有的父节点都要计算
   * @memberof Layout
   */
  getFormatParentPositionXToCenterData = (graphData: GraphData, needFormatLeafNodeIds?: string[]) => {
    const updateNodePositionX = (nodeId: string) => {
      // console.log('--center--updateNodePositionX', nodeId)
      const childNodes = this.flowRef.dataManager.sortChildNodesByPositionX(nodeId, graphData)
      const node = this.flowRef.dataManager.getCellById(nodeId, graphData?.nodes) as INode
      const [leftMostNode] = childNodes
      const leftMostNodeViewWidth = leftMostNode
        ? this.flowRef.nodeManager.getNodeBBoxSize(leftMostNode?.id).width
        : 0
      const leftCenter = leftMostNode?.position?.x + leftMostNodeViewWidth / 2
      if (childNodes?.length > 1) {
        const rightMostNode = childNodes[childNodes?.length - 1]
        const rightMostNodeViewWidth = rightMostNode
          ? this.flowRef.nodeManager.getNodeBBoxSize(rightMostNode?.id).width
          : 0
        const rightCenter = rightMostNode?.position?.x + rightMostNodeViewWidth / 2
        const x =
          leftCenter +
          (rightCenter - leftCenter) / 2 -
          this.flowRef.nodeManager.getNodeBBoxSize(nodeId).width / 2
        this.flowRef.dataManager.updateNodePositionMeta(node, {
          x,
        })
      } else if (childNodes?.length === 1) {
        const x = leftCenter - this.flowRef.nodeManager.getNodeBBoxSize(nodeId).width / 2
        this.flowRef.dataManager.updateNodePositionMeta(node, {
          x,
        })
      }
    }
    if (needFormatLeafNodeIds?.length) {
      needFormatLeafNodeIds.forEach((item) => {
        updateNodePositionX(item)
        const parentNodes = this.flowRef.dataManager.getParentNode(item)
        if (parentNodes?.length) {
          graphData = this.getFormatParentPositionXToCenterData(
            graphData,
            this.flowRef.dataManager.transNode2NodeId(parentNodes)
          )
        }
      })
    } else {
      graphData = this.getFormatParentPositionXToCenterData(
        graphData,
        this.flowRef.dataManager.transNode2NodeId(this.flowRef.nodeManager.getLeafNodes())
      )
    }
    return graphData
  }
  /**
   * 指定节点id
   * 将节点id所在树的右侧节点 集体右移
   * 右移距离
   * @param nodeId
   * @param graphData 要移动的画布数据
   * @returns GraphData 返回移动后的画布数据
   */
  getFormatAtNodeTreeRightNodesData(nodeId: string, graphData: GraphData, parentNodeId: string) {
    // const predecessorsNodes = this.flowRef.dataManager
    //   .getPredecessors(nodeId)
    //   ?.map((item) => this.flowRef.dataManager.getCellById(item.id, graphData?.nodes) as INode)

    const sortedChildNodes = this.flowRef.dataManager.sortChildNodesByPositionX(
      parentNodeId,
      graphData
    )
    const getAtNodeTreeRightNodes = () => {
      // 没有子节点 则直接返回
      // 不需要新空间 无需重排
      if (sortedChildNodes?.length <= 1) return []
      const rightMostChildNode = sortedChildNodes[sortedChildNodes?.length - 1]
      const rightMostNodeX = rightMostChildNode?.position?.x
      const atRightNodes = graphData?.nodes?.filter((item) => {
        const itemX = item.position?.x
        const isNodeSibling = sortedChildNodes?.find(
          (sortedChildNodesItem) => sortedChildNodesItem?.id === item.id
        )
        // 下面会有前序节点，所以这里要去重
        // const isPredecessor = predecessorsNodes?.find(
        //   (predecessorsNodesItem) => predecessorsNodesItem.id === item.id
        // )
        // const isSuccessor = this.graphRef?.isSuccessor(
        //   this.graphRef.getCellById(nodeId),
        //   this.graphRef.getCellById(item?.id)
        // )
        // return itemX >= rightMostNodeX && !isNodeSibling && !isPredecessor
        return itemX >= rightMostNodeX && !isNodeSibling
      })
      return atRightNodes
    }
    const atRightNodes = getAtNodeTreeRightNodes()
    // const nodes = sortedChildNodes?.length <= 1 ? [] : [...predecessorsNodes, ...atRightNodes]
    const nodes = sortedChildNodes?.length <= 1 ? [] : atRightNodes
    const translateX = this.layoutMargin.x + this.flowRef.nodeManager.getNodeBBoxSize(nodeId)?.width
    // 集体右移,给新增节点腾地方
    // console.log('getFormatAtNodeTreeRightNodesData', nodeId)
    nodes?.forEach((item) => {
      this.flowRef.dataManager.updateNodePositionMeta(item, { x: translateX }, { isRelative: true })
    })
    return graphData
  }
  /**
   * 指定节点
   *  1 从节点开始 往下查询；依据路由节点的优先级排序
   *  2 从节点开始 依次遍历子节点 重新计算子节点 x坐标,并将其右边的节点统一右移
   * @param nodeId
   */
  getFormatLayoutXData(nodeId = this.flowRef.rootNodeId, graphData: GraphData) {
    const node = this.flowRef.dataManager.getCellById(nodeId, graphData?.nodes)
    const childNodes = this.flowRef.dataManager.sortChildNodeByRouteLevel(nodeId, graphData)
    // console.log('getFormatLayoutXData-childNodes', nodeId, childNodes)
    childNodes.forEach((childNode, i) => {
      const preSiblingNode = childNodes[i - 1]
      const preSiblingNodePosition = preSiblingNode?.position
      const preSiblingNodeBBoxSize = this.flowRef.nodeManager.getNodeBBoxSize(preSiblingNode?.id)
      const x =
        i > 0
          ? preSiblingNodePosition?.x + preSiblingNodeBBoxSize?.width + this.layoutMargin.x
          : node?.position?.x
      this.flowRef.dataManager.updateNodePositionMeta(childNode, {
        x,
      })
      if (i >= 1) {
        graphData = this.getFormatAtNodeTreeRightNodesData(childNode.id, graphData, nodeId)
      }
    })
    childNodes.forEach((childNode) => {
      graphData = this.getFormatLayoutXData(childNode?.id, graphData)
    })
    return graphData
  }
  /**
   * 指定节点id、画布数据
   * 从指定id开始往下查找后继节点；并给后继节点重置Y轴方向的位置
   * 后继节点的y坐标 参考y值最大[最靠下]的父节点的y值
   * 返回新画布数据
   */
  getFormatPositionYData(nodeId: string = this.flowRef.rootNodeId, graphData: GraphData) {
    if (!nodeId) return graphData
    const childNodes = this.flowRef.dataManager.getChildNode(nodeId, { graphData })
    if (childNodes?.length) {
      childNodes?.forEach((item, i) => {
        const parentNodes = this.flowRef.dataManager.sortParentNodesByPositionY(item?.id, graphData)
        const bottomMostParentNode = parentNodes[parentNodes?.length - 1]
        childNodes[i] = this.flowRef.dataManager.updateNodePositionMeta(item, {
          y:
            bottomMostParentNode?.position.y +
            this.layoutMargin.y +
            // Math.random() * (parentNodes?.length - 1) * this.layoutMargin.y +
            this.flowRef.nodeManager.getNodeBBoxSize(bottomMostParentNode.id).height,
        })
      })
      childNodes.forEach((childNode) => {
        graphData = this.getFormatPositionYData(childNode?.id, graphData)
      })
    }
    return graphData
  }
  /**
   * 以根节点为参照点，
   * 将所有的节点集体移动下
   * @param graphData
   * @param rootTargePosition
   * @returns
   */
  getTranslateNodeToTargetData(graphData: GraphData, rootTargePosition: IPosition) {
    const rootNode = this.flowRef.dataManager.getCellById(this.flowRef.rootNodeId, graphData?.nodes)
    const { x, y } = rootNode?.position || {}
    const { x: targetX, y: targetY } = rootTargePosition || {}
    const diffValueX = targetX - x
    const diffValueY = targetY - y
    graphData.nodes = graphData.nodes.map((item) => {
      this.flowRef.dataManager.updateNodePositionMeta(
        item,
        {
          x: diffValueX,
          y: diffValueY,
        },
        { isRelative: true }
      )
      return item
    })
    return graphData
  }
  /**
   * 把游离节点堆到画布左上角
   */
  formatFreeNode = () => {
    const freeNode = this.flowRef.nodeManager.getFreeNode()
    freeNode?.forEach((item: Node) => {
      const { x, y } = item.position() || {}
      if (x >= 0 && y >= 0 && x < this.layoutMargin.x && y <= this.layoutMargin.y) return
      this.flowRef.nodeManager.updateNodePosition(item?.id, {
        x: this.layoutMargin.x * Math.random(),
        y: this.layoutMargin.y * Math.random(),
      })
    })
  }
  /**
   * 全局格式化
   * 1、Y轴 布局；更新节点y坐标
   * 2、X轴布局：
   *  2.1 从根节点开始 往下查询；依据路由节点的优先级排序
   *  2.2 从根节点开始 依次遍历子节点 重新计算子节点 x坐标
   */
  isFormating = false
  formatLayout() {
    if (this.isFormating) return
    this.isFormating = true
    console.log('isFormating-start')
    let graphData = this.flowRef.getGraphData()
    graphData.edges = this.initEdge(graphData?.edges)
    graphData = this.getFormatPositionYData(this.flowRef.rootNodeId, graphData)
    graphData = this.getFormatLayoutXData(this.flowRef.rootNodeId, graphData)
    graphData = this.getFormatParentPositionXToCenterData(graphData)
    // 计算完x坐标后 节点整体右移了；
    // 所以所有节点以根节点坐标为准 整体左移回来
    const { x, y } = this?.getRootNodePosition() || {}
    graphData = this.getTranslateNodeToTargetData(graphData, { x, y })
    this.updateGraphNodePosition(graphData?.nodes)
    this.formatFreeNode()
    this.isFormating = false
    console.log('isFormating-end', graphData)
  }
  /**
   * 在X轴方向上格式化
   * 指定节点id
   * 从指定id开始往上查找前序节点；并给前序节点重置X轴方向的位置
   */
  formatLayoutWhenAddNode(nodeId: string) {
    if (nodeId === this.flowRef.rootNodeId) return
    let graphData = this.flowRef.getGraphData()
    graphData.edges = this.initEdge(graphData?.edges)
    const { x, y } = this.getRootNodePosition()
    const [parentNode] = this.flowRef.dataManager.getParentNode(nodeId, { graphData }) || []
    graphData = this.getFormatAtNodeTreeRightNodesData(nodeId, graphData, parentNode?.id)
    // const predecessorsNodesId = this.flowRef.dataManager.getPredecessors(nodeId)
    graphData = this.getFormatParentPositionXToCenterData(
      graphData,
      [nodeId]
    )
    // 计算完位置后
    // 所有节点以根节点坐标为准 再对齐下
    graphData = this.getTranslateNodeToTargetData(graphData, { x, y })
    this.updateGraphNodePosition(graphData.nodes)
  }
  // !================ END 以上是布局相关 END ================
  // !================ 以下是操作相关 ================
  // https://x6.antv.vision/zh/docs/api/view/cellview/#highlight
  // 自带的highlight 不太好用
  // 取消 highlight时 需要传 一模一样的参数
  highlight = (
    cellIds: string[],
    style?: {
      borderColor: string
    }
  ) => {
    const { borderColor = '#FEB663' } = style || {}
    if (!cellIds?.length) return
    cellIds.forEach((item) => {
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
  unHighlight = (cellIds: string[]) => {
    cellIds?.forEach((item) => {
      const cell = this.graphRef.getCellById(item)
      const ieEdge = this.graphRef.isEdge(cell)
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
    // setTimeout(() => {
    //   this.adaptive()
    // }, 100)
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
