<template>
  <div class="add-user-container">
    <h3>快速添加用户</h3>
    <el-form :model="userDataObj" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名:" prop="userName">
        <el-input v-model="userDataObj.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="userDataObj.password" placeholder="请输入密码" show-password></el-input>
        <!-- :disabled="true" -->
      </el-form-item>
      <el-form-item label="年龄:" prop="age">
        <el-input-number v-model="userDataObj.age" :min="1" :max="100" label="年龄"></el-input-number>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="userDataObj.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所在城市:" prop="city">
        <el-input v-model="userDataObj.city" placeholder="请以xxx-xxx-xxx输入地址"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="userDataObj.email" placeholder="请以输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号:" prop="phone">
        <el-input v-model="userDataObj.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <!-- <el-input :placeholder="userDataObj.status === 1 ? '已通过' : '其他'"></el-input> -->
        <el-select v-model="userStatus" placeholder="请选择状态" style="width: 100%;">
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
        <el-select v-model="roleNameValue" placeholder="请选择角色" style="width: 100%;">
          <el-option
            v-for="item in roleNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button @click="clearFrom">清空</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { regUser } from '../../api/login'
export default {
  name: 'UserPage',
  components: {
  },
  data() {
    return {
      userStatus: '', // 用户状态选择
      roleNameValue: '', // 角色选择
      userDataObj: { // 用户信息
        userName: '',
        password: '',
        city: '',
        email: '',
        phone: '',
        status: '',
        roleName: '',
        sex: 1,
        age: 1
      },
      rules: { // 校验
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
        ],
        age: [
          { required: true, message: "请输入年龄", trigger: "blur" },
        ],
        sex: [
          { required: true, message: "请输入选择性别", trigger: "blur" },
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
          // disabled: true
        },
        {
          value: '1',
          label: '已通过'
        },
        {
          value: '-1',
          label: '已拒绝',
          // disabled: true
        }
      ]
    }
  }, 
  methods: {
    /**
     * 清空from
     */
    clearFrom() {
      this.userDataObj =  { // 用户信息
        userName: '',
        password: '',
        city: '',
        email: '',
        phone: '',
        status: '',
        roleName: '',
      }
      this.userStatus = '' // 用户状态选择
      this.roleNameValue =  '' // 角色选择
    },

    /**
     * 添加新用户
     */
    async onSubmit() {
      if (!this.userDataObj.userName || !this.userDataObj.password || !this.userDataObj.email || !this.userDataObj.phone || !this.userStatus || !this.roleNameValue) {
        return this.$message({
          type: 'warning',
          message: '请完成表格信息！'
        })
      }
      // 男女转换
      if (this.userDataObj.sex === '男') {
        this.userDataObj.sex = 1
      } else {
        this.userDataObj.sex = 0
      }
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
      console.log('----------', this.userDataObj);
      try {
        await regUser(this.userDataObj)
        this.clearFrom()
        return this.$message({
          type: 'success',
          message: '添加成功！'
        })
      } catch (error) {
        console.log('regUser.error', error);
        return this.$message({
          type: 'warning',
          message: '添加失败！'
        })
      }
    },
  },
}
</script>
<style>
.add-user-container {
  width: 45vw;
  margin: 0 auto;

}
</style>