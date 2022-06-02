/* 布局排版管理
 * @Author: superao
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-10 21:13:52
 */
import { Graph } from "@antv/x6";
interface INodeManagerParam {
  graphRef: Graph;
}

export default class NodeManager {
  graphRef: Graph;
  constructor(data: INodeManagerParam) {
    this.graphRef = data?.graphRef;
  }
  // 通过结算 返回目标节点的画布位置
  calculateNodePositon() {
    return {
      x: 0,
      y: 0,
    };
  }
  // 更新画布布局
  formatLayout() {
    console.log("");
  }
  // https://x6.antv.vision/zh/docs/api/view/cellview/#highlight
  highlight(edgeIds: string[]) {
    console.log("");
  }
}
