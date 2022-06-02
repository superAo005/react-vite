/*
 * @Author: Charles.qu
 * @Date: 2022-03-15 16:33:50
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-19 17:06:18
 */

import { Cell, Graph } from "csr!@antv/x6";
import * as CONST from "./config/const";
import {
  calRelativeYPositon,
  getInitObj,
  getItemById,
  getDelNodeIds,
  getAddNodeId,
  calculatePosition,
} from "./utility";
import { nodes, NodeTypes, getCmp } from "./config/nodes";
const POSITONY = Symbol.for("ANDOR#positonY");
const LAST = Symbol.for("ANDOR#last");

interface INodeManagerParam {
  graphRef: Graph;
  calData: any;
  nodes?: any;
  initPositon: { x: number; y: number };
}

export default class NodeManager {
  graph: Graph;
  calData: any;
  cmpData: any;
  nodes: any;
  oldNodes: any;
  initPositon: { x: number; y: number };

  constructor(props: INodeManagerParam) {
    this.graph = props?.graphRef;
    this.calData = props?.calData;
    this.nodes = { ...nodes, ...props.nodes };
    this.oldNodes = [];
    this.initPositon = props.initPositon;
    // 挂载方法
    this.cmpData = {
      delNode: this.deleteNode,
      addNode: this.addNode,
      changeNodeData: this.changeNodeData,
      cleanNode: this.cleanNode,
      getNodeData: this.getNodeData,
    };
    this.render();
  }

  /**
   *
   * @param data 渲染的数据
   * @param position 位置
   * @param preTail 上一层的最后一个节点
   */
  paintNode = (
    data: any,
    position = { x: 50, y: 50 },
    preTail: Cell = null
  ): void => {
    const { logical, conditions, type, id } = data;
    // 最大长度
    const MAXHEIGHT = Math.max(CONST.LOGIC, CONST.ADD, CONST.INPUTHEIGHT);
    // 逻辑符位置
    const logicPosition = {
      x: position.x,
      y: position.y + calRelativeYPositon(CONST.LOGIC, MAXHEIGHT),
    };

    const logic = this.getNode({
      id: getAddNodeId(id, CONST.logicPrefix),
      position: logicPosition,
      param: { type: logical },
      type: NodeTypes.LOGIC,
    });
    // 链接单个unit
    if (preTail) {
      this.graph.addEdge({
        shape: logical,
        source: preTail,
        target: logic,
      });
    }
    // dfs
    for (let index = 0; index < conditions.length; index++) {
      const item = conditions[index];
      const { conditions: subCondition, ...other } = item;
      const y = item[POSITONY];
      const last = item[LAST];
      let point: Array<{ x: number; y: number }> = [];
      if (Number(index) !== 0) {
        point = [
          {
            x: logicPosition.x + CONST.LOGIC / 2,
            y: position.y + y + calRelativeYPositon(0, MAXHEIGHT),
          },
        ];
      }
      let cmp = null;
      if (last) {
        const addPositon = {
          x: logicPosition.x + CONST.LOGIC + CONST.SHORTLINE,
          y: y + position.y + calRelativeYPositon(CONST.ADD, MAXHEIGHT),
        };
        const add = this.getNode({
          id: getAddNodeId(other.id, CONST.addPrefix),
          param: { ...other, ...this.cmpData },
          position: addPositon,
          type: NodeTypes.ADD,
        });

        const cmpPositon = {
          x: addPositon.x + CONST.ADD + CONST.SHORTLINE,
          y: y + position.y + calRelativeYPositon(CONST.INPUTHEIGHT, MAXHEIGHT),
        };
        cmp = this.getNode({
          id: other.id,
          param: { ...other, ...this.cmpData },
          position: cmpPositon,
          type,
        });

        this.graph.addEdge({
          shape: logical,
          source: logic,
          target: add,
          vertices: point,
        });
        this.graph.addEdge({
          shape: logical,
          source: add,
          target: cmp,
        });
      } else {
        const cmpPositon = {
          x: logicPosition.x + CONST.LOGIC + CONST.LONGLINE,
          y: y + position.y + calRelativeYPositon(CONST.INPUTHEIGHT, MAXHEIGHT),
        };
        cmp = this.getNode({
          id: other.id,
          param: { ...other, ...this.cmpData },
          position: cmpPositon,
          type,
        });
        this.graph.addEdge({
          shape: logical,
          source: logic,
          target: cmp,
          vertices: point,
        });
      }
      const form = this.nodes[type];
      const subPosition = {
        x:
          position.x +
          CONST.LOGIC +
          form.width +
          CONST.LONGLINE +
          CONST.SHORTLINE,
        y: position.y + y,
      };
      if (subCondition) {
        this.paintNode(conditions[index], subPosition, cmp);
      }
    }
  };

