import React from 'react'
import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-layout'

export default () => (
  <DefaultFooter
    copyright="2022 风险管理部出品"
    links={[
      {
        key: 'name',
        title: '超级奥',
        blankTarget: true,
        href: '',
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'http://git.dev.sh.ctripcorp.com/risk/vite-react',
        blankTarget: true,
      },
      {
        key: 'key',
        title: '超级奥',
        blankTarget: true,
        href: '',
      },
    ]}
  />
)
