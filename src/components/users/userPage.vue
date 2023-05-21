<template>
  <div style="display: flex;">
    <el-table
      :data="userList"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55" 
      />
      <el-table-column
        prop="userName"
        label="用户名"
        width="180" 
      />
      <el-table-column
        prop="city"
        label="位置"
        width="180" 
      >
        <template slot-scope="scope">
          <span v-if="scope.row.city">{{ scope.row.city }}</span>
          <span v-else>暂无信息</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
      />
      <el-table-column
        prop="email"
        label="邮箱"
      />
      <el-table-column
        prop="roleName"
        label="用户角色"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.roleName === 1">超级管理员</span>
          <span v-else>普通用户</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">已通过</span>
          <span v-else-if ="scope.row.status === 0">待审核</span>
          <span v-else>已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
      />
      <el-table-column
        label="操作"
      > 
        <el-button size="mini" type="primary">编辑</el-button>
        <el-button size="mini" type="danger">删除</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUsersData } from '../../api/user'
export default {
  name: 'UserPage',
  components: {
  },

  data() {
    return {
      userList: [], // 用户信息list
      currentPage: this.$route.name,
    }
  },
  watch: {
  },
  async created() {
    this.reFindUserData()
    console.log('----this.route', this.$route);
  },
  methods: {
    async reFindUserData() {
      let type = ''
      if (this.$route.name === 'passedPage') {
        type = '1'
      } else if (this.$route.name === 'auditPage') {
        type = '0'
      } else if (this.$route.name === 'rejectPage') {
        type = '-1'
      } else {
        type = '1'
      }
      const res = await getUsersData(type)
      this.userList = res.data.result
      }
  }
}
</script>
<style scoped>

</style>