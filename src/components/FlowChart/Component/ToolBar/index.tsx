import React, { PureComponent } from 'react'
import { Button } from 'antd'
import {
  CompressOutlined,
  FormatPainterOutlined,
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons'
import ReactDOM from 'react-dom'
import FlowChart from '../..'
import './index.scss'

export enum IToolBarType {
  'ZOOM_IN' = 'ZOOM_IN',
  'ZOOM_OUT' = 'ZOOM_OUT',
  'ADAPTIVE' = 'ADAPTIVE',
  'FULLSCREEN' = 'FULLSCREEN',
  'FORMAT_PAINTER' = 'FORMAT_PAINTER',
}

interface IToolItem {
  type: IToolBarType
  icon: JSX.Element
  toolTips?: string
  onTap: (type: IToolBarType) => void
}

interface IProps {
  toolList: IToolItem[]
}
class ToolBar extends PureComponent<IProps> {
  renderToolItem(data: IToolItem) {
    const { icon, toolTips, type, onTap } = data || {}
    return (
      <Button
        type="text"
        key={type}
        className="flowChart_toolBar_toolItem"
        onClick={() => {
          onTap && onTap(type)
        }}>
        <span className="flowChart_toolBar_toolItem-tips">{toolTips}</span>
        <span className="flowChart_toolBar_toolItem-ico">{icon}</span>
      </Button>
    )
  }
  render() {
    const { toolList } = this.props
    return (
      <div className="flowChart_toolBar">{toolList?.map((item) => this.renderToolItem(item))}</div>
    )
  }
}

export default (graphContainerRef: HTMLElement, flowRef: FlowChart) => {
  const handleTap = flowRef?.layout?.toolBarTap
  const toolList: IToolItem[] = [
    {
      type: IToolBarType.ZOOM_IN,
      icon: <ZoomInOutlined />,
      toolTips: '放大',
      onTap: handleTap,
    },
    {
      type: IToolBarType.ZOOM_OUT,
      icon: <ZoomOutOutlined />,
      toolTips: '缩小',
      onTap: handleTap,
    },
    {
      type: IToolBarType.ADAPTIVE,
      icon: <CompressOutlined />,
      toolTips: '自适应',
      onTap: handleTap,
    },
    {
      type: IToolBarType.FULLSCREEN,
      icon: <FullscreenOutlined />,
      toolTips: '切换全屏',
      onTap: handleTap,
    },
    {
      type: IToolBarType.FORMAT_PAINTER,
      icon: <FormatPainterOutlined />,
      toolTips: '格式化',
      onTap: handleTap,
    },
  ]
  ReactDOM.render(<ToolBar toolList={toolList} />, graphContainerRef)
}
