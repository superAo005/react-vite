import { LoginForm, ProFormText } from '@ant-design/pro-form'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
export default () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values)
  }
  return (
    <div className="h-screen  login-page">
      {/* <LoginForm className="login-form">
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={'用户名: admin or user'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'密码: ant.design'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </LoginForm> */}

      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}>
        <h3 className="title">专家后台管理系统</h3>
        <Form.Item name="login_account" rules={[{ required: true, message: '请输入登录账号' }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="请输入登录账号"
          />
        </Form.Item>
        <Form.Item name="pwd" rules={[{ required: true, message: '请输入登录密码' }]}>
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="请输入登录密码"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button w-full">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
