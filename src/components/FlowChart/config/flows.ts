/* 策略流类型字典
 * @Author: ymiaomiao.yang
 * @Date: 2022-03-07 21:18:33
 * @Last Modified by: ymiaomiao.yang
 * @Last Modified time: 2022-04-07 16:45:44
 */
import { Options } from '@antv/x6/lib/graph/options'
import { NODE_TYPE } from './nodes'
export enum FLOW_TYPE {
  /** 选择器 */
  SELECTOR = 'SELECTOR',
  /** 决策流 */
  DECISION_FLOW = 'DECISION_FLOW',
  /** 识别树 */
  RECOGNITION_TREE = 'RECOGNITION_TREE',
  /** 决策指标 */
  DECISION_METRICS = 'DECISION_METRICS',
  /** 决策树 */
  DECISION_TREE = 'DECISION_TREE',
}
// 每个画布都会有个开始节点
// 默认规则 会跟下面的规则做merge
export const DEFAULT_RULE = {
  nodeType: [NODE_TYPE.START],
}

export interface INodeRule {
  type: NODE_TYPE
  // 个数限制 闭区间
  // [0,3] 代表个数得在 [0,3]
  // Infinity 表示无限制
  limit: [number, number]
  // 是否可手动添加 默认true
  // 主要是 路由default节点不可以手动添加
  canAddedManually?: boolean
}
/**
 * 规则配置可以参考wiki 👇🏻
 * http://conf.ctripcorp.com/pages/viewpage.action?pageId=961373907
 * */
export type INodesRule = {
  [nodeType: string]: {
    /** 在一条路径上 最多有多少个 */
    maxLimitForPath?: number
    /** 入度 最多有多少个 默认无穷大 */
    connectInMax?: number
    /** 出度 最多有多少个 默认无穷大 */
    connectOutMax?: number
    /** 父节点可以有哪里类型 及其个数限制 */
    parentNode: INodeRule[]
    /** 子节点可以有哪里类型 及其个数限制 */
    childNode: INodeRule[]
    /**
     * 兄弟节点可以有哪里类型 及其个数限制
     * A类型的兄弟节点 可以是 B类型 个数限制是 [2,6]； 则 A的兄弟节点中有【2<= x <=6】个B类型节点
     * A类型的兄弟节点 还可以是 A类型 个数限制是 [2,6]； 则 A的兄弟节点中有【2<= x <=6】个A类型节点，但所有这些兄弟里 总有 【3<= x <=7】个A类型节点
     * */
    siblingNode: INodeRule[]
  }
}
interface IFLOW_RULE {
  nodeType: NODE_TYPE[]
  leafNode: string[]
  nodesRule: INodesRule
}
export interface IFLOW_CONFIG_ITEM {
  name: string
  type: FLOW_TYPE
  rule: IFLOW_RULE
}
type IFLOW_CONFIG = {
  [key in FLOW_TYPE]: IFLOW_CONFIG_ITEM
}
/**画布配置 */
export const graphConfig: Partial<Options.Manual> = {
  // 开启画布可拖拽
  panning: true,
  // 对齐线
  snapline: true,
  // 开启鼠标滚轮缩放
  // mousewheel: true,
  autoResize: true,
  scaling: {
    min: 0.5,
    max: 5,
  },
  background: {
    color: '#fff',
  },
  // 后面可以按需要抛配置项
  grid: {
    size: 10, // 网格大小 10px
    visible: true, // 渲染网格背景
  },
  preventDefaultBlankAction: false,
}
/**高亮规则配置 */
export const highlightingConfig = {
  // 链接桩 可被链接时 的高亮规则
  magnetAvailable: {
    name: 'stroke',
    args: {
      attrs: {
        fill: '#fff',
        stroke: '#47C769',
      },
    },
  },
  // 链接桩 被链接时 的高亮规则
  magnetAdsorbed: {
    name: 'stroke',
    args: {
      attrs: {
        fill: '#fff',
        stroke: '#06f545',
      },
    },
  },
}

