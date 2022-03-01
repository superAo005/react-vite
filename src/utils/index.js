export function validatorMobile(rule, val, callback) {
  let reg = /^1[0-9]{10}$/
  if (reg.test(val)) {
    callback()
  }
  callback('手机号格式不正确')
}
