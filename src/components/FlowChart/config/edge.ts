export const connectingConfig = {
  // 为 true 时连线的过程中距离节点或者连接桩 50px 时会触发自动吸附
  snap: true,
  // 是否允许连接到画布空白位置的点，默认为 true。
  allowBlank: false,
  // 当设置为 false 时，在起始和终止节点之间只允许创建一条边
  allowMulti: false,
  // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
  allowLoop: false,
  // 是否允许边链接到节点（非节点上的链接桩）
  allowNode: false,
  // 是否允许边链接到另一个边
  allowEdge: false,
  // 拖动边时，是否高亮显示所有可用的连接桩或节点
  highlight: true,
  connector: {
    name: 'jumpover',
    args: {
      radius: 10,
    },
  },
  router: {
    name: 'manhattan',
    args: {
      startDirections: ['bottom'],
      endDirections: ['top'],
    },
  },
}
