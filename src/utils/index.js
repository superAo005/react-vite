export function validatorMobile(rule, val, callback) {
  let reg = /^1[0-9]{10}$/
  if (reg.test(val)) {
    callback()
  }
  callback('手机号格式不正确')
}
export function validatorEmail(rule, val, callback) {
  let reg = /[\d\w]+\b@[a-zA-ZA-z0-9]+\.[a-z]+/g
  if (reg.test(val)) {
    callback()
  }
  callback('邮箱格式不正确')
}
