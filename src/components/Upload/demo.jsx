export default () => {
    // 获取Form组件的实例对象
    const [form] = Form.useForm();
  
    const onFinish = (values) => {
      console.log("Form表单收集的表单值", values);
    };
  
    return (
      <div className="goodform">
        {/*
          initialValues 用于给表单添加“默认初始值”，相当于H5中defaultValue
          所以，大家不要用它来填充表单，因为填充表单的数据是异步的。
          在这里，使用接口数据填充表单，只能form.setFieldsValue()来填充表单。
        */}
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          validateTrigger="onBlur"
          onFinish={onFinish}
          initialValues={{ img: "" }}
        >
          {/* 被 Form.Item 包裹的表单组件，相当于默认给了它 value属性、onChange事件 */}
          {/* valuePropName 用于修改使用什么属性来受控 */}
          <Form.Item name="hot" label="是否热销" valuePropName="checked">
            <Switch />
          </Form.Item>
  
          <Form.Item name="img" label="商品图片">
            <GkUpload />
          </Form.Item>
  
          <Form.Item wrapperCol={{ span: 8, offset: 4 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  