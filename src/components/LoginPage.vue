<template>
    <div class="login-container">
      <div class="top-title-container">
        <h4>登陆图书管理系统</h4>
      </div>
      <div class="login-left-container">
        <div class="left-item-container">
          <div class="item-name-container">账号</div>
          <el-input
            v-model="loginObj.loginFrom.phone"
            class="item-input-container"
            type="text"
            placeholder="请输入手机号"
          />
        </div>
        <div class="left-item-container">
          <div class="item-name-container">密码</div>
          <el-input
            v-model="loginObj.loginFrom.password"
            class="item-input-container"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </div>
        <div class="login-bottom-container">
          <el-button type="primary" class="login-btn-container" @click="loginClickBtn">登陆</el-button>
          <!-- <el-button>注册</el-button> -->
        </div>
        <div class="reg-bottom-container">
          <!-- <el-button>立即注册</el-button> -->
          <div class="reg-btn-container" @click="loginObj.registerDialog = true">立即注册</div>
        </div>
      </div>
      <!-- <div class="login-right-container"></div> -->
      <el-dialog
        title="立即注册"
        :visible.sync="loginObj.registerDialog"
        width="40%"
      >
        <el-form 
          :model="loginObj.registerFrom"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="姓名:" prop="userName">
            <el-input
              v-model="loginObj.registerFrom.userName"
              class="register-input-container"
              placeholder="请输入姓名"
            />
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
              v-model="loginObj.registerFrom.password"
              class="register-input-container"
              placeholder="请输入密码"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码:" prop="confirmPassword">
            <el-input
              v-model="loginObj.registerFrom.confirmPassword"
              class="register-input-container"
              placeholder="确认密码"
              type="password"
              show-password
            />
          </el-form-item>

          <el-form-item label="年龄:" prop="age">
            <el-input-number v-model="loginObj.registerFrom.age" :min="1" :max="100" label="年龄"></el-input-number>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="loginObj.registerFrom.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="手机号:" prop="phone">
            <el-input 
              v-model="loginObj.registerFrom.phone"
              class="register-input-container"
              placeholder="请输入手机号" 
            />
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input 
              v-model="loginObj.registerFrom.email"
              class="register-input-container"
              placeholder="请输入邮箱"
              />
          </el-form-item>
          <el-form-item label="地址:" prop="city">
            <v-distpicker 
              province="北京市"
              city="北京市"
              @change="onSelected"
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="loginObj.registerDialog = false">取 消</el-button>
          <el-button type="primary" @click="regUserClickBtn">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    
</template>

<script>
import { login, regUser } from '../api/login'
import VDistpicker from 'v-distpicker'
export default {
  components: {
    VDistpicker
  },
  data() {
    return {
      loginObj: {
        registerDialog: false, // 注册dialog显示与否
        registerFrom: { // 注册所需数据
          userName: '',
          password: '',
          confirmPassword: '',
          email: '',
          phone: '',
          userCode: '',
          roleName: '2',
          createDate: '',
          city: '',
          sex: 1,
          age: 1
        },
        loginFrom: { // 登陆数据
          phone: '',
          password: ''
        }
      },
      rules: {
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
      location: ''
    }
  },
  methods: {
    onSelected(data) {
      this.location = `${data.province.value} ${data.city.value} ${data.area.value}`
    },
    /**
     * 用户注册
     */
    async regUserClickBtn() {
      if (!this.loginObj.registerFrom.userName || !this.loginObj.registerFrom.password || !this.loginObj.registerFrom.email ||!this.loginObj.registerFrom.phone) {
        return this.$message({
          message: '请检查是否填写完整?',
          type: 'warning'
        })
      }
      if (this.loginObj.registerFrom.password !== this.loginObj.registerFrom.confirmPassword) {
        return this.$message({
          message: '两次密码输入不一致, 请重新输入！',
          type: 'warning'
        })
      }
      // 男女转换
      if (this.loginObj.registerFrom.sex === '男') {
        this.loginObj.registerFrom.sex = 1
      } else {
        this.loginObj.registerFrom.sex = 0
      }

      if (this.location !== '省 市 区') {
        this.loginObj.registerFrom.city = this.location
      }
      delete this.loginObj.registerFrom.confirmPassword
      const res = await regUser(this.loginObj.registerFrom)
      if (res.data.state === 3) {
        this.$message.error('手机号已注册，请更换手机号！')
      }
      if (res.data.state === 1) {
        this.$message({
          message: '注册成功！',
          type: 'success'
        })
        this.loginObj.registerDialog = false
      }
    },
    /**
     * 用户登陆
     */
    async loginClickBtn() {
      if (!this.loginObj.loginFrom.phone || !this.loginObj.loginFrom.password) {
        this.$message({
          message: '账号或密码不能为空！',
          type: 'warning'
        })
        return
      }
      try {
        const res = await login(this.loginObj.loginFrom)
        console.log('---------', res)
        if (res.data.list.length <= 0) {
          this.$message({
            message: '该账号需要管理员审核或密码错误!',
            type: 'warning'
          })
          return
        }
        if (res.data.state === 3 && res.data.msg === 'null') {
          this.$message({
            message: '用户不存在！',
            type: 'warning'
          })
        } else {
          // localStorage.setItem('userData', JSON.stringify(res.data.list[0]))
          this.$store.commit('userData', res.data.list[0])
          
          this.$router.push({
            path: '/home'
            // query: {
            //   loginData: res.data.list[0].userName
            // }
          })
          console.log('success')
        }
      } catch {
        this.$message.error('服务器在打瞌睡~~~')
      }
    }
  }
}

</script>

<style scoped>
.login-container {
  width: 700px;
  height: 500px;
  margin: 100px auto;
  border: 1px solid #c0c0c0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  position: relative;
}
.top-title-container {
  margin-top: 50px;
}
.login-left-container {
  width: 350px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 60%;
  margin-top: -190px;
}
.left-item-container {
  width: 350px;
  margin: 10px 0;
  display: flex;
  justify-content: space-around;
}
.item-name-container {
  width: 50px;
  display: inline-block;
  vertical-align: middle;
  line-height: 40px;
}
.login-bottom-container {
  width: 350px;
  display: flex;
  justify-content: flex-end;
}
.login-btn-container {
  width: 308px;
}
.reg-bottom-container {
  width: 350px;
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
  color: #929292;
}
.register-input-container {
  width: 390px;
}
/* ::v-deep .item-input-container .el-input__inner {
  width: 250px;
  height: 30px;
  vertical-align: middle;
} */

.reg-btn-container {
  cursor: pointer
}
</style>
