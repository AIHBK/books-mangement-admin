import serviceAxios from './axios.js'

/**
 * 获取用户信息
 * @returns 
 */
export function getUsersData(data) {
  return serviceAxios({
    method: 'get',
    url: `/usersData?type=${data}`
  })
}

/**
 * 删除用户信息
 * @returns 
 */
export function deleteUserData(data) {
  return serviceAxios({
    method: 'delete',
    url: `/deleteUserData/${data}`
  })
}

/**
 * 修改用户信息
 */
export function updataUser(data) {
  return serviceAxios({
    method: 'post',
    url: '/updataUser',
    data: data
  })
}

/**
 * 条件查找用户信息
 * @param {*} data 
 * @returns 
 */
export function searchUser(data) {
  return serviceAxios({
    method: 'post',
    url: '/searchUser',
    data: data
  })
}