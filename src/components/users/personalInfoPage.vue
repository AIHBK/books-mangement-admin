<template>
  <div class="user-data-container">
    <h3 style="margin: 0 0 20px 0">个人信息修改</h3>
    <el-form :model="userDataObj" :rules="rules" label-width="100px" size="small" class="demo-ruleForm">
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
      <el-form-item label="年龄:" prop="age">
        <el-input-number v-model="userDataObj.age" :min="1" :max="100" label="年龄"></el-input-number>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="userDataObj.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
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
        <el-input :placeholder="userDataObj.status === 1 ? '已通过' : '其他'" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="角色:" prop="roleName">
        <el-input :placeholder="userDataObj.roleName === 1 ? '超级管理员' : '普通用户'" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button type="primary" @click="onSubmit">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updataUser } from '../../api/user'
import { mapState } from 'vuex'
export default {
  name: 'UserPage',
  components: {
  },

  data() {
    return {
      userDataObj: {}, 
      rules: { // 表单验证
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
  },
  computed: {
    ...mapState(['userData'])
  },
  async created() {
    
    this.userDataObj = {
      newPassword: '', // 新密码
      confirmPassword: '',  // 确认密码
      ...this.userData
    } 
  },
  methods: {
    async onSubmit() {
      console.log('------------userDataObj', this.userDataObj);
      if (this.userDataObj.sex === '女') {
        this.userDataObj.sex = 0
      } else {
        this.userDataObj.sex = 1
      }
      if (!this.userDataObj.newPassword || !this.userDataObj.confirmPassword) {
        return this.$message({
          type: 'warning',
          message: '密码不能为空！'
        })
      }
      if (this.userDataObj.newPassword !== this.userDataObj.confirmPassword) {
        return this.$message({
          type: 'warning',
          message: '两次输入密码不一致，检查密码！'
        })
      }
      this.userDataObj.password = this.userDataObj.confirmPassword
      delete this.userDataObj.newPassword
      delete this.userDataObj.confirmPassword
      delete this.userDataObj.roleName
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
          message: '修改成功,请重新登陆！'
        })
        this.$router.push({
            path: '/'
          })
      } catch (error) {
        console.log(error);
        return this.$message({
          type: 'warning',
          message: '修改失败！'
        })
      }
    }
  }
}
</script>
<style scoped>
.user-data-container {
  width: 40vw;
  position: absolute;
  left: 50%;
  margin-left: -20vw;
}
</style>