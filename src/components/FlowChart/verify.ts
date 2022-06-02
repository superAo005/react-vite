/** 合法校验
 * 1、活动节点 所在的所有路径 都要校验
 * @Author: superao
 * @Date: 2022-03-08 19:13:29
 * @Last Modified by: superao
 * @Last Modified time: 2022-04-07 16:44:47
 */
import { Cell, Graph, Node } from '@antv/x6'
import { Options } from '@antv/x6/lib/graph/options'
import FlowChart from '.'
import errConfig from './config/errConfig'
import {
  DEFAULT_RULE,
  FLOW_CONFIG,
  FLOW_TYPE,
  IFLOW_CONFIG_ITEM,
  INodeRule,
  INodesRule,
} from './config/flows'
import { NODE_TYPE } from './config/nodes'
import { IEdge, INodeData } from './dataManager'
import { PORT_TYPE } from './node'
interface IVerifyParam {
  flowRef: FlowChart
}
interface ICommonOption {
  /** 是否要新增节点 */
  isNew?: boolean
  /** 要新增节点的类型 */
  addNodeType?: NODE_TYPE
}
export interface IVerifyResult {
  /** 报错的节点类型 */
  nodeType?: NODE_TYPE
  /** 报错的节点id */
  nodeIds: string[]
  /** 错误码 */
  code: string
  /** 错误信息 */
  errMsg: string
  /** 报错相关信息 定位问题用 */
  errData?: any
}
const defaultVerifyResult = [
  {
    nodeType: '',
    /** 报错的节点id */
    nodeIds: [],
    ...errConfig['001'],
  },
] as unknown as IVerifyResult[]

