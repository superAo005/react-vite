import { Node } from '@antv/x6'
import React, { Component } from 'react'
import { NODE_TYPE, NODE_TYPE_CONFIG } from '../../config/nodes'
import { ICustomerNodeData, INodeData } from '../../dataManager'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/dropdown/style/index.css'
import './index.scss'
import { IRenderNodeContent } from '../..'

interface IProps {
  node: Node
  addNodeTool: (node: Node) => void
  renderNodeContent: IRenderNodeContent
}

export const RECTANGLE_NODE = {
  name: 'RECTANGLE_NODE',
  defaultWidth: 178,
  defaultHeight: 36,
}

export default class extends Component<IProps> {
  containerRef: HTMLDivElement
  nodeData: INodeData
  getBorderStyle() {
    const { node } = this.props
    const { isHighLight, highLightColor } = node?.getData<INodeData>()?.nodeData || {}
    if (isHighLight)
      return {
        borderColor: highLightColor,
      }
  }
  shouldComponentUpdate(nextProps: Readonly<IProps>) {
    const isNodeDataChange = () => {
      const nextNodeData = nextProps?.node?.getData<INodeData>()?.nodeData
      const nextBusiData = nextProps?.node?.getData<INodeData>()?.busiData
      const needCompareKey = ['type', 'name', 'isHighLight', 'highLightColor']
      const nodeDataNotChange = needCompareKey
        .map((key: keyof ICustomerNodeData) => {
          return this.nodeData.nodeData[key] === nextNodeData[key]
        })
        ?.every((item) => item)
      const keys = [...Object.keys(nextBusiData), ...Object.keys(this.nodeData.busiData)]
      const busiDataNotChange = keys
        .map((key: keyof ICustomerNodeData) => {
          return this.nodeData.busiData[key] === nextBusiData[key]
        })
        ?.every((item) => item)
      return !nodeDataNotChange || !busiDataNotChange
    }
    return isNodeDataChange()
  }
  componentDidUpdate(): void {
    this.reSizeNode()
  }
  reSizeNode() {
    const { node } = this.props
    node.setSize({ width: this.containerRef?.offsetWidth, height: this.containerRef?.offsetHeight })
  }
  componentDidMount(): void {
    this.reSizeNode()
    this.addTool()
  }
  addTool() {
    const { node } = this.props
    this.props.addNodeTool && this.props.addNodeTool(node)
  }
  // renderContent = (RenderContent: JSX.Element) => {
  //   if (!RenderContent) return null
  //   if (typeof RenderContent === 'string' || React.isValidElement(RenderContent))
  //     return RenderContent
  //   if (typeof RenderContent !== 'object') return null
  //   const { type, props } = RenderContent || {}
  //   const { children, ...otherProps } = props || {}
  //   const renderChildren = () => {
  //     if (!children) return null
  //     switch (typeof children) {
  //       case 'string':
  //         return children
  //       case 'object':
  //         if (Array.isArray(children))
  //           return children?.map((childrenItem: JSX.Element) => this.renderContent(childrenItem))
  //         return this.renderContent(children)
  //       default:
  //         return null
  //     }
  //   }
  //   return React.createElement(type, otherProps, renderChildren())
  // }
  // renderCumstomerNode() {
  //   const { node, renderNodeContent } = this.props
  //   console.log('CumstomerNode', renderNodeContent)
  //   const data = node?.getData<INodeData>()
  //   const simpleType = typeof CumstomerNode === 'string' || typeof CumstomerNode === 'number'
  //   if (React.isValidElement(CumstomerNode) || simpleType) return CumstomerNode
  //   return CumstomerNode ? <CumstomerNode nodeId={node?.id} data={data} /> : name
  // }
  render() {
    const { node, renderNodeContent } = this.props
    const data = node?.getData<INodeData>()
    const { nodeData } = data || {}
    const { type, isHighLight } = nodeData || {}
    const nodeConfig = NODE_TYPE_CONFIG[type]
    const { style, name } = nodeConfig || {}
    // ?为什么存下来
    // 直接从props拿的话， 每次拿到的都是最新的
    // 这会导致 shouldComponentUpdate 里无法判断是否要更新组件
    this.nodeData = data
    return (
      <div className="cfCustomerReactNode" ref={(e) => (this.containerRef = e)} title={name}>
        <div className="cfCustomerReactNode_innerContainer">
          {isHighLight && (
            <div
              className="cfCustomerReactNode_innerContainer_hightBorder"
              style={{ ...this.getBorderStyle() }}
            />
          )}
          <div
            className="cfCustomerReactNode_leftBorder"
            style={{ backgroundColor: style?.themeColor }}
          />
          {/* debug */}
          <div className="cfCustomerReactNode_content">
            {/* {this.renderContent(renderContent) || name} */}
            {type === NODE_TYPE.START ? name : renderNodeContent(node?.id, data)}
          </div>
          {/* <div className="cfCustomerReactNode_content">{node?.id || name}</div> */}
        </div>
      </div>
    )
  }
}
