import React, { FC } from 'react'
import { Spin } from 'antd'

const SuspendFallbackLoading: FC = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
      }}>
      <Spin tip="加载中..." size="large"></Spin>
    </div>
  )
}

export default SuspendFallbackLoading
