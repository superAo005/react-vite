/* 边管理
 * @Author: superao
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-31 17:38:01
 */
import { Graph, Edge, Shape, Markup } from '@antv/x6'
import { Modal } from 'antd'
import FlowChart from '.'
import { NODE_TYPE } from './config/nodes'
import { IEdge } from './dataManager'
interface ManagerParam {
  flowRef: FlowChart
}

export default class EdgeManager {
  private graphRef: Graph
  private flowRef: FlowChart
  private labelConfig = {
    defaultLabel: {
      markup: Markup.getForeignObjectMarkup(),
      attrs: {
        fo: {
          x: 0,
          y: -15,
        },
      },
    },
    label: {
      attrs: {
        fo: {
          x: 0,
          y: -15,
          width: 120,
          // 元素面积太大的话 触发edge hover事件面积也会变大
          height: 1,
          overflow: 'visible',
        },
      },
      position: {
        distance: -20,
        offset: {
          x: -60,
        },
      },
    },
  }
  constructor(data: ManagerParam) {
    this.flowRef = data?.flowRef
    this.graphRef = data?.flowRef?.getGraphRef()
    this.init()
  }

  private init() {
    // 修改边框的默认颜色
    Shape.Edge.config({
      attrs: {
        line: {
          stroke: '#E9E9E9',
        },
      },
      ...this.labelConfig,
      data: {
        // 值越大 优先级越低
        level: undefined,
        lineStroke: '#E9E9E9',
      },
    })
  }
  addEdge = (metadata: Edge.Metadata) => {
    this.graphRef.addEdge({
      ...metadata,
    })
  }
  deleteEdge(edgeId: string) {
    this.flowRef.highlight([edgeId])
    Modal.confirm({
      maskClosable: true,
      centered: true,
      content: '确认删除这条边吗',
      onOk: () => {
        this.flowRef.unHighlight([edgeId])
        this.graphRef.removeEdge(edgeId)
      },
      onCancel: () => {
        this.flowRef.unHighlight([edgeId])
      },
    })
  }
  addEdgeDeleteBtn = (edge: Edge) => {
    const buttonWidth = 60
    const buttonHeight = 32
    edge.addTools({
      name: 'button',
      args: {
        // 没有什么逻辑，就是试出来的效果
        distance: -70,
        offset: {
          x: 0,
          y: 0,
        },
        markup: [
          {
            tagName: 'rect',
            className: 'edge-button',
            attrs: {
              width: buttonWidth,
              height: buttonHeight,
              rx: 4,
              ry: 4,
              // 没有什么逻辑，就是试出来的效果
              // 这个位置合适
              x: -(buttonWidth / 2),
              y: -(buttonHeight / 2),
              stroke: 'rgba(0,0,0,0.08)',
              'stroke-width': 1,
              fill: 'white',
              cursor: 'pointer',
              blur: 0.5,
            },
          },
          {
            tagName: 'text',
            textContent: '删除边',
            className: 'edge-button-text',
            attrs: {
              // 给文字做居中
              x: -20,
              y: 0,
              fill: '#666',
              'font-size': 12,
              'text-anchor': 'start',
              'pointer-events': 'none',
              'dominant-baseline': 'middle',
            },
          },
        ],
        onClick: ({ cell }) => {
          this.flowRef.edgeManager.deleteEdge(cell?.id)
        },
      },
    })
  }
  deleteEdgeDeleteBtn = (edge: Edge) => {
    edge.removeTool('button')
  }
  /**
   * 修改边的优先级
   * 数字越小，优先级越高
   */
  updateEdgeLevel(edgeId: string, level?: number) {
    level = level ? level : this.generateEdgeLevel(edgeId)
    const edge = this.graphRef.getCellById(edgeId)
    edge.setData({
      level,
    })
  }
  generateEdgeLevel = (edgeId: string) => {
    const edge = this.flowRef.dataManager.getCellById(edgeId) as unknown as IEdge
    const sourceNodeId = edge?.source?.cell
    const targetNodeId = edge?.target?.cell
    const sortChildNode = this.flowRef.dataManager
      .sortChildNodeByRouteLevel(sourceNodeId)
      ?.filter((item) => item.id !== targetNodeId)
    const highestLevelNode = sortChildNode
      .reverse()
      .find((item) => item.data?.nodeData?.type === NODE_TYPE.ROUTE)
    const highestLevelEdge = this.flowRef.getGraphData()?.edges?.find((item) => {
      return item.source?.cell === sourceNodeId && item.target.cell === highestLevelNode?.id
    })
    const highestLevel = highestLevelEdge?.data?.level
    return highestLevel && /^\d+$/.test(highestLevel.toString()) ? highestLevel + 1 : 1
  }
  addLabel = (edgeId: string) => {
    const edge = this.graphRef.getCellById(edgeId) as Edge
    // 随便改点什么再复原下
    // 为了触发 onEdgeLabelRendered
    edge && edge?.setLabels('label')
    edge &&
      edge?.setLabels({
        ...this.labelConfig.label,
      })
  }
  /** 校验排序时 输入内容是否合法 */
  handleEdgeInput() {
    console.log('handleAddEdge')
  }
}