export default class Verify {
  graphRef: Graph
  flowRef: FlowChart
  graphType: FLOW_TYPE
  graphTypeConfig: IFLOW_CONFIG_ITEM
  constructor(data: IVerifyParam) {
    this.flowRef = data?.flowRef
    this.graphRef = data?.flowRef?.getGraphRef()
    this.graphType = data?.flowRef?.getGraphType()
    this.init()
  }
  private init() {
    this.mergeGraphTypeConfig()
  }
  private mergeGraphTypeConfig() {
    const { nodeType: originalNodeType, nodesRule: originalNodesRule } =
      FLOW_CONFIG[this.graphType]?.rule || {}
    const mergeNodeTypeResult = [...originalNodeType, ...(DEFAULT_RULE?.nodeType || [])]
    const mergeNodeListRule = (originRule: INodeRule[], paramRule: INodeRule[]): INodeRule[] => {
      const filterRule = paramRule?.filter((item) => mergeNodeTypeResult?.includes(item.type))
      if (!filterRule?.length) return originRule
      if (!originRule?.length) return paramRule
      const combineRule = [...filterRule, ...originRule]
      const allRuleType = Array.from(new Set(combineRule?.map((item) => item.type)))
      const mergeRule: INodeRule[] = allRuleType.map((item) => {
        return {
          type: item,
          limit: combineRule.find((combineRuleItem) => combineRuleItem.type === item).limit || [
            0, 0,
          ],
        }
      })
      return mergeRule
    }
    const mergeNodesRule = () => {
      const mergeRule = originalNodesRule as INodesRule
      const nodesRuleParam = this.flowRef.options.nodesRule || {}
      const nodesRuleParamKeys = Object.keys(nodesRuleParam)
      if (!nodesRuleParamKeys?.length) return mergeRule
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const filterKey = nodesRuleParamKeys?.filter((item) => mergeNodeTypeResult?.includes(item))
      const mergeKey = Array.from(new Set([...filterKey, ...Object.keys(originalNodesRule)]))
      mergeKey.forEach((key) => {
        let mergeObj = originalNodesRule[key]
        const {
          parentNode: originalParentNode,
          siblingNode: originalSiblingNode,
          childNode: originalChildNode,
        } = originalNodesRule[key]
        const { parentNode, siblingNode, childNode } = nodesRuleParam[key] || {}
        if (nodesRuleParam[key]) {
          mergeObj = {
            ...originalNodesRule[key],
            ...nodesRuleParam[key],
            parentNode: mergeNodeListRule(originalParentNode, parentNode),
            childNode: mergeNodeListRule(originalChildNode, childNode),
            siblingNode: mergeNodeListRule(originalSiblingNode, siblingNode),
          }
        }
        mergeRule[key] = mergeObj
      })
      return mergeRule
    }
    const mergeNodesRuleResult = mergeNodesRule()
    this.graphTypeConfig = {
      ...FLOW_CONFIG[this.graphType],
      rule: {
        ...FLOW_CONFIG[this.graphType].rule,
        nodesRule: mergeNodesRuleResult,
        nodeType: mergeNodeTypeResult,
      },
    }
  }
  private transNode2NodeId(nodes: { id?: string }[]) {
    return this.flowRef.dataManager.transNode2NodeId(nodes)
  }
  private filterNodes(nodes: Cell[], needType: NODE_TYPE) {
    return nodes?.filter((nodeItem) => {
      const { nodeData } = nodeItem.getData<INodeData>() || {}
      return nodeData.type === needType
    })
  }
  /**
   * 校验边的优先级是否合法
   */
  verifyRouteEdgeLevel = (edgeId: string, level: number) => {
    const edge = this.flowRef.dataManager.getCellById(edgeId) as IEdge
    const sourceCell = this.flowRef.dataManager.getCellById(edge.source.cell)
    const sourceCellChildNodes = this.flowRef.dataManager.getChildNode(sourceCell.id, {
      nodeType: NODE_TYPE.ROUTE,
    })
    const edges = this.flowRef.getGraphData().edges?.filter((item) => {
      return (
        item?.id != edgeId &&
        sourceCellChildNodes.find((childNode) => {
          return item.source?.cell === sourceCell?.id && item?.target?.cell === childNode?.id
        })
      )
    })
    const sameLevelsEdges = edges?.filter((item) => {
      return item.data.level === level
    })
    const verifyResult: IVerifyResult[] = []
    if (sameLevelsEdges?.length) {
      verifyResult.push({
        nodeIds: sameLevelsEdges?.map((item) => item.target?.cell),
        ...errConfig['015'],
      })
    }
    return verifyResult
  }
  /**
   * 指定节点id
   * 校验其与其父节点的关系是否合法
   * 校验逻辑: 该节点的父节点是否可以有某类型的节点，以及其数量是否满足规则
   * */
  verifyParent(nodeId: string, options?: ICommonOption) {
    const { nodesRule } = this.graphTypeConfig?.rule || {}
    const { isNew, addNodeType } = options || {}
    const curNode = this.graphRef.getCellById(nodeId)
    const [curNodeType] = this.flowRef.dataManager.getAllNodeType([curNode]) || []
    // 父节点规则
    const { parentNode: parentNodeRule, connectInMax = Infinity } = nodesRule[curNodeType] || {}
    // 父节点类型规则
    const parentNodeTypesRule = parentNodeRule?.map((item) => item.type)
    const parentNodes = this.flowRef.nodeManager.getParentNode(nodeId)
    const parentNodesLength = isNew ? parentNodes?.length + 1 : parentNodes?.length
    if (parentNodesLength > connectInMax) {
      return [
        {
          ...errConfig['012'],
          errData: {
            connectInMax,
          },
          nodeIds: [nodeId],
        },
      ]
    }
    const needVerifyNodeTypes = isNew
      ? [addNodeType]
      : this.flowRef.dataManager.getAllNodeType(parentNodes)
    const verifyResult: IVerifyResult[] = []
    needVerifyNodeTypes?.forEach((needVerifyNodeType) => {
      const canBeParent = parentNodeTypesRule?.includes(needVerifyNodeType)
      let isInLimit = false
      const needVerifyNodes = this.filterNodes(parentNodes, needVerifyNodeType)
      // 不能当父亲， 没必要往下计算了
      if (canBeParent) {
        const length = isNew ? needVerifyNodes?.length + 1 : needVerifyNodes?.length
        const [min, max] =
          parentNodeRule?.find((item) => item.type === needVerifyNodeType)?.limit || []
        isInLimit = length >= min && length <= max
      }
      const status = canBeParent && isInLimit
      // 当前节点的个数 是否满足个数要求
      !status &&
        verifyResult.push({
          ...errConfig['006'],
          errData: {
            canBeParent,
            isInLimit,
            sourceNodeType: curNodeType,
          },
          nodeIds: this.transNode2NodeId(needVerifyNodes),
          nodeType: needVerifyNodeType,
        })
    })
    return verifyResult
  }
  /**
   * 指定节点id
   * 校验其与其子节点的关系是否合法
   * 校验逻辑: 该节点下是否可以有某类型的节点，以及其数量是否满足规则
   * */
  verifyChild(nodeId: string, options?: ICommonOption) {
    const { nodesRule } = this.graphTypeConfig?.rule || {}
    const { isNew, addNodeType } = options || {}
    const curNode = this.graphRef.getCellById(nodeId)
    const [curNodeType] = this.flowRef.dataManager.getAllNodeType([curNode]) || []
    // 子节点规则
    const { childNode: childNodeRule, connectOutMax = Infinity } = nodesRule[curNodeType] || {}
    // 子节点类型规则
    const childNodeTypesRule = childNodeRule?.map((item) => item.type)
    const childNodes = this.flowRef.nodeManager.getChildNode(nodeId)
    const childNodesLength = isNew ? childNodes?.length + 1 : childNodes?.length
    if (childNodesLength > connectOutMax) {
      return [
        {
          ...errConfig['013'],
          errData: {
            connectOutMax,
          },
          nodeIds: [nodeId],
        },
      ]
    }
    const needVerifyNodeTypes = isNew
      ? [addNodeType]
      : this.flowRef.dataManager.getAllNodeType(childNodes)
    const verifyResult: IVerifyResult[] = []
    needVerifyNodeTypes?.forEach((needVerifyNodeType) => {
      const canBeChild = childNodeTypesRule?.includes(needVerifyNodeType)
      let isInLimit = false
      const needVerifyNodes = this.filterNodes(childNodes, needVerifyNodeType)
      // 不能当儿子， 没必要往下计算了
      if (canBeChild) {
        const length = isNew ? needVerifyNodes?.length + 1 : needVerifyNodes?.length
        const [min, max] =
          childNodeRule?.find((item) => item.type === needVerifyNodeType)?.limit || []
        isInLimit = length >= min && length <= max
      }
      const status = canBeChild && isInLimit
      // 当前节点的个数 是否满足个数要求
      if (!status) {
        verifyResult.push({
          ...errConfig['010'],
          errData: {
            canBeChild,
            isInLimit,
            sourceNodeType: curNodeType,
          },
          nodeIds: this.transNode2NodeId(needVerifyNodes),
          nodeType: needVerifyNodeType,
        })
      }
    })
    return verifyResult
  }
  /**
   * 给定父节点id
   * 校验其子节点之间的兄弟关系是否合法
   * 为什么是父节点id而不是其中某个兄弟节点id：一个节点可能有多个父节点，那么他可能就有两套兄弟关系
   * 所以我们从父节点出发 寻找唯一的一套兄弟关系
   * 校验逻辑：id下子节点都有哪些类型，这些类型是否可以成为兄弟节点，以及其数量是否满足规则
   * ? 为啥基于类型去校验而不是基于单个节点
   * 规则是节点类型纬度的规则，所以校验也从类型纬度去校验，而不是每个节点
   * ! 兄弟关系的成立 需要两节点类型之间的双向奔赴,所以👇🏻
   * A/B两个节点类型，需要校验
   * 1、A的兄弟节点规则里 是否可以有B，以及B的数量是否满足
   * 2、B的兄弟节点规则里 是否可以有A，以及A的数量是否满足
   * ! 两节点类型相同时，比如都是A
   * 因为是同类型，只校验他自己的类型规则即可
   * A的兄弟是否可以有A，和及其兄弟个数[需要减去一个目标，剩下的才是他的兄弟]是否满足
   * */
  verifySiblingByParentId(parentNodeId: string, options?: ICommonOption): IVerifyResult[] {
    if (!parentNodeId) return defaultVerifyResult
    const { nodesRule } = this.graphTypeConfig?.rule || {}
    // 获取当前所有兄弟节点
    const allSiblingNodes = this.flowRef.nodeManager.getChildNode(parentNodeId)
    // 获取当前所有的节点类型
    const allSiblingNodeType = this.flowRef.dataManager.getAllNodeType(allSiblingNodes)
    const { isNew, addNodeType } = options || {}
    // 需要对比校验的节点类型
    // 新增节点场景的话 只需要校验的新增节点类型即可
    // 否则校验所有节点类型之间的兄弟关系
    const needVerifyNodeTypes = isNew ? [addNodeType] : allSiblingNodeType
    const verifyResult: IVerifyResult[] = []
    // !分左右两列节点类型 遍历对比
    const leftNodeTypes = allSiblingNodeType
    const rightNodeTypes = needVerifyNodeTypes
    leftNodeTypes.map((leftNodeType) => {
      // 当前类型的兄弟节点规则
      const { siblingNode: leftNodeType_siblingNodeRule } = nodesRule[leftNodeType] || {}
      // 当前类型的兄弟节点类型可以是哪些
      const leftNodeType_siblingNodeRuleTypes = leftNodeType_siblingNodeRule?.map(
        (item) => item.type
      )
      const leftNodeTypeNodes = this.filterNodes(allSiblingNodes, leftNodeType) || []
      rightNodeTypes?.map((rightNodeType) => {
        const { siblingNode: rightNodeType_siblingNodeRule } = nodesRule[rightNodeType] || {}
        const rightNodeType_siblingNodeRuleTypes = rightNodeType_siblingNodeRule?.map(
          (item) => item.type
        )
        const rightNodeTypeNodes = this.filterNodes(allSiblingNodes, rightNodeType) || []
        // ============== 校验同类型 ==============
        const checkSameTypeSibling = (sameType: NODE_TYPE) => {
          const [min, max] = leftNodeType_siblingNodeRule?.find((item) => item.type === sameType)
            ?.limit || [0, 0]
          const sameTypeNodes = this.filterNodes(allSiblingNodes, sameType)
          // 减去自身的数量【1个】 剩下的是他的兄弟数量
          const siblingLength = Math.max(sameTypeNodes?.length - 1, 0)
          // 如果是新增场景 还需要加一
          const length = isNew ? siblingLength + 1 : siblingLength
          const isInLimit = min <= length && length <= max
          const status = isInLimit
          if (!status) {
            verifyResult.push({
              ...errConfig['007'],
              errData: {
                isInLimit,
                sourceNodeType: sameType,
              },
              nodeType: sameType,
              nodeIds: this.transNode2NodeId(sameTypeNodes),
            })
          }
        }
        // ============== 校验 rightNodeType 能不能做 leftNodeType 的兄弟 ==============
        const checkRightcanBeLeftSibling = () => {
          const RightInLeftSiblingRules = leftNodeType_siblingNodeRuleTypes?.includes(rightNodeType)
          let isRightInLimit = false
          const [Rightmin, Rightmax] =
            leftNodeType_siblingNodeRule?.find((item) => item.type === rightNodeType)?.limit || []
          const length = isNew ? rightNodeTypeNodes?.length + 1 : rightNodeTypeNodes?.length
          isRightInLimit = length >= Rightmin && length <= Rightmax
          const rightcanBeLeftSibling = RightInLeftSiblingRules && isRightInLimit
          if (!rightcanBeLeftSibling) {
            verifyResult.push({
              ...errConfig['008'],
              errData: {
                RightInLeftSiblingRules,
                isInLimit: isRightInLimit,
                sourceNodeType: leftNodeType,
              },
              nodeIds: this.transNode2NodeId(rightNodeTypeNodes),
              nodeType: rightNodeType,
            })
          }
        }
        // ============== 校验 leftNodeType 能不能做 rightNodeType 的兄弟 ==============
        const checkLeftcanBeRightSibling = () => {
          const RightInRightSiblingRules =
            rightNodeType_siblingNodeRuleTypes?.includes(leftNodeType)
          const [Rightmin, Rightmax] =
            rightNodeType_siblingNodeRule?.find((item) => item.type === leftNodeType)?.limit || []
          const length = leftNodeTypeNodes?.length
          const isAInLimit = length >= Rightmin && length <= Rightmax
          const leftcanBeRightSibling = RightInRightSiblingRules && isAInLimit
          if (!leftcanBeRightSibling) {
            verifyResult.push({
              ...errConfig['009'],
              errData: {
                RightInRightSiblingRules,
                isInLimit: isAInLimit,
                sourceNodeType: leftNodeType,
              },
              nodeIds: this.transNode2NodeId(leftNodeTypeNodes),
              nodeType: rightNodeType,
            })
          }
        }
        // 主要是给路由、default类型节点做的
        const checkMustHaveSibling = () => {
          const leftNodeType_mustHave_siblingNodeRuleTypes = leftNodeType_siblingNodeRule
            ?.filter((item) => item.limit[0] > 0)
            ?.map((item) => item.type)
          const notHasNodeType = leftNodeType_mustHave_siblingNodeRuleTypes?.filter(
            (item) => !leftNodeTypes.includes(item)
          )
          if (notHasNodeType?.length) {
            verifyResult.push({
              ...errConfig['016'],
              errData: {
                leftNodeType_mustHave_siblingNodeRuleTypes,
              },
              errMsg: `${leftNodeType} 类型的节点必须有 ${notHasNodeType?.join()} 类型的兄弟节点`,
              nodeIds: this.transNode2NodeId(leftNodeTypeNodes),
              nodeType: leftNodeType,
            })
          }
        }
        // 新增节点场景 不需要这个校验
        !isNew && checkMustHaveSibling()
        if (leftNodeType === rightNodeType) {
          checkSameTypeSibling(leftNodeType)
        } else {
          checkRightcanBeLeftSibling()
          checkLeftcanBeRightSibling()
        }
      })
    })
    return verifyResult
  }
  /**
   * 给定节点id
   * 校验其兄弟关系是否合法
   * */
  verifySibling(nodeId: string, options?: ICommonOption): IVerifyResult[] {
    const parentNodes = this.flowRef.nodeManager.getParentNode(nodeId)
    const verifyResult: IVerifyResult[] = []
    parentNodes?.forEach((item) => {
      const result = this.verifySiblingByParentId(item?.id, options)
      verifyResult.push(...result)
    })
    return verifyResult
  }
  /**
   * 给定节点id
   * 获取节点所在的所有路径
   * 校验每条路径上节点类型的总个数是否合法 */
  verifyNodeNumberOnOnePath(nodeId: string, options?: ICommonOption): IVerifyResult[] {
    if (!nodeId) return defaultVerifyResult
    const { nodesRule } = this.graphTypeConfig?.rule || {}
    const { isNew, addNodeType } = options || {}
    const node = this.graphRef.getCellById(nodeId)
    const upPaths = this.flowRef.nodeManager.getUpPathNodes(nodeId)
    // 新增节点则不需要往下查找
    const downPaths = isNew ? [] : this.flowRef.nodeManager.getDownPathNodes(nodeId)
    const paths = getPaths()
    function getPaths() {
      ;[upPaths, downPaths]?.forEach((item) => {
        if (item?.length <= 0) {
          // 空数组不会被遍历，方便下面排列组合
          item.push([])
        }
      })
      const paths: Cell<Cell.Properties>[][] = []
      // 上下游的排列组合
      upPaths.forEach((upItem) => {
        downPaths.forEach((downItem) => {
          paths.push([...upItem, node, ...downItem])
        })
      })
      return paths || []
    }
    const verifyResult: IVerifyResult[] = []
    paths.forEach((nodes) => {
      // 当前路径上的所有节点类型
      const needVerifyNodeTypes = isNew
        ? [addNodeType]
        : this.flowRef.dataManager.getAllNodeType(nodes)
      needVerifyNodeTypes.forEach((needVerifyNodeType) => {
        // 默认数量无限制
        const { maxLimitForPath = Infinity } = nodesRule[needVerifyNodeType] || {}
        const needVerifyNodes = this.filterNodes(nodes, needVerifyNodeType)
        const length = isNew ? needVerifyNodes?.length + 1 : needVerifyNodes.length
        const status = length <= maxLimitForPath
        if (!status) {
          if (needVerifyNodeType == NODE_TYPE.RECOGNITION_SET) {
            verifyResult.push({
              nodeType: needVerifyNodeType,
              nodeIds: this.transNode2NodeId(needVerifyNodes),
              ...errConfig['017'],
            })
          } else {
            verifyResult.push({
              nodeType: needVerifyNodeType,
              nodeIds: this.transNode2NodeId(needVerifyNodes),
              ...errConfig['004'],
            })
          }

        }
      })
    })
    return verifyResult
  }
  // !===================== 链接节点时校验 =====================
  /**
   * 校验连线是否有效
   * 连线时调用
   * 链接过程中不会一直调用
   * Graph是把所有的链接桩遍历了一边
   * 校验规则
   * 1、有向: 从 OUT 链接桩 连到 IN
   * 1、无环: 不能连接到他的祖先节点
   * 2、遵循节点规则 INodesRule: 连线后 他的父子、兄弟关系、一条路径上节点类型的总个数需要满足规则
   * @param param
   * @returns
   */
  validateConnection = (param: Options.ValidateConnectionArgs) => {
    const { sourceCell, sourceMagnet, targetView, targetMagnet, targetCell } = param
    function checkDirection() {
      const isOutPort = sourceMagnet.getAttribute('port-group') === PORT_TYPE.OUT
      const isInPort = targetMagnet.getAttribute('port-group') === PORT_TYPE.IN
      return isOutPort && isInPort
    }
    const checkIsWithoutLoop = () => {
      const upPath = this.flowRef.nodeManager.getUpPathNodes(sourceCell?.id)
      const hasTargeNode = upPath?.find((item) => {
        return item.find((item) => item.id === targetCell?.id)
      })
      return !hasTargeNode
    }
    const checkRule = () => {
      const sourceNodeType = sourceCell?.getData<INodeData>()?.nodeData?.type
      const targetNodeType = targetCell?.getData<INodeData>()?.nodeData?.type
      const verifyNodeNumberOnOnePath = () => {
        const upPathNodes = this.flowRef.nodeManager.getUpPathNodes(sourceCell.id, [], 0, true)
        const downPathNodes = this.flowRef.nodeManager.getDownPathNodes(targetCell.id, [], 0, true)
        const { nodesRule } = this.graphTypeConfig?.rule || {}
        const paths: Cell<Cell.Properties>[][] = []
        // 上下游的排列组合
        upPathNodes.forEach((upItem) => {
          downPathNodes.forEach((downItem) => {
            paths.push([...upItem, ...downItem])
          })
        })
        const verifyResult: IVerifyResult[] = []
        paths.forEach((nodes) => {
          // 当前路径上的所有节点类型
          const needVerifyNodeTypes = [sourceNodeType, targetNodeType]
          needVerifyNodeTypes.forEach((needVerifyNodeType) => {
            // 默认数量无限制
            const { maxLimitForPath = Infinity } = nodesRule[needVerifyNodeType] || {}
            const needVerifyNodes = this.filterNodes(nodes, needVerifyNodeType)
            const length = needVerifyNodes.length
            const status = length <= maxLimitForPath
            if (!status) {
              verifyResult.push({
                nodeType: needVerifyNodeType,
                nodeIds: this.transNode2NodeId(needVerifyNodes),
                ...errConfig['011'],
              })
            }
          })
        })
        return verifyResult
      }
      const verifyChild = this.verifyChild(sourceCell?.id, {
        isNew: true,
        addNodeType: targetNodeType,
      })
      const verifyParent = this.verifyParent(targetCell?.id, {
        isNew: true,
        addNodeType: sourceNodeType,
      })
      const verifySibling = this.verifySiblingByParentId(sourceCell?.id, {
        isNew: true,
        addNodeType: targetNodeType,
      })
      const verifyNodeNumberOnOnePathResult = verifyNodeNumberOnOnePath()
      // console.log('verifyChild', verifyChild)
      // console.log('verifyParent', verifyParent)
      // console.log('verifySibling', verifySibling)
      // console.log('verifyNodeNumberOnOnePathResult', verifyNodeNumberOnOnePathResult)
      const isError =
        verifyChild?.length ||
        verifyParent?.length ||
        verifySibling?.length ||
        verifyNodeNumberOnOnePathResult?.length
      return !isError
    }
    return targetMagnet && checkDirection() && checkIsWithoutLoop() && checkRule()
  }
  // !===================== 新增节点时校验 =====================
  /**
   * 获取 新增节点菜单可选节点类型
   * 计算规则：
   * 1、满足子节点规则
   * 2、满足兄弟节点规则
   * @param curNodeId
   * @param nodeType
   * @returns
   */
  getAddNodeMenu = (curNodeId: string) => {
    const node = this.graphRef?.getCellById(curNodeId)
    const { nodeData } = node?.getData<INodeData>() || {}
    const curNodeType = nodeData?.type
    const {
      rule: { nodesRule },
    } = this.graphTypeConfig
    const { childNode: childNodeRule } = nodesRule[curNodeType] || {}
    // 获取所有可以选择的子节点
    const childType = childNodeRule?.filter((item) => {
      const { canAddedManually = true } = item || {}
      const [min, max] = item.limit || []
      const isValid = max > 0 && max >= min && canAddedManually
      // ? 为什么没有复用上面的verifyParent
      // 因为 这里的场景不是新增父节点 这里是新增子节点；
      // 上面的verifyParent方法是校验已存在的某node与其父节点之间的合法性
      const verifyParent = () => {
        const { parentNode: parentNodeRule } = nodesRule[item?.type] || {}
        const curNodeTypeRule = parentNodeRule?.find((item) => item.type === curNodeType)
        const [min, max] = curNodeTypeRule?.limit || []
        return max >= 1
      }
      const verifyParentResult = verifyParent()
      const verifyChildResult = this.verifyChild(curNodeId, {
        isNew: true,
        addNodeType: item?.type,
      })
      const verifySiblingResult = this.verifySiblingByParentId(curNodeId, {
        isNew: true,
        addNodeType: item?.type,
      })
      const verifyNodeNumberOnOnePathResult = this.verifyNodeNumberOnOnePath(curNodeId, {
        isNew: true,
        addNodeType: item?.type,
      })
      // console.log('isValid', item?.type, isValid)
      // console.log('verifyParent', item?.type, verifyParentResult)
      // console.log('verifyChild', item?.type, verifyChildResult)
      // console.log('verifySibling', item?.type, verifySiblingResult)
      // console.log('verifyNodeNumberOnOnePath', item?.type, verifyNodeNumberOnOnePathResult)
      const verifayPass =
        verifyParentResult &&
        !verifyChildResult?.length &&
        !verifySiblingResult?.length &&
        !verifyNodeNumberOnOnePathResult?.length
      return isValid && verifayPass
    })

    return childType
  }
  // !===================== 是否可删除节点校验 =====================
  /**
   * 现在只有default节点有特殊逻辑，其他节点都可以随意删除，所以这里先针对default简单做
   * @returns
   */
  verifyCanDeteleNode = (curNodeId: string) => {
    const node = this.graphRef.getCellById(curNodeId) as Node
    const { nodeData } = node?.getData<INodeData>() || {}
    const cantAddDeleteBtnNodeType = [NODE_TYPE.START, NODE_TYPE.ROUTE_DEFAULT]
    // 如果路由default节点是 游离节点的话 还是要显示删除按钮的
    if (nodeData?.type === NODE_TYPE.ROUTE_DEFAULT && this.graphRef.isRootNode(node)) return true
    return !cantAddDeleteBtnNodeType?.includes(nodeData?.type)
  }

