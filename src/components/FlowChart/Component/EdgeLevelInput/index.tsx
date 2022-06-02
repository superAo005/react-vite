import { Edge, Graph, Node } from '@antv/x6'
import React, { ChangeEvent, Component } from 'react'
import { message } from 'antd'
import { IEdgeData, INodeData } from '../../dataManager'
import ReactDOM from 'react-dom'
import { NODE_TYPE } from '../../config/nodes'
import FlowChart from '../..'
import { IVerifyResult } from '../../verify'
import './index.scss'

interface IProps {
  edge: Edge
  targetNode?: Node
  onLevelChange: (level: number) => void
  onGenerateEdgeLevel: () => number
  verifyRouteEdgeLevel: (edgeId: string, level: number) => IVerifyResult[]
}
interface IState {
  value: number
  isError: boolean
}
const canShowDomNodeType = [NODE_TYPE.ROUTE]
export class EdgeLevelInput extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const { level } = this.props.edge?.getData<IEdgeData>() || {}
    this.state = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value: /^\d+$/.test(level) ? Number(level) : this.generateEdgeLevel(),
      isError: false,
    }
  }
  generateEdgeLevel() {
    return this.getIsShowThisComponent() ? this.props.onGenerateEdgeLevel() : undefined
  }
  getIsShowThisComponent() {
    const { targetNode } = this.props
    const { nodeData } = targetNode?.getData<INodeData>() || {}
    return canShowDomNodeType?.includes(nodeData?.type)
  }
  shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: IState) {
    const { level: nextLevel } = nextProps?.edge?.getData<IEdgeData>() || {}
    const { level } = this.props.edge?.getData<IEdgeData>() || {}
    return (
      nextLevel !== level ||
      nextState?.value !== this.state.value ||
      nextState.isError !== this.state.isError
    )
  }
  handleChange = (e: ChangeEvent<{ value: string }>) => {
    const targetValue = e.target.value
    if (/^\d+$/.test(targetValue) || !targetValue) {
      const value = targetValue ? Number(targetValue) : undefined
      this.setState({
        value,
      })
      this.props.onLevelChange(value)
      if (!targetValue) {
        message.error('请输入路由优先级')
      }
    } else {
      message.error('请输入正整数')
    }
  }
  handleBlur = () => {
    const { level } = this.props.edge?.getData<IEdgeData>() || {}
    const result = this.props.verifyRouteEdgeLevel(this.props.edge?.id, level)
    if (result?.length) {
      message.error('优先级已被占用，请换个数字')
    }
    this.setState({
      isError: !!result?.length,
    })
  }
  render() {
    const { value, isError } = this.state
    if (!this.getIsShowThisComponent()) return null
    return (
      <div className="edgeLevel">
        <input
          style={{ width: value > 2 ? value.toString().length * 8 : 8 }}
          value={value || ''}
          className={`level-input input-value ${isError ? 'error' : ''}`}
          type="text"
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </div>
    )
  }
}
export default function onEdgeLabelRendered(
  args: Graph.Hook.OnEdgeLabelRenderedArgs,
  flowRef: FlowChart
) {
  const { selectors, edge } = args
  const graphRef = flowRef.getGraphRef()
  const node = graphRef.getCellById(edge?.target?.cell) as Node
  const content = selectors.foContent as HTMLDivElement
  const handleLevelChange = (level: number) => {
    flowRef.edgeManager.updateEdgeLevel(edge?.id, level)
  }
  const handleGenerateEdgeLevel = () => {
    const level = flowRef.edgeManager.generateEdgeLevel(edge?.id)
    flowRef.edgeManager.updateEdgeLevel(edge?.id, level)
    return level
  }
  if (content) {
    ReactDOM.render(
      <EdgeLevelInput
        edge={edge}
        targetNode={node}
        onLevelChange={handleLevelChange}
        onGenerateEdgeLevel={handleGenerateEdgeLevel}
        verifyRouteEdgeLevel={flowRef.verifyManager.verifyRouteEdgeLevel}
      />,
      content
    )
  }
}
