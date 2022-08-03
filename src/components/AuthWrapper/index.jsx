import React from 'react'

import { useSelector } from 'react-redux'
//判断是否有页面按钮操作权限
const isCanOption = (userRoles, pageRole) => {
  if (typeof pageRole === 'string') {
    return userRoles.includes(pageRole)
  }
  const pagerole = pageRole.length > 0 ? pageRole.join(',') : ''
  const roles = userRoles.filter((item) => {
    return pagerole.indexOf(item) > -1
  })
  return roles.length > 0
}
export default function Index(props) {
  const { auth, children, workDomainAuth = true } = props
  const roles = useSelector((state) => state?.user?.info?.perm_identity_list)

  return <>{workDomainAuth && isCanOption(roles, auth) ? children : null}</>
}
