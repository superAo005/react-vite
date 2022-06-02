/* 流编辑器
 * @Author: superao
 * @Date: 2022-03-11 14:35:50
 * @Last Modified by: superao
 * @Last Modified time: 2022-04-07 14:59:46
 */
import { Graph } from "@antv/x6";
import { ReactNode } from "react";
import {
  FLOW_TYPE,
  graphConfig,
  highlightingConfig,
  INodesRule,
} from "./config/flows";
import EdgeManager from "./edge";
import EventManager from "./event";
// import Layout from './layout'
import Layout from "./layoutNew";
import NodeManager from "./node";
import Verify from "./verify";
import DataManager, {
  GraphData,
  IBusiData,
  INode,
  INodeData,
} from "./dataManager";
import onEdgeLabelRendered from "./Component/EdgeLevelInput";
import { NODE_TYPE } from "./config/nodes";
import toolBar from "./Component/ToolBar";
import { connectingConfig } from "./config/edge";
import "./index.scss";

export type ICommonCallBack = (nodeId: string, data: INodeData) => void;
export type IRenderNodeContent = (nodeId: string, data: INodeData) => ReactNode;
export interface IOptions {
  /** 画布容器id命名 */
  containerId: string;
  /**
   * 开始节点 id
   * 不传默认 start
   * */
  rootNodeId?: string;
  /** 初始化数据 */
  graphData?: GraphData;
  /**
   * 初始化画布数据时，是否格式化布局
   * 默认true
   * */
  isFormatLayout?: boolean;
  type: FLOW_TYPE;
  /**
   * 节点校验规则
   * 在 新增 节点、连线时使用
   * 与组件内的规则做 深merge
   * */
  nodesRule?: INodesRule;
  onNodeClick?: ICommonCallBack;
  onNodeDbClick?: ICommonCallBack;
  onNodeEdit: ICommonCallBack;
  renderNodeContent: IRenderNodeContent;
}
interface IUpdateOption {
  /** 布局是否要格式化 */
  isFormatLayout?: boolean;
}
export default class FlowChart {
  private _graphRef: Graph;
  private eventManager: EventManager;
  options: IOptions;
  nodeManager: NodeManager;
  dataManager: DataManager;
  verifyManager: Verify;
  containerId: string;
  edgeManager: EdgeManager;
  graphContainerRef: HTMLElement;
  rootNodeId: string;
  layout: Layout;
  constructor(options: IOptions) {
    this.options = options;
    this.containerId = options.containerId || "";
    this.rootNodeId = options.rootNodeId || "start";
    this.graphContainerRef = document.getElementById(this.containerId);
    this.init();
  }
  private initManager() {
    this.nodeManager = this.nodeManager
      ? this.nodeManager
      : new NodeManager({
          flowRef: this,
        });
    this.edgeManager = this.edgeManager
      ? this.edgeManager
      : new EdgeManager({
          flowRef: this,
        });
    this.eventManager = this.eventManager
      ? this.eventManager
      : new EventManager({
          flowRef: this,
          type: this.options?.type,
        });
    this.layout = this.layout
      ? this.layout
      : new Layout({
          flowRef: this,
        });
    this.verifyManager = this.verifyManager
      ? this.verifyManager
      : new Verify({
          flowRef: this,
        });
    this.dataManager = this.dataManager
      ? this.dataManager
      : new DataManager({
          flowRef: this,
        });
  }
  /**
   * 校验初始化参数是否合法
   * 比如 type必须是已有类型等等
   * @returns
   */
  private initVerify() {
    const { containerId, type, onNodeEdit } = this.options;
    const isPass = type && containerId && typeof onNodeEdit === "function";
    switch (true) {
      case !FLOW_TYPE[type]:
        throw new Error("类型错误，请输入正确[type]值");
      case !this.graphContainerRef:
        throw new Error("无法找到容器元素，请确认[containerId]值");
      case typeof onNodeEdit !== "function":
        throw new Error("[onNodeEdit]不合法，请确认");
      default:
        break;
    }
    return isPass;
  }
  private initToolBar() {
    const toolContainer = document.createElement("div");
    toolBar(toolContainer, this);
    this.graphContainerRef.appendChild(toolContainer);
  }
  private initGraph() {
    this._graphRef = new Graph({
      ...graphConfig,
      container: this.graphContainerRef,
      autoResize: this.graphContainerRef.parentElement,
      onEdgeLabelRendered: (args) => {
        onEdgeLabelRendered(args, this);
      },
      // 连线规则
      connecting: {
        ...connectingConfig,
        validateConnection: (data) => {
          return this.verifyManager.validateConnection(data);
        },
      },
      highlighting: {
        ...highlightingConfig,
      },
    });
  }
  /**
   * 初始化 画布数据
   * 有数据则 按传入数据更新
   * 否则 默认增加一个开始节点
   */
  private initGraphData() {
    const { graphData, isFormatLayout = true } = this.options;
    if (graphData?.edges?.length || graphData?.nodes?.length) {
      this.updateGraphData(graphData, { isFormatLayout });
    } else {
      this.nodeManager.addNode(NODE_TYPE.START);
    }
  }
  private init() {
    if (!this.initVerify()) return;
    this.initGraph();
    this.initManager();
    this.initToolBar();
    this.initGraphData();
    // !debug
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window._graphRef = this._graphRef;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.flowRef = this;
  }
  getGraphRef = (): Graph => {
    return this._graphRef;
  };
  getGraphData = (): GraphData => {
    return this.dataManager.getGraphData();
  };
  /** 更新画布数据 */
  updateGraphData = (graphData: GraphData, options?: IUpdateOption) => {
    const { isFormatLayout = true } = options || {};
    this._graphRef.fromJSON(graphData);
    isFormatLayout && this.layout.formatLayout();
    // 填充数据后 将画布做个自适应居中
    // formatLayout 里做过居中了 所以这里加个判断
    !isFormatLayout && this.layout.adaptive();
  };
  /** 指定节点id 更新节点上的业务数据 */
  updateNodeData = (nodeId: string, busiData: IBusiData) => {
    this.nodeManager.updateNodeData(nodeId, busiData);
  };
  /** 获取某节点的数据 */
  getNodeData = (nodeId: string): INodeData => {
    const { data } =
      (this.dataManager.getCellById(nodeId) as unknown as INode) || {};
    return data;
  };
  /** 指定节点id 更新节点显示的内容 */
  updateNodeContent = (nodeId: string, content: JSX.Element) => {
    this.nodeManager.updateNodeContent(nodeId, content);
  };
  /**
   * 基于 nodesRule
   * 校验整个画布内容合法性
   * 比如在保存画布数据前校验
   * */
  verifyGraph = () => {
    return this.verifyManager.verifyGraph();
  };
  getGraphType() {
    return this.options.type;
  }
  onNodeClick = (nodeId: string, data: INodeData) => {
    this.options.onNodeClick && this.options.onNodeClick(nodeId, data);
  };
  onNodeDbClick = (nodeId: string, data: INodeData) => {
    if (this.options.onNodeDbClick) {
      this.options.onNodeDbClick(nodeId, data);
    } else {
      this.options.onNodeEdit(nodeId, data);
    }
  };
  onNodeEdit = (nodeId: string, data: INodeData) => {
    this.options.onNodeEdit(nodeId, data);
  };
  /** 高亮 */
  highlight = (
    cellIds: string[],
    style?: {
      borderColor: string;
    }
  ) => {
    this.layout.highlight(cellIds, style);
  };
  /** 取消高亮 */
  unHighlight = (cellIds: string[]) => {
    const { edges, nodes } = this.getGraphData() || {};
    const defaultCellIds = this.dataManager.transNode2NodeId([
      ...edges,
      ...nodes,
    ]);
    cellIds = cellIds || defaultCellIds;
    if (cellIds) {
      this.layout.unHighlight(cellIds);
    }
  };
}
