import React, { useState } from 'react'
import { Outlet, Link, useMatch, useLocation } from 'react-router-dom'

import { Layout, Menu } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
export default function Index(props) {
  const [collapsed, setCollapsed] = useState(false)

  let uselocation = useLocation()
  const match = useMatch(uselocation.pathname)
  const [defaultSelectedKeys] = useState(uselocation.pathname)

  console.log(uselocation)
  console.log('match', match)
  const toggle = () => {
    setCollapsed(!collapsed)
  }
  return (
    <>
      <Layout className="h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={defaultSelectedKeys}>
            <Menu.Item key="/" icon={<UserOutlined />}>
              <Link to="/">nav 1</Link>
            </Menu.Item>
            <Menu.Item key="/detail" icon={<VideoCameraOutlined />}>
              <Link to="detail">nav 2</Link>
            </Menu.Item>
            <Menu.Item key="/table" icon={<UploadOutlined />}>
              <Link to="table"> table</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle,
            })}
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              minHeight: 280,
            }}>
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}
