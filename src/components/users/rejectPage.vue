<template>
  <div style="display: flex;">
    <el-table
      :data="userList"
      stripe
      height="65vh"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55" 
      />
      <el-table-column
        prop="userName"
        label="用户名"
        width="150" 
        />
        <el-table-column
        prop="age"
        label="年龄"
        width="100" 
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.age }} 岁
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="100" 
      >
        <template slot-scope="scope">
          <div v-if="scope.row.sex === 1">男</div>
          <div v-else>女</div>
        </template>
      </el-table-column>
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
        width="210"
      > 
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="reAudit(scope.row)">重新审核</el-button>
          <el-button size="mini" type="danger" @click="deleteUserData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUsersData, updataUser, deleteUserData } from '../../api/user'
// 
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
  },
  methods: {
    /**
     * 重新审核账号
     * @param {*} row 
     */
    async reAudit(row) {
      this.$message({
        type: 'warning',
        message: '请重新审核！'
      })
      await updataUser({
        id: row.id,
        status: 0
      })
      // 重新查询
      this.reFindUserData()
    },
    /**
     * 删除用户信息
     * @param {*} row 
     */
     deleteUserData(row) {
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await deleteUserData(row.id)
          this.reFindUserData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    /**
     * 重查已拒绝用户
     */
    async reFindUserData() {
      const res = await getUsersData(-1)
      this.userList = res.data.result
    }
  }
}
</script>
<style scoped>

</style>