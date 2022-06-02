import React, { useEffect, useState, useMemo } from "react";
import { Button } from "antd";
export default () => {
  const [data, setData] = useState([]);
  const newData = useMemo(() => {
    console.log("memo", data);
    return JSON.stringify(data);
  }, [data]);
  // 期望：数组中值发生改变时，才重新计算
  useEffect(() => {
    const keys = Object.keys(newData);
    console.log("========== root", keys);
  }, [newData]);
  console.log("rerender...");
  return (
    <div>
      <p> {JSON.stringify(data, null, 2)} </p>
      <Button
        onClick={() => {
          console.log("click1", data);
          // 1. 引用没改变，值改变，组件没有发生重新渲染
          setData(() => {
            data.push({
              a: 1,
            });
            return data;
          });
        }}
      >
        +
      </Button>
      <Button
        onClick={() => {
          console.log("===== click2", data);
          // 2. 引用改变，值没改变，做了无用的渲染
          setData([...data]);
        }}
      >
        -
      </Button>
    </div>
  );
};
