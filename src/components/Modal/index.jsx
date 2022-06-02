import React, { useEffect, useState } from "react";
import { Form, Input, Spin } from "antd";
import axios from "axios";
/**
 * 添加 spin、loading，在请求中页面显示 loading 状态空值表单，等到加载完数据后再执行 resetFields
 * @returns 
 */
const App = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState({});
  useEffect(() => {
    axios.get("/api/xxx").then((data) => {
      setDetail(data);
      form.resetFields();
      setLoading(false);
    });
  }, [form]);
  return (
    <>
      <Spin spinning={loading}>
        <Form form={form} initialValues={detail}>
          <Form.Item name="age" label="age">
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};
export default App;
