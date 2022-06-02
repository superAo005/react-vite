/*
 * @Author: Charles.qu
 * @Date: 2022-03-15 16:23:54
 * @Last Modified by: superao
 * @Last Modified time: 2022-03-19 17:10:18
 */
import React from "react";
import { Input } from "antd";
import "./index.scss";

interface IProp {
  data?: Object;
  node: any;
}
const Description = (param: IProp) => {
  const { data = {}, node } = param;
  const style = node.prop("style");
  const { width, height, id, changeNodeData, getNodeData } = data as any;
  const handleOnchange = (e: any) => {
    const { value } = e.target;
    changeNodeData(id, { alias: value });
  };
  const { alias } = getNodeData(id);
  return (
    <div className="Description__con" style={{ height, width }}>
      <Input
        placeholder="条件描述"
        onChange={handleOnchange}
        value={alias}
        style={style}
      />
    </div>
  );
};

export default Description;
