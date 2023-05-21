import serviceAxios from './axios.js'

/**
 * 获取图书信息
 * @returns 
 */
export function getBooksData() {
  return serviceAxios({
    method: 'get',
    url: `/booksData`
  })
}

/**
 * 删除图书信息
 * @returns 
 */
export function deleteBooksData(data) {
  return serviceAxios({
    method: 'delete',
    url: `/deleteBooksData/${data}`
  })
}

/**
 * 批量删除图书信息
 * @param {*} data 
 * @returns 
 */
export function batchDeleteBooksData(data) {
  return serviceAxios({
    method: 'delete',
    url: `/batchDeleteBooksData`,
    params: {
      data: data
    }
    // data: data
  })
}

/**
 * 获取个人收藏信息
 * @returns 
 */
export function getFavoriteBooksData(data) {
  return serviceAxios({
    method: 'get',
    url: `/favoriteBooksData?id=${data}`
  })
}

/**
 * 添加收藏
 * @param {*} data 
 * @returns 
 */
export function addFavoriteBooksData(data) {
  return serviceAxios({
    method: 'post',
    url: '/addFavoriteBooksData',
    data: data
  })
}

/**
 * 删除收藏信息
 * @returns 
 */
export function deleteFavoriteBooksData(data) {
  return serviceAxios({
    method: 'delete',
    url: `/deleteFavoriteBooksData/${JSON.stringify(data)}`
  })
}

/**
 * 推荐图书
 * @param {*} data 
 * @returns 
 */
export function addRecommendMessage(data) {
  return serviceAxios({
    method: 'post',
    url: '/addRecommendMessage',
    data: data
  })
}

/**
 * 获取借阅信息
 * @returns 
 */
export function getBooksBorrow(data) {
  // console.log('------------data', data);
  return serviceAxios({
    method: 'get',
    url: `/getBooksBorrow`,
    params: {
      ...data
    }
  })
}

/**
 * 借阅图书
 * @param {*} data 
 * @returns 
 */
export function booksBorrow(data) {
  return serviceAxios({
    method: 'post',
    url: '/booksBorrow',
    data: data
  })
}

/**
 * 归还图书
 * @param {*} data 
 * @returns 
 */
export function returnBooksMessage(data) {
  return serviceAxios({
    method: 'post',
    url: '/returnBooksMessage',
    data: data
  })
}

/**
 * 图书通过归还审核
 * @param {*} data 
 * @returns 
 */
export function passBooksMessage(data) {
  return serviceAxios({
    method: 'post',
    url: '/passBooksMessage',
    data: data
  })
}

/**
 * 删除借阅信息
 * @returns 
 */
export function deleteBooksBorrow(data) {
  return serviceAxios({
    method: 'delete',
    url: `/deleteBooksBorrow/${data}`
  })
}


/**
 * 获取推荐图书信息
 * @returns 
 */
export function getBooksRecommend() {
  return serviceAxios({
    method: 'get',
    url: `/getBooksRecommend`
  })
}

/**
 * 修改图书审核信息
 * @param {*} data 
 * @returns 
 */
export function updataBorrowData(data) {
  return serviceAxios({
    method: 'post',
    url: '/updataBorrowData',
    data: data
  })
}

/**
 * 条件查询图书信息 
 * @param {*} data {}
 * @returns 
 */
export function searchBookData(data) {
  return serviceAxios({
    method: 'post',
    url: '/searchBookData',
    data: data
  })
}

/**
 * 修改图书信息 
 * @param {*} data {}
 * @returns 
 */
export function updatedBookData(data) {
  return serviceAxios({
    method: 'post',
    url: '/updatedBookData',
    data: data
  })
}


/**
 * 支付宝支付接口测试 
 * @param {*} data {}
 * @returns 
 */
export function alipaySdkAPI(data) {
  return serviceAxios({
    method: 'post',
    url: '/alipaySdkAPI',
    data: data
  })
}

/**
 * 获取订单信息
 * @returns 
 */
export function getOrderData(data) {
  return serviceAxios({
    method: 'get',
    url: `/getOrderData`,
    params: {
      ...data
    }
  })
}

/**
 * 添加订单信息
 * @param {*} data {}
 * @returns 
 */
export function addOrderData(data) {
  return serviceAxios({
    method: 'post',
    url: '/addOrderData',
    data: data
  })
}
/**
 * 更新订单信息
 * @param {*} data {}
 * @returns 
 */
export function updataOrder(data) {
  return serviceAxios({
    method: 'post',
    url: '/updataOrder',
    data: data
  })
}


/**
 * 删除订单信息
 * @returns 
 */
export function deleteOrder(data) {
  return serviceAxios({
    method: 'delete',
    url: `/deleteOrder/${data}`
  })
}

/**
 * 条件查询订单信息 
 * @param {*} data {}
 * @returns 
 */
export function searchOrderData(data) {
  return serviceAxios({
    method: 'post',
    url: '/searchOrderData',
    data: data
  })
}

