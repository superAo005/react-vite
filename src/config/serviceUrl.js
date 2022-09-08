import { getEnv, isServer } from '@/util'
//获取接口请求地址
export const getFetchUrl = (env, url) => {
  let fatEnv = ''
  try {
    if (!isServer) {
      const href = window.location.href
      //const href='window'
      const fat = href.match(/front\.risk\.(\w+)\.qa\.nt\.ctripcorp\.com/)
      if (fat && fat.length > 1) {
        fatEnv = fat[1]
      }
    }
  } catch (e) {
    console.warn(e)
  }

  let domain = {
    dev: `http://configs.background.${fatEnv || 'fat78'}.qa.nt.ctripcorp.com`,
    fat: `http://configs.background.${fatEnv || 'fat78'}.qa.nt.ctripcorp.com`,
    uat: 'http://configs.background.uat.qa.nt.ctripcorp.com',
    pro: 'http://configs.background.risk.ctripcorp.com',
  }

  if (/^bw\//.test(url)) {
    // console.log('bw--------------------------')
    domain = {
      dev: `http://configs.background.${fatEnv || 'fat78'}.qa.nt.ctripcorp.com`,
      fat: `http://configs.background.${fatEnv || 'fat254'}.qa.nt.ctripcorp.com`,
      uat: 'http://configs.background.uat.qa.nt.ctripcorp.com',
      pro: 'http://configs.background.risk.ctripcorp.com',
    }
  } else if (/^(configs|model|variables)/.test(url)) {
    domain = {
      dev: `http://configs.background.${fatEnv || 'fat254'}.qa.nt.ctripcorp.com`,
      fat: `http://configs.background.${fatEnv || 'fat254'}.qa.nt.ctripcorp.com`,
      uat: 'http://configs.background.uat.qa.nt.ctripcorp.com',
      pro: 'http://configs.background.risk.ctripcorp.com',
    }
  } else if (/^(source|tag|sink|schema)/.test(url)) {
    console.log('source---^(source|tag|sink)-----------------------')
    domain = {
      dev: `http://keyuserprofile.risk.ctripcorp.com`,
      // fat: `http://key.userprofile.web.fat78.qa.nt.ctripcorp.com`,
      fat: `http://keyuserprofile.risk.ctripcorp.com`,
      uat: 'http://key.userprofile.web.uat.qa.nt.ctripcorp.com',
      pro: 'http://keyuserprofile.risk.ctripcorp.com',
    }
  } else if (/^health/.test(url)) {
    domain = {
      dev: `http://strategy.health.fat78.qa.nt.ctripcorp.com`,
      fat: `http://strategy.health.fat78.qa.nt.ctripcorp.com`,
      uat: 'http://strategy.health.risk.ctripcorp.com',
      pro: 'http://strategy.health.risk.ctripcorp.com',
    }
  } else if (/^(nse)/.test(url)) {
    domain = {
      dev: `http://nseconfig.backend.fat254.qa.nt.ctripcorp.com`,
      // dev: `http://10.32.83.125:8080`,// 王子千
      fat: `http://nseconfig.backend.fat254.qa.nt.ctripcorp.com`,
      uat: 'http://nseconfig.backend.risk.ctripcorp.com',
      pro: 'http://nseconfig.backend.risk.ctripcorp.com',
    }
  }
  return `${domain[env]}/${url}`
}
//获取新版决策引擎的接口地址
export const getNSEFetchUrl = (env, url) => {
  let fatEnv = ''
  if (!isServer) {
    const href = window.location.href
    //const href='window'
    const fat = href.match(/front\.risk\.(\w+)\.qa\.nt\.ctripcorp\.com/)
    if (fat && fat.length > 1) {
      fatEnv = fat[1]
    }
  }
  let domain = {
    //dev: `http:///10.32.83.125:8080`,
    dev: `http://nseconfig.backend.${fatEnv || 'fat254'}.qa.nt.ctripcorp.com`,
    fat: `http://nseconfig.backend.${fatEnv || 'fat254'}.qa.nt.ctripcorp.com`,
    uat: 'http://nseconfig.backend.uat.qa.nt.ctripcorp.com',
    pro: 'http://nseconfig.backend.ctripcorp.com',
  }
  return `${domain[env]}/${url}`
}
export const getLoginUrl = (env, backurl) => {
  const loginUrl = {
    dev: `https://cas.fat358.qa.nt.ctripcorp.com/caso/login.html`,
    fat: 'https://cas.fat358.qa.nt.ctripcorp.com/caso/login.html',
    uat: 'https://cas.uat.qa.nt.ctripcorp.com/caso/login.html',
    pro: 'https://cas.ctripcorp.com/caso/login.html',
  }
  return `${loginUrl[env]}?service=${backurl}`
}

