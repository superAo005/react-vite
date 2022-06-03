/*
 * @Author: superao
 * @Date: 2022-03-14 09:59:34
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-19 17:15:00
 */
import React from "react";
import { TreeSelect, Select, Input, Button, Tooltip } from "antd";
import { DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import { TreeNode } from "antd/lib/tree-select";
import "./index.scss";

interface IProp {
  data: Record<string, any>;
  treeSelectData: Array<any>;
  operatorData: Array<any>;
  node: any;
}

interface IState {
  operatorList: any;
  showRight: boolean;
  title: string;
}

const NOTSHOWRIGHTLIST = ["empty", "notEmpty"];
class Calculate extends React.Component<IProp, IState> {
  constructor(prop: IProp) {
    super(prop);
    const { data = {}, treeSelectData } = prop;
    const { leftValue, operator } = data as any;
    this.state = {
      operatorList: this.filterOperator(
        (this.findItem(leftValue, treeSelectData) || {})["dataType"]
      ),
      showRight: this.showRight(operator),
      title: (this.findItem(leftValue, treeSelectData) || {})["title"],
    };
  }

  findItem = (code: string, data: any): Record<string, any> => {
    let res = null;
    (function recursion(data) {
      for (const item of data) {
        if (!res) {
          const { code: itemCode, children } = item;
          if (String(code) === String(itemCode)) {
            if (!res) {
              res = item;
            }
          } else {
            recursion(children);
          }
        }
      }
    })(data);
    return res;
  };

  filterOperator = (dataType: string): Array<any> => {
    const { operatorData } = this.props;
    const operatorList = operatorData.filter((v) => {
      const { dataTypes } = v;
      return dataTypes.includes(dataType);
    });
    return operatorList;
  };

  handleSelectLeftFocus = () => {
    this.setState({ title: "" });
  };

  handleSelectLeftBlur = () => {
    const { data = {}, treeSelectData } = this.props;
    const { getNodeData, id } = data;
    const { leftValue } = getNodeData(id) || {};
    const { title } = this.findItem(leftValue, treeSelectData) || {};
    this.setState({ title });
  };

  handleSelectLeft = (v: string) => {
    const { data = {}, treeSelectData } = this.props;
    const { changeNodeData, id } = data as any;
    const { dataType, ruleType } = this.findItem(v, treeSelectData) || {};
    changeNodeData(id, {
      leftValue: v,
      leftType: ruleType,
      operator: null,
      rightValue: "",
    });
    this.setState({
      operatorList: this.filterOperator(dataType),
      showRight: true,
    });
  };

  handleSelectOperator = (v: string) => {
    const { data = {} } = this.props;
    const { changeNodeData, id } = data as any;
    changeNodeData(id, { operator: v, rightValue: "" });
    this.setState({ showRight: this.showRight(v) });
  };

  showRight = (value: string): boolean => {
    return !NOTSHOWRIGHTLIST.includes(value);
  };

  handleInputChange = (e: any) => {
    const { value } = e.target;
    const { data = {} } = this.props;
    const { changeNodeData, id } = data as any;
    changeNodeData(id, { rightValue: value });
  };

  handleClickDel = () => {
    const { data } = this.props;
    const { delNode, id } = data as any;
    delNode(id);
  };

  handleHandleCopy = () => {
    const { data = {} } = this.props;
    const { addNode, getNodeData, id } = data as any;
    const { leftValue } = getNodeData(id) || {};
    addNode(id, { leftValue });
  };

  render(): React.ReactNode {
    const { data = {}, treeSelectData, node } = this.props;
    const style = node.prop("style");
    const { width, height, getNodeData, id } = data as any;
    const { leftValue, operator, rightValue } = getNodeData(id) || {};
    const { operatorList, showRight, title } = this.state;
    return (
      <div className="calculate__con" style={{ height, width }}>
        <div className="calculate__con_leftselect" style={style}>
          <div className="calculate__con_leftselect-btn">
            <Tooltip placement="top" title="复制">
              <Button
                icon={
                  <CopyOutlined className="calculate__con_leftselect-btn-icon" />
                }
                onClick={this.handleHandleCopy}
              ></Button>
            </Tooltip>
          </div>
          <Tooltip placement="topLeft" title={title}>
            <TreeSelect
              placeholder="请选择左值(特征、属性、指标)"
              onBlur={this.handleSelectLeftBlur}
              onFocus={this.handleSelectLeftFocus}
              onChange={this.handleSelectLeft}
              value={leftValue}
              showSearch
              dropdownStyle={{ maxHeight: 600, overflow: "auto" }}
              allowClear
              treeDefaultExpandAll
            >
              {renderTreeNode(treeSelectData)}
            </TreeSelect>
          </Tooltip>
        </div>
        <div className="calculate__con_midoperator" style={style}>
          <Select
            placeholder="运算符"
            onChange={this.handleSelectOperator}
            value={operator}
            options={operatorList}
          ></Select>
        </div>

        <div className="calculate__con_rightvalue" style={style}>
          {" "}
          {showRight && (
            <Input
              placeholder="右值"
              onChange={this.handleInputChange}
              value={rightValue}
            ></Input>
          )}
        </div>

        <div className="calculate__con_delicon" onClick={this.handleClickDel}>
          <DeleteOutlined className="calculate__con_delicon-icon" />
        </div>
      </div>
    );
  }
}
export default Calculate;

export function renderTreeNode(attrFeature: Array<any>) {
  return attrFeature.map((item) => {
    return (
      <TreeNode
        key={item.code}
        selectable={false}
        value={item.code}
        title={
          <b style={{ color: "#003DD8" }}>{`${item.title}${
            item.shared == true ? "(共享)" : ""
          }`}</b>
        }
      >
        {item.name == "prop" ? renderAttr(item) : renderFeature(item)}
      </TreeNode>
    );
  });
}
function renderFeature(param: any) {
  return param.children.map((item: any) => {
    if (item.type === "root") {
      //是一个根节点，还要再循环下chileren
      return (
        <TreeNode
          key={item.code}
          selectable={false}
          value={item.code}
          title={<b style={{ color: "#003DD8" }}>{item.title}</b>}
        >
          {item.children.map((childItem: any) => {
            if (childItem.type == "root") {
              return (
                <TreeNode
                  key={childItem.code}
                  selectable={false}
                  value={childItem.code}
                  title={<b style={{ color: "#003DD8" }}>{childItem.title}</b>}
                >
                  {childItem.children.map((threeItem: any) => {
                    if (threeItem.type == "root") {
                      return (
                        <TreeNode
                          key={threeItem.code}
                          selectable={false}
                          value={threeItem.code}
                          title={
                            <b style={{ color: "#003DD8" }}>
                              {threeItem.title}
                            </b>
                          }
                        >
                          {threeItem.children.map((last: any) => {
                            return (
                              <TreeNode
                                key={last.code}
                                value={last.code}
                                title={last.title}
                              />
                            );
                          })}
                        </TreeNode>
                      );
                    } else if (threeItem.type == "node") {
                      return (
                        <TreeNode
                          key={threeItem.code}
                          value={threeItem.code}
                          title={threeItem.title}
                        />
                      );
                    }
                  })}
                </TreeNode>
              );
            } else if (childItem.type == "node") {
              return (
                <TreeNode
                  key={childItem.code}
                  value={childItem.code}
                  title={childItem.title}
                />
              );
            }
          })}
        </TreeNode>
      );
    } else if (item.type == "node") {
      //是一个元素节点
      return <TreeNode key={item.code} value={item.code} title={item.title} />;
    }
  });
}
function renderAttr(param: any) {
  return param.children.map((item: any) => {
    return <TreeNode key={item.code} value={item.code} title={item.title} />;
  });
}
