import Vue from "vue"
import Router from 'vue-router'
import LoginPage from '../components/LoginPage'
import HomePage from '../components/HomePage'
Vue.use(Router) 

export default new Router({
  routes:[
    { // 登陆
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    { // 重定向
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage,
      children: [
        {
          path: 'book',
          name: 'HookPage',
          component: () => import('../components/books/bookPage.vue')
        },
        {
          path: 'passed',
          name: 'passedPage',
          component: () => import('../components/users/passedPage.vue')
        },
        {
          path: 'audit',
          name: 'auditPage',
          component: () => import('../components/users/auditPage.vue')
        },
        {
          path: 'reject',
          name: 'rejectPage',
          component: () => import('../components/users/rejectPage.vue')
        },
        {
          path: 'personalinfo',
          name: 'personalInfoPage',
          component: () => import('../components/users/personalInfoPage.vue')
        },
        {
          path: 'adduser',
          name: 'addUser',
          component: () => import('../components/users/addUserPage.vue')
        },
        {
          path: 'favorite',
          name: 'favorite',
          component: () => import('../components/books/favoritePage.vue')
        },
        {
          path: 'borrow',
          name: 'borrow',
          component: () => import('../components/books/borrowPage.vue')
        },
        {
          path: 'recommend',
          name: 'recommend',
          component: () => import('../components/books/recommendPage.vue')
        },
        {
          path: 'borrowPass',
          name: 'borrowPass',
          component: () => import('../components/books/borrowPassPage.vue')
        },
        {
          path: 'borrowReject',
          name: 'borrowReject',
          component: () => import('../components/books/borrowRejectPage.vue')
        },
        {
          path: 'borrowAudit',
          name: 'borrowAudit',
          component: () => import('../components/books/borrowAuditPage.vue')
        },
        {
          path: 'addbook',
          name: 'addbook',
          component: () => import('../components/books/addBookPage.vue')
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('../components/books/orderPage.vue')
        },

      ]
    }
  ]
})
