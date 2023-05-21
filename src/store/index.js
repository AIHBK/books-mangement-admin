import Vue from 'vue'
import Vuex from 'vuex'
import VueXAlong from 'vuex-along'
Vue.use(Vuex)
 
const actions = {
  // test(context,value){
  //   context.commit('userData', value)
  // }
}
const mutations = {
  userData(state, value) {
    state.userData = value
  }
}
// 存储共用变量
const state = {
  userData: {},
}
// 对state中的数据加工
const getters = {
  // 类似于computed
  // test(state) {
  //   return state.num
  // }
}


// 模块化
// const options = {
//   namespaced: true,  // 开启命名空间 mapState等方法才可以识别
//   actions: {},
//   mutations: {},
//   state: {
//      sum: '2'
//   },
//   getters: {}
// }
// 界面使用
// 使用方法一
// mapState(['options'])
// options.sum
// 使用方法二
// mapState('options',['sum'])
// sum
export default new Vuex.Store({
  // modules: {
  //   options
  // },
  actions,
  mutations,
  state,
  getters,
  plugins: [VueXAlong({
    name: 'along',     //存放在localStroage或者sessionStroage 中的名字
    local: false,      //是否存放在local中  false 不存放 如果存放按照下面session的配置配
    session: { list: [], isFilter: true }   
    //如果值不为false 那么可以传递对象 其中 当isFilter设置为true时， list 数组中的值就会被过滤调,这些值不会存放在seesion或者local中
  })]
}) 

