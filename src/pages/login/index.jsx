import { useState } from 'react'

import { Form, Input, Button, Tabs } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '@/services/user'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setInfo } from '@/store/stateSlice/userSlice'

export default () => {
  const [loginType, setLoginType] = useState('0')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    console.log('Received values of form: ', values, loginType)

    const { res, data: data } = await login({
      ...values,
      type: +loginType,
    })
    console.log({ res, data })
    // if (res != 1) return
    // const data = {
    //   cellphone_number: '18888888888',
    //   login_account: 'superadmin',
    //   real_name: '管理员',
    //   roles: [
    //     'user:query',
    //     'role:query',
    //     'video:query',
    //     'category:query',
    //     'laws:regulations:query',
    //     'slide:show:query',
    //   ],
    //   token:
    //     'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJobmJjLmNvbSIsInN1YiI6IjE4ODg4ODg4ODg4IiwiaWF0IjoxNjQ1OTM4ODMxLCJhdWQiOiIxODg4ODg4ODg4OCIsImV4cCI6MTY0NTk1NjgzMSwiWFVJRCI6IjMyNGNjZTA1ZGY2MTQwN2M5MGRmZjEyZmQ1OGEwNTgxIn0.OxVEY8aWM9AbcYq90V6mkMlAoCErZTtdUrcIkRv9ssY',
    //   role_id: '0001ec6b8d534e8eb075fb6a0a590001',
    // }
    const roles = data.perm_identity_list
    dispatch(
      setInfo({
        ...data,
        roles,
      })
    )
    const roleList = [data?.role_id] || []
    localStorage.setItem('userInfo', JSON.stringify(data))
    localStorage.setItem('token', data?.token)
    localStorage.setItem('account', data?.login_account)
    localStorage.setItem('roleList', JSON.stringify([data?.role_id]))

    if (roles.includes('user')) {
      navigate('/user')
    } else if (roleList.includes('video')) {
      navigate('/video')
    } else {
      navigate('/')
    }
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
        <h3 className="title">作品库管理系统</h3>

        <Tabs
          className="m-auto"
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey)}>
          <Tabs.TabPane key={1} tab={'账号密码登录'} />
          <Tabs.TabPane key={0} tab={'手机号登录'} />
        </Tabs>

        {loginType == 1 && (
          <>
            <Form.Item name="account" rules={[{ required: true, message: '请输入登录账号' }]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入登录账号"
              />
            </Form.Item>
          </>
        )}
        {loginType == 0 && (
          <>
            <Form.Item name="mobile" rules={[{ required: true, message: '请输入手机号' }]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入手机号"
              />
            </Form.Item>
          </>
        )}

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
