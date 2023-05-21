<template>
  <div>
    
    <!-- 搜索 start -->
    <div class="search-container">
      <el-button size="mini" type="primary" @click="reFindUserData">
        重新查询
        <i class="el-icon-refresh-right"/>
      </el-button>
      <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select">
        <el-select
          v-model="select"
          slot="prepend"
          placeholder="请选择"
          style="width: 120px;"
          @change="handleSelectChange"
        >
          <el-option v-for="item in selectLabelList" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="clickSearch"
        />
      </el-input>
    </div>
    <!-- 搜索 end -->

    <!-- 已通过表格 start -->
    <el-table
      :data="userList"
      stripe
      height="65vh"
      style="width: 100%;"
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
        prop="password"
        label="密码"
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
        width="150"
      > 
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editUserDataDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUserData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 已通过表格 end -->
    <!-- 用户信息dialog start -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialog"
      width="40%"
    >
      <el-form :model="userDataObj" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名:" prop="userName">
          <el-input v-model="userDataObj.userName"></el-input>
        </el-form-item>
        <el-form-item label="旧密码:" prop="password">
          <el-input :placeholder="userDataObj.password" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input v-model="userDataObj.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="confirmPassword">
          <el-input v-model="userDataObj.confirmPassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="所在城市:" prop="city">
          <el-input v-model="userDataObj.city"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="userDataObj.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="userDataObj.phone"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <!-- <el-input :placeholder="userDataObj.status === 1 ? '已通过' : '其他'"></el-input> -->
          <el-select v-model="userStatus" placeholder="请选择">
            <el-option
              v-for="item in userStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色:" prop="roleName">
          <!-- <el-input :placeholder="userDataObj.roleName === 1 ? '超级管理员' : '普通用户'"></el-input> -->
          <el-select v-model="roleNameValue" placeholder="请选择">
            <el-option
              v-for="item in roleNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户信息dialog end -->
  </div>
</template>

<script>
import { getUsersData, deleteUserData, searchUser, updataUser } from '../../api/user'
export default {
  name: 'UserPage',
  components: {
  },

  data() {
    return {
      userStatus: '', // 用户状态选择
      roleNameValue: '', // 角色选择
      userDataObj: {
        newPassword: '', // 新密码
        confirmPassword: '',  // 确认密码
      }, // 表单信息
      editDialog: false, // 用户编辑dialog
      searchCondition: '', // 搜索条件
      selectFlag: false, // 搜索flag
      inputValue: '', // 搜索输入的值
      userList: [], // 用户信息list
      currentPage: this.$route.name,
      select: '', // 搜索分类
      selectLabelList: [ // 搜索标签list
        {
          label: '用户名',
          value: '1'
        },
        {
          label: '手机号',
          value: '2'
        },
        {
          label: '邮箱',
          value: '3'
        },
      ],
      rules: { // 表单验证
        newPassword: [
          { message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { message: '请确认新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
      },
      roleNameList: [ // 角色
        {
          value: '1',
          label: '管理员'
          // disabled: true
        },
        {
          value: '2',
          label: '普通用户'
        }
      ],
      userStatusList: [ // 用户状态
        {
          value: '0',
          label: '待审核',
          disabled: true
        },
        {
          value: '1',
          label: '已通过'
        },
        {
          value: '-1',
          label: '已拒绝',
          disabled: true
        }
      ]
    }
  },
  watch: {
    // 监听输入的值
    inputValue(newVal) {
      if (!newVal) {
        console.log('0000');
        this.reFindUserData()
        return
      }
    }
  },
  async created() {
    this.reFindUserData()
  },
  methods: {
    async onSubmit() {
      // if (!this.userDataObj.newPassword || !this.userDataObj.confirmPassword) {
      //   return this.$message({
      //     type: 'warning',
      //     message: '请填入新密码！'
      //   })
      // }
      if (this.userDataObj.newPassword !== this.userDataObj.confirmPassword) {
        return this.$message({
          type: 'warning',
          message: '两次输入密码不一致，检查密码！'
        })
      }
      this.userDataObj.password = this.userDataObj.confirmPassword
      delete this.userDataObj.newPassword
      delete this.userDataObj.confirmPassword
      // 改变用户状态
      for (const item in this.userStatusList) {
        if (this.userStatusList[item].value === this.userStatus) {
          this.userDataObj.status = Number(this.userStatusList[item].value)
        }
      }
      // 改变用户角色
      for (const item in this.roleNameList) {
        if (this.roleNameList[item].value === this.roleNameValue) {
          this.userDataObj.roleName = Number(this.roleNameList[item].value)
        }
      }
      try {
        const res = await updataUser(this.userDataObj)
        if (res.data.state !== 1) {
          return this.$message({
            type: 'warning',
            message: '修改失败！'
          })
        } 
        this.$message({
          type: 'success',
          message: '修改成功！'
        })
      } catch (error) {
        console.log(error);
        return this.$message({
          type: 'warning',
          message: '修改失败！'
        })
      }
    },

    /**
     * 编辑用户dialog
     * @param {*} row 
     */
    editUserDataDialog(row) {
      if (row.roleName === 1) {
        return this.$message({
          type: 'warning',
          message: '账号为管理员账号，请联系管理员进行删除！'
        });
      }
      this.editDialog = true
      this.userDataObj = row
    },
    /**
     * 改变查询标签
     * @param {*} item 
     */
    handleSelectChange(item) {
      this.searchCondition = item
    },

    /**
     * 条件查询
     */
    async clickSearch() {
      if (!this.searchCondition || !this.inputValue) {
        return this.$message({
          type: 'warning',
          message: '请选择搜索标签或输入搜索内容!'
        })
      }
      
      let res = {} // 查询结果
      // 用户名查询
      if (this.searchCondition === '1') {
        res = await searchUser({
          userName: this.inputValue
        })
      }
      // 手机号查询
      if (this.searchCondition === '2') {
        res = await searchUser({
          phone: this.inputValue
        })
      }
      // 邮件查询
      if (this.searchCondition === '3') {
        res = await searchUser({
          email: this.inputValue
        })
      }
      // for (const item in res.data.result) {
      //   res.data.result[item].edit = 0
      // }
      this.userList = res.data.result
    },

    /**
     * 查询已通过审核用户
     */
    async reFindUserData() {
      try {
        const res = await getUsersData(1)
        // for (const item in res.data.result) {
        //   res.data.result[item].edit = 0
        // }
        this.userList = res.data.result
        // this.$message({
        //   type: 'success',
        //   message: '刷新成功！'
        // })
      } catch (error) {
        this.$message.error('刷新失败!')
        console.log('reFindUserData.error', error);
      }
    },

    /**
     * 删除已通过审核用户
     * @param {*} row 当前行信息
     */
    deleteUserData(row) {
      if (row.roleName === 1) {
        return this.$message({
          type: 'warning',
          message: '账号为管理员账号，请联系管理员进行删除！'
        });
      }
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
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
        });          
      });
    }
  }
}
</script>
<style scoped>
.search-container {
  width: 100%;
  position: relative;
  margin-bottom: 20px;
}
.input-with-select {
  width: 440px;
  position: absolute;
  right: 20px;
}
v-deep .el-dialog__body {
  padding: 30px 40px;
}
</style>