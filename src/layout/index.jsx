import React, { useState, useEffect } from 'react'
import {
  Outlet,
  Link,
  useMatch,
  useLocation,
  useNavigate,
  Navigate,
  matchRoutes,
} from 'react-router-dom'
import iconMap from './iconMap'

import { Layout, Menu, Dropdown, Modal } from 'antd'

const { SubMenu } = Menu
import { DownOutlined } from '@ant-design/icons'

import { useSelector } from 'react-redux'

import ScrollBar from '@/components/ScrollBar'
import { filterMenuRoutes } from '@/utils'

import { routeList } from '@/routers'
const { Header, Sider, Content } = Layout
export default function Index() {
  const [collapsed, setCollapsed] = useState(false)

  let uselocation = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  if (!token) {
    navigate('/login')
    return <Navigate to="/login" replace />
  }
  const match = useMatch(uselocation.pathname)
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(uselocation.pathname)

  const routes = matchRoutes(routeList, uselocation.pathname) // 返回匹配到的路由数组对象，每一个对象都是一个路由对象
  // console.log('matchRoutes', routes)
  const pathArr = []
  if (routes !== null) {
    routes.forEach((item) => {
      const path = item.pathname
      if (path) {
        pathArr.push(path)
      }
    })
  }
  const [defaultOpenKeys, setDefaultOpenKeys] = useState(pathArr)

  const account = localStorage.getItem('account') || '未知用户'
  // console.log(uselocation)
  console.log('match', match)

  const roles = useSelector((state) => state?.user?.info?.roles)
  const filetRouteList = filterMenuRoutes(roles, routeList)

  // 侧边栏菜单，约定只取数组第一项
  const sideMenuList = filetRouteList[0].children
  // console.log('rolesfiletRouteList', filetRouteList)
  // console.log('sideMenuList', sideMenuList)
  // const toggle = () => {
  //   setCollapsed(!collapsed)
  // }

  // const onItemClick = ({ item, key, keyPath }) => {
  //   console.log('onItemClick', item)
  //   navigate(key)
  // }

  useEffect(() => {
    console.log('uselocation.pathname', uselocation.pathname)
    const routes = matchRoutes(routeList, uselocation.pathname) // 返回匹配到的路由数组对象，每一个对象都是一个路由对象
    // console.log('matchRoutes', routes)
    const pathArr = []
    if (routes !== null) {
      routes.forEach((item) => {
        const path = item.pathname
        if (path) {
          pathArr.push(path)
        }
      })
    }
    console.log('pathArr', pathArr)
    setDefaultOpenKeys(pathArr)
    setDefaultSelectedKeys(uselocation.pathname)
  }, [location.href])
  const onClick = ({ key }) => {
    switch (key) {
      case 'logout':
        // TODO: 退出登录
        handleLogout()
        break
      default:
        break
    }
  }
  const handleLogout = (token) => {
    Modal.confirm({
      title: '注销',
      content: '确定要退出系统吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // logout(token);
        navigate('login')
      },
    })
  }

  // 菜单渲染
  const getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    return menuList.reduce((pre, item) => {
      if (item?.title) {
        if (!item.children) {
          pre.push(
            <Menu.Item key={item.path} icon={iconMap[item?.icon || 'user']}>
              <Link to={item.path}>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        } else {
          // 向pre添加<SubMenu>
          pre.push(
            <SubMenu
              key={item.path}
              icon={iconMap[item?.icon || 'user']}
              title={<span>{item.title}</span>}>
              {getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }

      return pre
    }, [])
  }
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Divider />
      <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
  )
  return (
    <>
      <Layout className="h-screen layout">
        <Header className="header h-14">
          <div className="logo">作品库管理系统</div>
          <div className="center"></div>
          <div className="right-menu float-right mr-6">
            <Dropdown overlay={menu} trigger={['hover']}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                {account}
                <DownOutlined className="ml-1" />
              </a>
            </Dropdown>
          </div>
        </Header>
        <Layout className="site-layout-background">
          <Sider
            // trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            className="side overflow-auto site-layout-background">
            <ScrollBar
              options={{
                suppressScrollX: true,
              }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={defaultSelectedKeys}
                selectedKeys={defaultSelectedKeys}
                defaultOpenKeys={defaultOpenKeys}
              >
                {getMenuNodes(sideMenuList)}
              </Menu>
            </ScrollBar>
          </Sider>

          <Content id="content" className="p-6 relative">
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}