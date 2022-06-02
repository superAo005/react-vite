/* 数据管理
 * @Author: ymiaomiao.yang
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: ymiaomiao.yang
 * @Last Modified time: 2022-03-10 21:12:30
 */
import { Graph } from '@antv/x6'
interface INodeManagerParam {
  graphRef: Graph
}

export default class NodeManager {
  graphRef: Graph
  constructor(data: INodeManagerParam) {
    this.graphRef = data?.graphRef
  }
  initGraphData() {
    console.log('initGraphData')
  }
  exportGraphData() {
    console.log('exportGraphData')
  }
  otherDataHandle() {
    console.log('otherDataHandle')
  }
}