  /**
   * 根据data渲染画布
   * @param data
   */
  render = (): void => {
    this.graph.freeze();
    const reCalculate = calculatePosition(this.calData);
    this.cleanEdge();
    this.paintNode(reCalculate, this.initPositon);
    this.oldNodes = this.graph.getNodes();
    this.graph.unfreeze();
  };

  /**
   * 获取节点，如果已有节点则更改数据，否则生成节点
   * @param params
   * @returns
   */
  getNode = (params: {
    id: string;
    type: string;
    position: any;
    param?: any;
  }): Cell => {
    const { id, type, position, param } = params;
    const exist = this.oldNodes.filter((v: any) => v.id === id).length;
    let node = null;
    if (exist) {
      // 根据上一次渲染画布数据与新数据位置计算偏移量
      node = this.graph.getCellById(id);
      const { position: oldPosition } = node.getProp();
      const newX = position.x - oldPosition.x;
      const newY = position.y - oldPosition.y;
      node.translate(newX, newY);
    } else {
      node = this.graph.addNode({
        id,
        ...getCmp(type, { ...param }, this.nodes),
        ...position,
      });
    }
    return node;
  };

  /**
   * 添加节点
   * @param id 添加节点ID
   * @param data 添加节点数据
   */
  addNode = (id: string, data = {}): void => {
    // 获取父节点
    const { parentData } = getItemById(id, this.calData, this.graph);
    const { conditions = [] } = parentData || {};
    // 清除兄弟节点的ADD node
    this.cleanNode(
      conditions.map((v: any) => getAddNodeId(v.id, CONST.addPrefix))
    );
    // 初始化节点数据
    const initObj = getInitObj(id, this.calData, this.graph);
    conditions.push({ ...initObj, ...data });
    this.render();
  };

  /**
   * 删除节点
   * @param id 节点ID
   */
  deleteNode = (id: string): void => {
    // 获取节点ID列表
    const ids = getDelNodeIds(id, this.calData, this.graph);
    this.cleanNode(ids);
    this.render();
  };

  /**
   * 更新节点数据，触发render
   * @param id
   * @param param
   */
  updateNode = (id: string, param: Record<string, any> = {}) => {
    const cell = this.graph.getCellById(id);
    if (cell) {
      for (const key in param) {
        cell.setProp(key, param[key]);
      }
    }
  };

  /**
   * 更新数据
   * @param id
   * @param key 键
   * @param value 值
   */
  changeNodeData = (id: string, param: { [n: string]: any }): void => {
    this.updateNode(id, param);
    const { data } = getItemById(id, this.calData, this.graph);
    for (const key of Object.keys(param)) {
      data[key] = param[key];
    }
  };

  /**
   * 获取节点数据
   * @param id
   * @returns
   */
  getNodeData = (id: string) => {
    const { data } = getItemById(id, this.calData, this.graph);
    return data || {};
  };

  /**
   * 清除画布边
   */
  cleanEdge = (): void => {
    const edges = this.graph.getEdges();
    edges.forEach((v: Cell) => this.graph.removeEdge(v.id));
  };

  /**
   * 根据id清除画布节点
   * @param ids
   */
  cleanNode = (ids: Array<string> = null): void => {
    const nodes = ids || this.graph.getNodes().map((v: Cell) => v.id);
    nodes.forEach((v: string) => this.graph.removeNode(v));
  };
}
