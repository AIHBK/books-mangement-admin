import serviceAxios from './axios.js'

/**
 * 用户登陆接口
 * @param {*} data 账号 密码
 * @returns 
 */ 
export function login(data) {
  return serviceAxios({
    method: 'post',
    url: '/login',
    data: data
  })
}
/**
 * 用户注册接口
 * @param {*} data 用户名 密码 手机号 邮箱  
 * @returns 
 */
export function regUser(data) {
  return serviceAxios({
    method: 'post',
    url: '/regUser',
    data: data
  })
}