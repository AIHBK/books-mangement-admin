<template>
  <div style="display: flex;">
    <el-aside class="menu-container" width="201px">
      <el-menu
        :default-openeds="['1', '2', '3']" 
        :router="true"
        background-color="#304156"
        text-color="#fff"
        default-active="/home/book"
        >
        <el-submenu v-for="item in menuList" :key="item.id" :index="item.id">
        <template slot="title"><i class="el-icon-message"></i>{{ item.title }}</template>
          <template>
            <div v-for="(childItem, childIndex) in item.childList" :key="childIndex">
              <!-- <div v-if="childItem.roleName && userData.roleName === 1">
                <el-menu-item  :index="`/${childItem.path}`">
                {{ childItem.title }}
              </el-menu-item>
              </div> -->
              
              <el-menu-item :index="`/${childItem.path}`">
                {{ childItem.childTitle }}
              </el-menu-item>

            </div>
          </template>
        </el-submenu>
      </el-menu>
    </el-aside>
    <MainPageVue />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MainPageVue from '../Main/MainPage.vue';
export default {
  name: 'MenuPage',
  components: {
    // MenuPage,
    // HeaderPageVue,
    MainPageVue
  },
  data() {
    return {
      menuList: [ // 菜单信息
        {
          id: '1',
          title: '图书信息管理',
          childList: [
            {
              path: 'home/book',
              childTitle: '图书信息',
            },
            {
              path: 'home/favorite',
              childTitle: '我的收藏',
            }
          ]
        },
        {
          id: '4',
          title: '借阅信息管理',
          childList: [
            {
              path: 'home/borrow',
              childTitle: '借阅记录',
            },
          ]
        },
        {
          id: '5',
          title: '图书推荐管理',
          childList: [
            {
              path: 'home/recommend',
              childTitle: '每日图书推荐',
            },
          ]
        },
        {
          id: '6',
          title: '订单信息管理',
          childList: [
            {
              path: 'home/order',
              childTitle: '订单信息',
            },
          ]
        },
        {
          id: '7',
          title: '个人信息管理',
          childList: [
            {
              path: 'home/personalinfo',
              childTitle: '个人信息',
            }
          ]
        },
        // {
        //   id: '8',
        //   title: '退出系统',
        //   childList: [
        //     {
        //       path: 'home/personalinfo',
        //       childTitle: '个人信息',
        //     }
        //   ]
        // }
      ]
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  created() {
    // this.userData = JSON.parse(localStorage.getItem('userData'))
    this.$router.push({
      path: '/home/book',
    })
    if (this.userData.roleName === 1) {
      this.menuList.splice(1,1)
      this.menuList[0].childList.splice(1,1)
      this.menuList[0].childList.splice(1,0,{
        path: 'home/addbook',
        childTitle: '添加图书信息',
      })
      this.menuList.splice(1,0,
      {
        id: '2',
        title: '用户信息管理',
        childList: [
          {
            path: 'home/audit',
            childTitle: '待审核',
            roleName: 1
          },
          {
            path: 'home/passed',
            childTitle: '已通过',
            roleName: 1
          },
          {
            path: 'home/reject',
            childTitle: '已拒绝',
            roleName: 1
          },
          {
            path: 'home/adduser',
            childTitle: '新增用户',
          }
        ]
      })
      this.menuList[2] = {
        id: '3',
        title: '图书借阅管理',
        childList: [
          {
            path: 'home/borrowAudit',
            childTitle: '待审核',
            roleName: 1
          },
          {
            path: 'home/borrowPass',
            childTitle: '已通过',
            roleName: 1
          },
          {
            path: 'home/borrowReject',
            childTitle: '已拒绝',
            roleName: 1
          },
          // {
          //   path: 'home/adduser',
          //   childTitle: '所有借阅信息',
          // }
        ]
      }
      
    }
  },
  methods: {
  },
}
</script>
<style scoped>
.menu-container .el-menu {
  width: 200px;
  height: calc(100vh - 60px);
}
</style>