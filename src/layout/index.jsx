import React, { useState, useEffect } from 'react'
import { Outlet, Link, useMatch, useLocation, useNavigate } from 'react-router-dom'

import { Layout, Menu } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
const { SubMenu } = Menu

const { Header, Sider, Content } = Layout
export default function Index(props) {
  const [collapsed, setCollapsed] = useState(false)

  let uselocation = useLocation()
  const navigate = useNavigate()

  const match = useMatch(uselocation.pathname)
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(uselocation.pathname)

  console.log(uselocation)
  console.log('match', match)
  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const onItemClick = ({ item, key, keyPath }) => {
    console.log('item', item)
    navigate(key)
  }

  useEffect(() => {
    console.log(111, uselocation.pathname)
    setDefaultSelectedKeys(uselocation.pathname)
  }, [location.href])
  return (
    <>
      <Layout className="h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={defaultSelectedKeys}
            selectedKeys={defaultSelectedKeys}
            onClick={onItemClick}>
            <Menu.Item key="/" icon={<UserOutlined />}>
              {/* <Link to="/">nav 1</Link> */}
              nav 1
            </Menu.Item>
            <Menu.Item key="/detail" icon={<VideoCameraOutlined />}>
              {/* <Link to="detail">nav 2</Link> */}
              nav 2
            </Menu.Item>
            <Menu.Item key="/table" icon={<UploadOutlined />}>
              <Link to="table"> table</Link>
            </Menu.Item>

            <Menu.Item key="/template" icon={<UploadOutlined />}>
              <Link to="template"> template</Link>
            </Menu.Item>

            <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
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