export const FLOW_CONFIG: IFLOW_CONFIG = {
  [FLOW_TYPE.SELECTOR]: {
    name: '选择器',
    type: FLOW_TYPE.SELECTOR,
    rule: {
      nodeType: [NODE_TYPE.ROUTE, NODE_TYPE.ROUTE_DEFAULT, NODE_TYPE.DECISION_FLOW],
      // 每条路径的叶子节点
      leafNode: [NODE_TYPE.DECISION_FLOW],
      nodesRule: {
        [NODE_TYPE.START]: {
          connectInMax: 0,
          connectOutMax: Infinity,
          parentNode: [],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              // 个数限制 闭区间
              // [0,3] 代表个数得在 [0,3]
              // 如果子节点是路由 的话，可以>=0个
              // 其必须有个default的兄弟节点  ==> 默认为全局规则 在新增路由节点时 会默认增加一个default节点【如果没有的话】
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              // 如果子节点是 default 的话，有且只能有一个
              limit: [0, 1],
              canAddedManually: false,
            },
            {
              type: NODE_TYPE.DECISION_FLOW,
              // 如果子节点是 决策流的话，有且只能有一个
              limit: [0, 1],
            },
          ],
          siblingNode: [],
        },
        [NODE_TYPE.ROUTE]: {
          connectInMax: 1,
          connectOutMax: Infinity,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false,
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false,
            },
            {
              type: NODE_TYPE.DECISION_FLOW,
              limit: [0, 1],
            },
          ],
          siblingNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [1, 1],
            },
          ],
        },
        [NODE_TYPE.ROUTE_DEFAULT]: {
          connectInMax: 1,
          connectOutMax: Infinity,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
            {
              type: NODE_TYPE.DECISION_FLOW,
              limit: [0, 1],
            },
          ],
          siblingNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
          ],
        },
        [NODE_TYPE.DECISION_FLOW]: {
          connectInMax: Infinity,
          connectOutMax: 0,
          parentNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
          ],
          childNode: [],
          siblingNode: [],
        },
      },
    },
  },
  [FLOW_TYPE.DECISION_FLOW]: {
    name: '决策流',
    type: FLOW_TYPE.DECISION_FLOW,
    rule: {
      nodeType: [NODE_TYPE.DECISION_TREE, NODE_TYPE.RECOGNITION_SET],
      // 每条路径的叶子节点
      leafNode: [NODE_TYPE.DECISION_TREE],
      nodesRule: {
        [NODE_TYPE.START]: {
          connectInMax: 0,
          connectOutMax: Infinity,
          parentNode: [],
          childNode: [
            {
              type: NODE_TYPE.RECOGNITION_SET,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.DECISION_TREE,
              limit: [0, 1],
            }
          ],
          siblingNode: [],
        },
        [NODE_TYPE.RECOGNITION_SET]: {
          maxLimitForPath: Infinity,
          connectInMax: 1,
          connectOutMax: 1,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.RECOGNITION_SET,
              limit: [0, 1],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.RECOGNITION_SET,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.DECISION_TREE,
              limit: [0, 1],
            },
          ],
          siblingNode: [],
        },
        [NODE_TYPE.DECISION_TREE]: {
          connectInMax: 1,
          connectOutMax: 0,
          parentNode: [
            {
              type: NODE_TYPE.RECOGNITION_SET,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
          ],
          childNode: [],
          siblingNode: [],
        },
      },
    },
  },
  [FLOW_TYPE.RECOGNITION_TREE]: {
    name: '识别树',
    type: FLOW_TYPE.RECOGNITION_TREE,
    rule: {
      nodeType: [
        NODE_TYPE.ROUTE,
        NODE_TYPE.ROUTE_DEFAULT,
        NODE_TYPE.RULE_SET,
        NODE_TYPE.DECISION_METRICS,
      ],
      leafNode: [NODE_TYPE.RULE_SET, NODE_TYPE.DECISION_METRICS],
      nodesRule: {
        [NODE_TYPE.START]: {
          connectInMax: 1,
          connectOutMax: Infinity,
          parentNode: [],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.DECISION_METRICS,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.RULE_SET,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
          ],
          siblingNode: [],
        },
        [NODE_TYPE.ROUTE]: {
          maxLimitForPath: Infinity,
          connectInMax: 1,
          connectOutMax: Infinity,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.DECISION_METRICS,
              limit: [0, 1],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
            {
              type: NODE_TYPE.DECISION_METRICS,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.RULE_SET,
              limit: [0, 1],
            },
          ],
          siblingNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [1, 1],
            },
          ],
        },
        [NODE_TYPE.ROUTE_DEFAULT]: {
          connectInMax: 1,
          connectOutMax: Infinity,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.DECISION_METRICS,
              limit: [0, 1],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.RULE_SET,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.DECISION_METRICS,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
          ],
          siblingNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
          ],
        },
        [NODE_TYPE.RULE_SET]: {
          maxLimitForPath: Infinity,
          connectInMax: 1,
          connectOutMax: 0,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.DECISION_METRICS,
              limit: [0, 1],
            },
          ],
          childNode: [],
          siblingNode: [],
        },
        [NODE_TYPE.DECISION_METRICS]: {
          connectInMax: Infinity,
          connectOutMax: 2,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.DECISION_METRICS,
              limit: [0, Infinity],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
            {
              type: NODE_TYPE.DECISION_METRICS,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.RULE_SET,
              limit: [0, 1],
            },
          ],
          siblingNode: [],
        },
      },
    },
  },
  [FLOW_TYPE.DECISION_METRICS]: {
    name: '决策指标',
    type: FLOW_TYPE.DECISION_METRICS,
    rule: {
      nodeType: [NODE_TYPE.ROUTE, NODE_TYPE.ROUTE_DEFAULT, NODE_TYPE.ASSIGN],
      // 每条路径的叶子节点
      leafNode: [NODE_TYPE.ASSIGN],
      nodesRule: {
        [NODE_TYPE.START]: {
          connectInMax: 0,
          connectOutMax: Infinity,
          parentNode: [],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
            {
              type: NODE_TYPE.ASSIGN,
              limit: [0, 1],
            },
          ],
          siblingNode: [],
        },
        [NODE_TYPE.ROUTE]: {
          connectInMax: 1,
          connectOutMax: Infinity,
          maxLimitForPath: Infinity,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
            {
              type: NODE_TYPE.ASSIGN,
              limit: [0, 1],
            },
          ],
          siblingNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [1, 1],
            },
          ],
        },
        [NODE_TYPE.ROUTE_DEFAULT]: {
          connectInMax: 1,
          connectOutMax: Infinity,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
            {
              type: NODE_TYPE.ASSIGN,
              limit: [0, 1],
            },
          ],
          siblingNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
          ],
        },
        [NODE_TYPE.ASSIGN]: {
          connectInMax: Infinity,
          connectOutMax: 0,
          maxLimitForPath: 1,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, Infinity],
            },
          ],
          childNode: [],
          siblingNode: [],
        },
      },
    },
  },
  [FLOW_TYPE.DECISION_TREE]: {
    name: '决策树',
    type: FLOW_TYPE.DECISION_TREE,
    rule: {
      nodeType: [NODE_TYPE.ROUTE, NODE_TYPE.ROUTE_DEFAULT, NODE_TYPE.DECISION],
      leafNode: [NODE_TYPE.DECISION],
      nodesRule: {
        [NODE_TYPE.START]: {
          connectInMax: 0,
          connectOutMax: Infinity,
          parentNode: [],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.DECISION,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
          ],
          siblingNode: [],
        },
        [NODE_TYPE.ROUTE]: {
          maxLimitForPath: Infinity,
          connectInMax: 1,
          connectOutMax: Infinity,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
            {
              type: NODE_TYPE.DECISION,
              limit: [0, 1],
            },
          ],
          siblingNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [1, 1],
            },
          ],
        },
        [NODE_TYPE.ROUTE_DEFAULT]: {
          connectInMax: 1,
          connectOutMax: Infinity,
          parentNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
          ],
          childNode: [
            {
              type: NODE_TYPE.DECISION,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, 1],
              canAddedManually: false
            },
          ],
          siblingNode: [
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
          ],
        },
        [NODE_TYPE.DECISION]: {
          connectInMax: Infinity,
          connectOutMax: 0,
          parentNode: [
            {
              type: NODE_TYPE.START,
              limit: [0, 1],
            },
            {
              type: NODE_TYPE.ROUTE,
              limit: [0, Infinity],
            },
            {
              type: NODE_TYPE.ROUTE_DEFAULT,
              limit: [0, Infinity],
            },
          ],
          childNode: [],
          siblingNode: [],
        },
      },
    },
  },
}
