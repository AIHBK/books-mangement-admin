<template>
  <div>
    <el-button type="primary" size="mini" @click="reFindBorrowData">重新查询</el-button>
    <el-table
      ref="multipleTable"
      :data="booksBorrowList"
      tooltip-effect="dark"
      style="width: 100%"
      height="65vh"
    >
      <el-table-column
        type="selection"
        width="55"
        fixed
      >
      </el-table-column>
      <el-table-column
        label="封面"
        width="120"
      >
        <template slot-scope="scope">
          <img :src="scope.row.url" alt="加载失败" width="100px" height="150px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="bookName"
        label="书名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="borrower"
        label="借阅人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="120">
      </el-table-column>
      <el-table-column
        prop="classification"
        label="分类"
        >
      </el-table-column>
      <el-table-column
        prop="outTime"
        label="借出时间"
        >
      </el-table-column>
      <el-table-column
        prop="returnTime"
        label="归还时间"
        >
      </el-table-column>
      <el-table-column
        prop="classification"
        label="分类"
        >
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.price">{{ scope.row.price }} 元/本</div>
          <div v-else>暂无价格</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="borrowStatus"
        label="审核状态"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.borrowStatus === 0">
            审核中
          </div>
          <div v-else-if="scope.row.borrowStatus === 1">已通过</div>
          <div v-else-if="scope.row.borrowStatus === -1">借阅失败</div>
          <div v-else>已归还</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="拒绝理由"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status === -1">{{ scope.row.content}}</div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="借阅状态"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status === 0">归还审核中</div>
          <div v-else-if="scope.row.status === 1">已归还</div>
          <div v-else-if="scope.row.status === -1">已拒绝归还</div>
          <div v-else>借阅中</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="借阅时间"
        >
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
        >
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === -1" type="success" size="mini" @click="buyBookShow(scope.row)">支付</el-button>
          <el-button v-else type="success" size="mini" @click="returnBooksMessage(scope.row)" :disabled="scope.row.borrowStatus === 0 || scope.row.borrowStatus === -1 || scope.row.status === 1 ? true : false">归还</el-button>
          <el-button type="danger" size="mini" @click="deleteBorrowData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 购买dialog start-->
    <el-dialog
      title="订单信息"
      :visible.sync="buyBookDialog"
      width="30%"
    >
      <el-card class="box-card" style="padding: 3px;">
        <div style="padding: 3px;">
          <img :src="orderDataObj.url" width="80px" height="100px" alt="加载失败">
          <div style="display: inline-block;width: 70%;height: 100px;vertical-align: top;margin-left: 15px;position: relative;">
            <h3>无名图书</h3>
            <div style="margin: 5px; font-size: 14px;">
              <span>{{ orderDataObj.bookName }}</span><span style="position: absolute;right: 5px; font-weight:600;">￥{{ orderDataObj.price }}</span>
            </div>
            <div style="margin: 5px; font-size: 13px;color: #c0c0c0;">
              <span>{{ orderDataObj.classification}};</span>
              <!-- <span>{{ orderDataObj.author}};</span> -->
              <span style="margin-left: 50px;position: absolute;right: 5px;">X {{ orderDataObj.bookNumber }}</span>
            </div>
            <div style="margin: 5px; font-size: 13px;color: #c0c0c0;">
              <span>作者</span>
              <span style="margin-left: 50px;position: absolute;right: 5px;">{{ orderDataObj.author }}</span>
            </div>
          </div>
        </div>
      </el-card>
      <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
        <span>付款人</span>
        <span style="margin-left: 50px;position: absolute;right: 5px;">{{ orderDataObj.userName }}</span>
      </div>
      <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
        <span>商品总价</span>
        <span style="margin-left: 50px;position: absolute;right: 5px;font-weight:600;">￥{{ orderDataObj.totalPrice }}</span>
      </div>
      <div style="height: 30px;margin: 10px 0;padding: 0 3px; position: relative;border-bottom: 1px solid #c0c0c0">
        <span style="font-size:13px;">需实付款</span>
        <span style="margin-left: 50px;position: absolute;right: 5px;font-weight:600;color: #ff6700;">￥{{ orderDataObj.totalPrice }}</span>
      </div>
      <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
        <span>购买原因</span>
        <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;">{{ orderDataObj.content }}</span>
      </div>
      <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
        <span>订单编号</span>
        <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;">{{ orderDataObj.id }}</span>
      </div>
      <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
        <span>支付方式</span>
        <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;" v-if="orderDataObj.paymentMode === 0">支付宝</span>
        <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;" v-else>其他支付方式</span>
      </div>
      <div style="font-size:13px;margin: 10px 0;padding: 0 3px; position: relative;">
        <span>创建时间</span>
        <span style="margin-left: 50px;position: absolute;right: 5px;color: #c0c0c0;">{{ orderDataObj.createDate }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="buyBookDialog = false">取 消</el-button>
        <el-button type="primary" @click="buyBook">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 购买dialog end-->
  </div>
</template>
<script>
import { formatDate  } from '../../util/index'
import { getBooksBorrow, returnBooksMessage, deleteBooksBorrow, addOrderData, getOrderData, alipaySdkAPI } from '../../api/book'
import { mapState } from 'vuex'
export default {
  name: 'borrowPage',
  data() {
    return {
      orderDataObj: { // 订单信息
      },
      // orderId: '', // 订单号
      buyBookObj: { // 购买图书obj
        bookid: '',
        userid: '',
        bookName: '',
        userName: '',
        price: 0,
        totalPrice: '',
        bookNumber: 1,
        paymentMode: 0,
        url: '',
        author: '',
        classification: '',
        actualPayment: '',
      }, 
      buyBookDialog: false, // 购买图书dialog
      booksBorrowList: [], // 借阅信息List
      userid: '', // 用户id
      roleName: '', // 用户角色
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  created() {
    this.userid = this.userData.id
    this.reFindBorrowData()
    this.roleName = this.userData.roleName
  },
  methods: {
    /**
     * 确认支付
     */
    async buyBook() {
      const res = await alipaySdkAPI({
        orderId: this.orderDataObj.id,
        price: this.orderDataObj.price,
        content: this.orderDataObj.content,
        bookName: this.orderDataObj.bookName,
      })
      console.log('-----this.buyBookObj.id', this.orderDataObj.id);
      let urlObj = res.data 
      window.location.href = urlObj.data.paymentUrl
      // window.open(urlObj.data.paymentUrl)
    },
    /**
     * 购买并创建订单
     * @param {*} row 
     */
    async buyBookShow(row) {
      this.buyBookObj.bookid = row.bookid
      this.buyBookObj.userid = row.userid
      this.buyBookObj.bookName = row.bookName
      this.buyBookObj.userName = row.borrower
      this.buyBookObj.price = row.price
      this.buyBookObj.totalPrice = row.price * 1
      // this.buyBookObj.bookNumber = row.bookNumber
      this.buyBookObj.url = row.url
      this.buyBookObj.author = row.author
      this.buyBookObj.classification = row.classification
      this.buyBookObj.actualPayment = row.price * 1
      this.buyBookObj.content = row.content
      // console.log('this.buyBookObj', this.buyBookObj);
      const orderResult = await getOrderData({
        status: 1,
        bookid: row.bookid,
        userid: row.userid,
        type: 0
      })
      if (orderResult.data?.result[0]?.btnStatus === 1) {
        return this.$message({
          type: 'warning',
          message: '该订单已完成支付，不可重复支付！'
        })
      }


      // 创建订单
      const res = await addOrderData(this.buyBookObj)
      // 获取订单信息
      const orderData = await getOrderData({
        status: 0,
        bookid: row.bookid,
        userid: row.userid,
        type: 0
      })
      if (orderData.data?.result[0]?.btnStatus === 1) {
        return this.$message({
          type: 'warning',
          message: '该订单已完成支付，不可重复支付！'
        })
      }
      this.orderDataObj = orderData.data.result[0]
      console.log('this.orderDataObj', this.orderDataObj);
      const loading = this.$loading({
        lock: true,
        text: res.data.state === 2 ? '正在查询订单，请稍等...' : '正在创建订单，请稍等...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (res.data.result) {
        setTimeout(() => {
          // 打开dianlog
          this.buyBookDialog = true
          loading.close();
        }, 1500)
      }
      
      // console.log('this.orderId', this.orderId);
    },

    /**
     * 归还图书
     * @param {*} row 
     */
    async returnBooksMessage(row) {
      try {
        await returnBooksMessage({
          id: row.id,
          userid: row.userid,
          bookid: row.bookid
        })
        this.reFindBorrowData()
        this.$message({
          type: 'warning',
          message: '归还成功,请等待管理员检查图书是否完整！'
        })
      } catch (error) {
        this.$message({
          type: 'warning',
          message: '归还失败，请重试！'
        })
      }
    },
    /**
     * 删除借阅信息
     * @param {*} row 
     */
    async deleteBorrowData(row) {
      if (row.status !== 1) {
        return this.$message({
          type: 'warning',
          message: '请先归还图书后删除！'
        })
      }

      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          await deleteBooksBorrow(row.id)
          this.reFindBorrowData()
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
     * 查询借阅信息
     */
    async reFindBorrowData() {
     let  res =  await getBooksBorrow({
        id: this.userid
      })
      this.booksBorrowList = res.data.result
      for (const item in this.booksBorrowList) {
        this.booksBorrowList[item].outTime = formatDate(this.booksBorrowList[item].outTime)
        this.booksBorrowList[item].returnTime = formatDate(this.booksBorrowList[item].returnTime)
      }
    }
  },
}

</script>
<style scoped>
/* v-deep .box-card {
  width: 100px;
  padding: 0;
} */
v-deep .el-card__body {
  width: 100px;
  padding: 0;
}
</style>