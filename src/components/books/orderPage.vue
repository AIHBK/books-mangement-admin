<template>
  <div>
    <el-button type="primary" size="mini" @click="reFindOrderData">重新查询</el-button>
    <!-- 搜索 start -->
    <div class="search-container">
      <el-input placeholder="请输入内容" v-model="searchValue" clearable class="input-with-select">
        <el-select
          v-model="selectValue"
          clearable
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
          @click="searchOrder"
        />
      </el-input>
    </div>
    <!-- 搜索 end -->
    <div style="display: flex; flex-wrap: wrap; overflow-x: hidden; height: 600px;">
      <div v-for="item in orderList" :key="item.id" style="margin: 20px 40px;">
        <el-card class="box-card" style="padding: 3px;">
          <div style="padding: 3px;">
            <img :src="item.url" width="80px" height="100px" alt="加载失败">
            <div style="display: inline-block;width: 60%;height: 100px;vertical-align: top;margin-left: 15px;position: relative;">
              <h3>无名图书</h3>
              <div style="margin: 5px; font-size: 14px;">
                <span>{{ item.bookName }}</span><span style="position: absolute;right: 5px; font-weight:600;">￥{{ item.price }}</span>
              </div>
              <div style="margin: 5px; font-size: 13px;color: #c0c0c0;">
                <span>{{ item.classification}};</span>
                <!-- <span>{{ item.author}};</span> -->
                <span style="margin-left: 50px;position: absolute;right: 5px;">X {{ item.bookNumber }}</span>
              </div>
              <div style="margin: 5px; font-size: 13px;color: #c0c0c0;">
                <span>作者</span>
                <span style="margin-left: 50px;position: absolute;right: 5px;">{{ item.author }}</span>
              </div>
            </div>
          </div>
          <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
            <span>付款人</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;">{{ item.userName }}</span>
          </div>
          <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
            <span>商品总价</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;font-weight:600;">￥{{ item.totalPrice }}</span>
          </div>
          <div style="height: 30px;margin: 10px 0;padding: 0 3px; position: relative;border-bottom: 1px solid #c0c0c0">
            <span style="font-size:13px;">需实付款</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;font-weight:600;color: #ff6700;">￥{{ item.totalPrice }}</span>
          </div>
          <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
            <span>购买原因</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;">{{ item.content }}</span>
          </div>
          <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
            <span>订单编号</span>
            <span style="margin-left: 50px;position: absolute;color: #c0c0c0;">{{ item.id }}</span>
          </div>
          <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
            <span>支付状态</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;color: #F56C6C;" v-if="item.status === 0">未付款</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;color: #67C23A;" v-else>已支付</span>
          </div>
          <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
            <span>支付方式</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;" v-if="item.paymentMode === 0">支付宝</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;" v-else>其他支付方式</span>
          </div>
          <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
            <span>创建时间</span>
            <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;">{{ item.createDate }}</span>
          </div>
          <el-button v-if="roleName === 1" type="danger" size="mini" class="del-button" @click="deleteOrder(item)">删除</el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate  } from '../../util/index'
import {  getOrderData, deleteOrder, searchOrderData } from '../../api/book'
import { mapState } from 'vuex'
export default {
  name: 'borrowPage',
  data() {
    return {
      selectLabelList: [ // 搜索标签list
        {
          label: '书名',
          value: 'bookName'
        },
        {
          label: '作者',
          value: 'author'
        },
        {
          label: '付款人',
          value: 'userName'
        },
        {
          label: '订单编号',
          value: 'id'
        },
        {
          label: '支付状态',
          value: 'status'
        },
      ],
      searchValue: '', // 搜索输入的值
      selectValue: '', // 搜索分类
      orderList: [], // 订单list
      userid: '', // 用户id
      roleName: '', // 用户角色
    }
  },
  watch: {
    searchValue(newVal) {
     if (!newVal) {
      this.reFindOrderData()
     }
    },
    selectValue(newVal) {
     if (!newVal) {
      this.reFindOrderData()
     }
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  created() {
    this.userid = this.userData.id
    this.roleName = this.userData.roleName
    this.reFindOrderData()

  },
  methods: {
    /**
     * 改变查询标签
     * @param {*} item 
     */
     handleSelectChange(item) {
      this.searchCondition = item
    },
    /**
     * 条件查询订单信息
     */
    async searchOrder() {
      if (!this.searchValue || !this.selectValue) {
        return this.$message({
          type: 'warning',
          message: '请选择搜索分类或内容不能为空!'
        })
      }
      // let name = '213'
      // 支付状态改变为 数字
      let obj = {
        [this.selectValue]: this.searchValue
      }
      if (this.searchValue === '已支付') {
        obj.status = 1
      } else if (this.searchValue === '未付款') {
        obj.status = 0
      }
      
      try {
        const res =  await searchOrderData(obj)  
        console.log('----res', res);
        this.orderList = res.data.result
      } catch (error) {
        this.$message({
          type: 'warning',
          message: '搜索失败，请重试!'
        })
      }
      console.log('--', obj);
    },
    /**
     * 删除订单信息
     * @param {*} item 
     */
    async deleteOrder(item) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          console.log(item);
          await deleteOrder(item.id)
          this.reFindOrderData()
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
     * 查询订单信息
     */
    async reFindOrderData() {
      let type  = 2
      if (this.roleName === 1) {
        type = 1
      }
      try {
        let  res =  await getOrderData({
          userid: this.userid,
          type: type
        })
        this.orderList = res.data.result
        for (const item in this.orderList) {
          this.orderList[item].createDate = formatDate(this.orderList[item].createDate)
        }
        // this.$message({
        //   type: 'success',
        //   message: '刷新成功！'
        // })
      } catch (error) {
        this.$message.error('刷新失败!')
      }
      // console.log('this.orderList', this.orderList);
    }
  },
}

</script>
<style scoped>
.box-card {
  width: 320px;
  height: 410px;
}
.del-button {
  position: relative;
  top: 5px;
  left: 215px;
}
.search-container {
  position: relative;
  top: 5px;
  left: 60%;
}
</style>