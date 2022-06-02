/* 节点类型字典
 * @Author: superao
 * @Date: 2022-03-07 21:18:33
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-11 15:21:11
 */

export enum NODE_TYPE {
  // 开始
  START = 'START',
  // 路由
  ROUTE = 'ROUTE',
  ROUTE_DEFAULT = 'ROUTE_DEFAULT',
  /** 决策流 */
  DECISION_FLOW = 'DECISION_FLOW',
  /** 识别集 */
  RECOGNITION_SET = 'RECOGNITION_SET',
  /** 决策树 */
  DECISION_TREE = 'DECISION_TREE',
  /** 规则集 */
  RULE_SET = 'RULE_SET',
  /** 决策指标 */
  DECISION_METRICS = 'DECISION_METRICS',
  /** 赋值 */
  ASSIGN = 'ASSIGN',
  /** 决策 */
  DECISION = 'DECISION',
}

export const NODE_TYPE_CONFIG = {
  [NODE_TYPE.START]: {
    type: NODE_TYPE.START,
    name: '开始',
    style: {
      width: 178,
      height: 36,
      // 边框主题色
      themeColor: 'rgba(0,0,0,0)',
    },
  },
  [NODE_TYPE.ROUTE_DEFAULT]: {
    type: NODE_TYPE.ROUTE_DEFAULT,
    name: 'default',
    style: {
      themeColor: '#bdbdbd',
    },
  },
  [NODE_TYPE.ROUTE]: {
    type: NODE_TYPE.ROUTE,
    name: '路由',
    style: {
      themeColor: '#46d024',
    },
  },
  [NODE_TYPE.DECISION_FLOW]: {
    type: NODE_TYPE.DECISION_FLOW,
    name: '决策流',
    style: {
      themeColor: '#1890ff',
    },
  },
  [NODE_TYPE.RECOGNITION_SET]: {
    type: NODE_TYPE.RECOGNITION_SET,
    name: '识别集',
    style: {
      themeColor: '#935be7',
    },
  },
  [NODE_TYPE.DECISION_TREE]: {
    type: NODE_TYPE.DECISION_TREE,
    name: '决策树',
    style: {
      themeColor: '#08979c',
    },
  },
  [NODE_TYPE.RULE_SET]: {
    type: NODE_TYPE.RULE_SET,
    name: '深度规则集',
    style: {
      themeColor: '#fa5c14',
    },
  },
  [NODE_TYPE.DECISION_METRICS]: {
    type: NODE_TYPE.DECISION_METRICS,
    name: '决策指标',
    style: {
      themeColor: '#FAAD14',
    },
  },
  [NODE_TYPE.ASSIGN]: {
    type: NODE_TYPE.ASSIGN,
    name: '赋值',
    style: {
      themeColor: '#eb3096',
    },
  },
  [NODE_TYPE.DECISION]: {
    type: NODE_TYPE.DECISION,
    name: '决策',
    style: {
      themeColor: '#3118ff',
    },
  },
}
