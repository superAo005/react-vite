/*
 * @Author: Charles.qu
 * @Date: 2022-03-18 09:25:53
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-19 17:06:56
 */

import AndOr from "../AndOr";
import Cascade from "./components/Cascade";
import Description from "./components/Description";
interface IProps {
  /** 画布容器id */
  containerId: string;
  /** 初始化数据 */
  data: any;
  /** 级联选择左侧列表数据 */
  treeSelectData?: Array<any>;
  operatorData?: Array<any>;
}

export enum NodeTypes {
  DESCRIPTION = "DESCRIPTION",
  CASCADE = "CASCADE",
}

export default class AndOrBus {
  containerId: string;
  data: any;
  andOr: AndOr;
  constructor(props: IProps) {
    this.containerId = props.containerId;
    this.andOr = new AndOr({
      containerId: this.containerId,
      data: this.initData(props?.data),
      nodes: {
        [NodeTypes.DESCRIPTION]: {
          width: 140,
          height: 50,
          type: NodeTypes.DESCRIPTION,
          component: Description,
        },
        [NodeTypes.CASCADE]: {
          width: 550,
          height: 50,
          type: NodeTypes.CASCADE,
          props: {
            treeSelectData: props.treeSelectData,
            operatorData: formatOperator(props.operatorData),
          },
          component: Cascade,
        },
      },
    });
  }

  initData = (data: any) => {
    let dataT = data;
    if (!Object.keys(data).length) {
      dataT = {
        conditions: [
          {
            conditions: [{}],
            logical: "OR",
          },
        ],
        logical: "AND",
      };
    }
    const deepClone = JSON.parse(JSON.stringify(dataT));
    return AndOr.addTypeToData(deepClone, [
      NodeTypes.DESCRIPTION,
      NodeTypes.CASCADE,
    ]);
  };

  /**
   * 根据id高亮元素
   * @param nodeIds id列表
   * @param style  css样式
   */
  highlight = (nodeIds: Array<string>, style: Partial<CSSStyleDeclaration>) => {
    nodeIds.forEach((v: string) => {
      this.andOr.updateNode(v, { style });
    });
  };

  /**
   * 获取数据
   * @returns
   */
  getData = () => {
    return this.andOr.getData();
  };
}

/**
 * 格式化操作符
 * @param data
 * @returns s
 */
const formatOperator = (
  data: Array<any>
): Array<{
  [n: string]: Record<string, any>;
}> => {
  if (!Array.isArray(data)) {
    throw new Error("data must be an array");
  }
  const map = [] as Array<any>;
  data.forEach((v: any) => {
    const params = {
      label: v["name"],
      value: v["code"],
      ...v,
    };
    delete params["paramsLength"];
    map.push(params);
  });
  return map;
};
