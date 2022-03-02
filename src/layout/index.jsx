import React, { useState, useEffect } from 'react'
import { Outlet, Link, useMatch, useLocation, useNavigate, Navigate } from 'react-router-dom'

import { Layout, Menu, Dropdown, Modal } from 'antd'

const { SubMenu } = Menu
import Icon, {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  DownOutlined,
  AppstoreOutlined,
  SearchOutlined,
  KeyOutlined,
} from '@ant-design/icons'
// const { SubMenu } = Menu

const { Header, Sider, Content } = Layout
export default function Index(props) {
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
  const account = localStorage.getItem('account') || '未知用户'
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

  const showMenu = (needRoles) => {
    const allRoles = JSON.parse(localStorage.getItem('roleList'))
    let intersectionRoles = needRoles.filter(function (val) {
      return allRoles.indexOf(val) > -1
    })
    return intersectionRoles.length > 0
  }

  // 菜单渲染
  const getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      if (this.filterMenuItem(item)) {
        if (!item.children) {
          pre.push(
            <Menu.Item key={item.path}>
              <Link to={item.path}>
                {item.icon ? <Icon type={item.icon} /> : null}
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find((cItem) => path.indexOf(cItem.path) === 0)
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.setState((state) => ({
              openKey: [...state.openKey, item.path],
            }))
          }

          // 向pre添加<SubMenu>
          pre.push(
            <SubMenu
              key={item.path}
              title={
                <span>
                  {item.icon ? <Icon type={item.icon} /> : null}
                  <span>{item.title}</span>
                </span>
              }>
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      }

      return pre
    }, [])
  }
  const menu = (
    <Menu onClick={onClick}>
      {/* <Menu.Item key="0">
        <a href="https://www.antgroup.com">1st menu item</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="https://www.aliyun.com">2nd menu item</a>
      </Menu.Item> */}
      <Menu.Divider />
      <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
  )
  return (
    <>
      <Layout className="h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">专家抽取系统</div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={defaultSelectedKeys}
            selectedKeys={defaultSelectedKeys}
            onClick={onItemClick}>
            {/* <Menu.Item key="/" icon={<VideoCameraOutlined />}>
              nav 1
            </Menu.Item> */}

            {showMenu(['0001ec6b8d534e8eb075fb6a0a590001']) && (
              <Menu.Item key="/user" icon={<UsergroupAddOutlined />}>
                用户管理
              </Menu.Item>
            )}
            {showMenu(['0001ec6b8d534e8eb075fb6a0a590001']) && (
              <Menu.Item key="/role" icon={<KeyOutlined />}>
                角色管理
              </Menu.Item>
            )}

            {showMenu(['0001ec6b8d534e8eb075fb6a0a590001', '0002fc9b8d534e8eb075eb6a0a590002']) && (
              <Menu.Item key="/expert" icon={<UserOutlined />}>
                专家管理
              </Menu.Item>
            )}

            {showMenu(['0001ec6b8d534e8eb075fb6a0a590001', '0002fc9b8d534e8eb075eb6a0a590002']) && (
              <Menu.Item key="/extract" icon={<SearchOutlined />}>
                专家抽取
              </Menu.Item>
            )}
            {showMenu([
              '0001ec6b8d534e8eb075fb6a0a590001',
              '0002fc9b8d534e8eb075eb6a0a590002',
              '0003dd6b8d534e8eb075fb6a0a590003',
            ]) && (
              <Menu.Item key="/statistic" icon={<AppstoreOutlined />}>
                抽取统计
              </Menu.Item>
            )}

            {/* <Menu.Item key="/table" icon={<UploadOutlined />}>
              <Link to="table"> table</Link>
            </Menu.Item>

            <Menu.Item key="/template" icon={<UploadOutlined />}>
              <Link to="template"> template</Link>
            </Menu.Item> */}
            {/* 
            <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu> */}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle,
            })} */}

            <div className="right-menu float-right mr-6">
              <Dropdown overlay={menu} trigger={['hover']}>
                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                  {account}
                  <DownOutlined />
                </a>
              </Dropdown>
            </div>
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