  // !===================== 下面是校验整个画布的相关方法 =====================
  /** 是否只有一个根节点 */
  verifyRootNode() {
    const rootNodes = this.flowRef.nodeManager.getRootNodes()
    const verifyResult: IVerifyResult[] = []
    if (rootNodes?.length > 1) {
      verifyResult.push({
        ...errConfig['002'],
        nodeIds: this.transNode2NodeId(rootNodes),
      })
    }
    return verifyResult
  }
  /**
   * 校验画布里的节点类型是否合法
   * 主要是为了校验初始化时 传入的数据可能不合法
   * */
  verifyNodeType = () => {
    const { nodeType } = this.graphTypeConfig?.rule || {}
    const errorTypeNodes = this.flowRef
      .getGraphData()
      ?.nodes?.filter((item) => !nodeType?.includes(item?.data?.nodeData?.type))
    const verifyResult: IVerifyResult[] = []
    if (errorTypeNodes?.length) {
      verifyResult.push({
        ...errConfig['014'],
        nodeIds: this.transNode2NodeId(errorTypeNodes),
      })
    }
    return verifyResult
  }
  /** 校验叶子节点类型是否合法 */
  verifyLeafNode() {
    const {
      rule: { leafNode: leafNodeTypeRule },
    } = this.graphTypeConfig || {}
    const leafNodes = this.flowRef.nodeManager.getLeafNodes()
    const errNodes = leafNodes?.filter((item) => {
      const { nodeData } = item.getData<INodeData>() || {}
      return !leafNodeTypeRule?.includes(nodeData.type)
    })
    const verifyResult: IVerifyResult[] = []
    if (errNodes?.length) {
      verifyResult.push({
        ...errConfig['005'],
        nodeIds: this.transNode2NodeId(errNodes),
      })
    }
    return verifyResult
  }
  /**
   * 是否存在节点为空节点【只添加了节点并没有编辑】
   * 判断依据： 业务数据[busiData]是否有值；有特殊校验场景再扩展吧
   * */
  verifyEmptyNode() {
    const nodes = this.flowRef.getGraphData()?.nodes || []
    const emptyNodes = nodes?.filter((item) => {
      const busiData = item.data?.busiData
      return (!busiData || !Object.keys(busiData)?.length) && item.id !== this.flowRef.rootNodeId
    })
    const verifyResult: IVerifyResult[] = []
    if (emptyNodes?.length >= 1) {
      verifyResult.push({
        ...errConfig['003'],
        // 增加 id 跟node 的转换
        nodeIds: this.transNode2NodeId(emptyNodes),
      })
    }
    return verifyResult
  }
  /**
   * 遍历所有节点
   * 校验节点的父子、兄弟关系是否合法
   */
  verifyGraphNodes() {
    const nodes = this.flowRef.getGraphData()?.nodes || []
    const verifyResult: IVerifyResult[] = []
    nodes?.forEach((node) => {
      const verifyParentResult = this.verifyParent(node?.id)
      const verifyChildResult = this.verifyChild(node?.id)
      const verifySiblingResult = this.verifySibling(node?.id)
      const result = [...verifyParentResult, ...verifyChildResult, ...verifySiblingResult]
      verifyResult.push(...result)
    })
    return verifyResult
  }
  /**
   * 校验画布上的所有路径上的节点类型总数是否合法
   */
  verifyGraphPaths() {
    return this.verifyNodeNumberOnOnePath(this.flowRef.rootNodeId)
  }
  verifyGraphRouteEdgeLevel() {
    const { edges } = this.flowRef.getGraphData()
    let verifyResult: IVerifyResult[] = []
    edges?.forEach((item) => {
      const verifyResultItem = this.verifyRouteEdgeLevel(item?.id, item.data.level)
      verifyResult = [...verifyResult, ...verifyResultItem]
    })
    return verifyResult
  }
  /** 校验整个画布 */
  verifyGraph() {
    return [
      ...this.verifyRootNode(),
      ...this.verifyNodeType(),
      ...this.verifyLeafNode(),
      ...this.verifyEmptyNode(),
      ...this.verifyGraphRouteEdgeLevel(),
      ...this.verifyGraphPaths(),
      ...this.verifyGraphNodes(),
    ]
  }
}
