import { Graph } from "csr!@antv/x6";
import "csr!@antv/x6-react-shape";
import Node from "./node";
import { addTypeToData, calculatePosition, fillTheId } from "./utility";

type nodeType = Record<
  string,
  {
    width: number;
    height: number;
    type: string;
    props?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/ban-types
    component: Function;
  }
>;

interface IProps {
  /** 画布容器id */
  containerId: string;
  /** 初始化数据 */
  data: any;
  /**
   * 节点组件
   */
  nodes?: nodeType;
  canDrag?: boolean;
  canScroller?: boolean;
  initPositon?: { x: number; y: number };
}

export default class AndOr {
  containerId: string;
  graph: Graph;
  node: Node;
  nodes: nodeType;
  data: any;
  calData: any;
  canDrag = true;
  canScroller = false;
  initPositon: { x: number; y: number };

  constructor(props: IProps) {
    this.containerId = props.containerId;
    this.nodes = props.nodes;
    this.data = props.data;
    this.canDrag = props.canDrag ?? true;
    this.canScroller = props.canScroller ?? false;
    this.initPositon = props.initPositon || { x: 50, y: 50 };
    this.init();
  }

  /**
   * 初始化
   */
  init = () => {
    this.initGraphData(this.data);
    this.graph = this.createGraph();
    this.registerNode();
    this.node = new Node({
      graphRef: this.graph,
      calData: this.calData,
      nodes: this.nodes,
      initPositon: this.initPositon,
    });
  };

  /**
   * 初始化画布数据
   * 计算节点位置
   * @param data
   */
  initGraphData = (data: any): Record<string, any> => {
    let deepCloneData = null;
    try {
      deepCloneData = JSON.parse(JSON.stringify(data));
    } catch {
      throw new Error("system break");
    }
    fillTheId(deepCloneData);
    this.calData = calculatePosition(deepCloneData);
    return this.calData;
  };
  /**
   * 添加组件类型
   * @param data
   * @param type
   * @returns
   */
  static addTypeToData = (data: any, type: Array<any>) => {
    return addTypeToData(data, type);
  };

  /**
   * 注册边
   */
  registerNode = () => {
    // AND 边颜色
    Graph.registerEdge(
      "AND",
      {
        zIndex: -1,
        attrs: {
          line: {
            strokeWidth: 2,
            stroke: "#CDE0FD",
            sourceMarker: null,
            targetMarker: null,
          },
        },
      },
      true
    );

    // OR 边颜色
    Graph.registerEdge(
      "OR",
      {
        zIndex: -1,
        attrs: {
          line: {
            strokeWidth: 2,
            stroke: "#979797",
            sourceMarker: null,
            targetMarker: null,
          },
        },
      },
      true
    );
  };

  /**
   * 创建画布实例
   * @returns
   */
  createGraph = (): Graph => {
    const ele = document.getElementById(this.containerId) as HTMLElement;
    if (!ele) throw new Error("container is not exist");
    const { scrollHeight, scrollWidth } = ele;
    return new Graph({
      container: ele,
      async: true,
      frozen: true,
      panning: {
        enabled: this.canDrag,
      },
      interacting: function () {
        return { nodeMovable: false };
      },
      scroller: {
        enabled: this.canScroller,
        width: scrollWidth,
        height: scrollHeight,
      },
    });
  };

  /**
   * 更新节点数据，触发render
   * @param id
   * @param param
   */
  updateNode = (id: string, param: Record<string, any>) => {
    this.node.updateNode(id, param);
  };

  /**
   * 返回业务数据
   * @returns
   */
  getData = () => {
    return JSON.parse(JSON.stringify(this.calData));
  };
}
