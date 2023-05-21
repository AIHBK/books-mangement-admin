<!-- 图书推荐 -->
<template>
  <div>
    <el-button type="primary" size="mini" class="button" @click="reFindBooksRecommend">重新查询</el-button>
    <div class="card-container">
      <div  v-for="(item, index) in booksList" :key="item.id" style="margin: 15px; position: relative;">
        <svg t="1679482295548" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5562" id="mx_n_1679482295549" width="50" height="50" style="position: absolute; left: -10px; top: -10px;"><path d="M921.6 1024c0 0-302.08-179.2-335.36-197.12-38.4-20.48-51.2-33.28-74.24-33.28-25.6 0-35.84 17.92-76.8 40.96C404.48 852.48 102.4 1024 102.4 1024c-28.16 0-51.2-23.04-51.2-51.2L51.2 76.8c0-43.52 33.28-76.8 76.8-76.8l768 0c43.52 0 76.8 33.28 76.8 76.8l0 896C972.8 1000.96 949.76 1024 921.6 1024z" fill="#ea581a" p-id="5563"></path></svg>
        <span class="svg-text-container">{{ index+1 }}</span>
        <el-card :body-style="{ padding: '0px', overflow: 'hidden', width: '220px' }">
          <img :src="item.url" width="100%" height="250px" class="image">
          <div style="padding: 14px;">
            <el-tooltip class="item" effect="dark" :content="item.bookName" placement="right">
              <div class="card-text-container">书名：{{ item.bookName}}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="item.author" placement="right">
              <div class="card-text-container">作者：{{ item.author}}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="item.bookNumber" placement="right">
              <div class="card-text-container">图书剩余量：{{ item.bookNumber}} 本</div>
            </el-tooltip>
            <div class="card-text-container">分类：{{ item.classification}}</div>
            <div class="card-text-container">推荐数：{{ item.recommendNum}}</div>
            <el-tooltip class="item" effect="dark" :content="item.createDate" placement="right">
              <div class="card-text-container">创建时间：{{ item.createDate}}</div>
            </el-tooltip>
            <div style="margin-top: 10px;">
              <el-button type="primary" size="mini" class="button" @click="addFavoriteBooksMessage(item)">收藏</el-button>
              <el-button type="success" size="mini" class="button" @click="booksBorrowDialog(item)">借阅</el-button>
              <el-button type="danger" size="mini" class="button" @click="addRecommendMessage(item)">点赞</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 借阅dialog start -->
    <el-dialog
      title="借阅信息填写"
      :visible.sync="borrowDialog"
      width="40%"
    >
      <el-form :model="borrowDataObj" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="borrowDataObj.bookName"></el-input>
        </el-form-item>
        <el-form-item label="借阅人" prop="borrower">
          <el-input v-model="borrowDataObj.borrower" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="borrowDataObj.author"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classification">
          <el-input v-model="borrowDataObj.classification"></el-input>
        </el-form-item>
        <el-form-item label="借出时间" prop="outTime">
          <el-date-picker
            v-model="borrowDataObj.outTime"
            type="date"
            disabled
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="归还时间" prop="returnTime">
          <el-date-picker
            v-model="borrowDataObj.returnTime"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input placeholder="待审核" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="borrowDialog = false">取 消</el-button>
        <el-button type="primary" @click="booksBorrow">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 借阅dialog end -->
  </div>
</template>
<script>
import { getBooksRecommend, addFavoriteBooksData, addRecommendMessage, booksBorrow } from '../../api/book'
import { mapState } from 'vuex'
import {formatDate} from '../../util/index'
export default {
  data() {
    return {
      borrowDialog: false, // 借阅信息dialog
      borrowDataObj: { // 借阅obj
        bookName: '',
        author: '',
        classification: '',
        url: '',
        userid: '',
        bookid: '',
        outTime: '',
        returnTime: '',
        publicationTime: '',
        publishingTouse: '',
        borrower: ''
      },
      booksList: [], // 推荐图书list
      userid: '', // 用户id
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  created() {
    this.borrowDataObj.borrower = this.userData.userName
    this.userid = this.userData.id
    this.reFindBooksRecommend()
    this.getDate()
  },
  methods: {
    /**
     * 获取当前日期
     */
     getDate(){
      this.borrowDataObj.outTime = new Date()
    },
    /**
     * 借阅图书
     */
     async booksBorrow() {
      this.borrowDataObj.outTime = formatDate(this.borrowDataObj.outTime)
      console.log('------------this.borrowDataObj.outTime', this.borrowDataObj.outTime);
      if (!this.borrowDataObj.bookName || !this.borrowDataObj.author || !this.borrowDataObj.classification || !this.borrowDataObj.outTime || !this.borrowDataObj.returnTime) {
        return this.$message({
          type: 'warning',
          message: '请将信息填写完整！'
        })
      }
      try {
        const res = await booksBorrow(this.borrowDataObj)

        if (res.data.state === 2) {
          return this.$message({
            type: 'warning',
            message: '借阅信息已存在，请归还后重新借阅'
          })
        }
        this.reFindBooksRecommend()
        this.$message({
          type: 'success',
          message: '已提交借阅信息，等待管理员审核！'
        })
      } catch (error) {
        console.log(error);
        this.$message({
          type: 'warning',
          message: '借阅失败，请重试！'
        })
      }
      this.borrowDialog = false
    },
    /**
     * 借阅dialog
     * @param {*} row 
     */
     booksBorrowDialog(row) {
      this.borrowDialog = true
      this.borrowDataObj.bookName = row.bookName
      this.borrowDataObj.author = row.author
      this.borrowDataObj.url = row.url
      this.borrowDataObj.classification = row.classification
      this.borrowDataObj.bookid = row.id
      this.borrowDataObj.userid = this.userid
    },
    /**
     * 添加推荐
     * @param {*} item 
     */
     async addRecommendMessage(item) {
      try {
        const res = await addRecommendMessage({
          userid: this.userid,
          bookid: item.id
        })
        if (res.data.state === 2) {
          return this.$message({
            type: 'warning',
            message: '你已经点赞过了，不可重复点赞！'
          })
        }
        this.reFindBooksRecommend()
        return this.$message({
          type: 'success',
          message: '点赞成功！'
        })
      } catch (error) {
        this.$message({
          type: 'warning',
          message: '点赞失败，请重试！'
        })
      }
    },
    /**
     * 添加到我的收藏
     * @param {*} row 
     */
    async addFavoriteBooksMessage(item) {
      try {
        const res = await addFavoriteBooksData({
          userid: this.userid,
          bookid: item.id
        })
        if (res.data.state === 2) {
          return this.$message({
            type: 'warning',
            message: '已在收藏夹中！'
          })
        }
        this.$message({
          type: 'success',
          message: '收藏成功！'
        })
      } catch (error) {
        this.$message({
          type: 'warning',
          message: '收藏失败，请重试！'
        })
        console.log('addFavoriteBooksMessage');
      }
    },
    /**
     * 重新查询每日推荐
     */
    async reFindBooksRecommend() {
      const res = await getBooksRecommend()
      this.booksList = res.data.result
    }
  }
}
</script>
<style scoped>
.card-container {
  width: 85vw;
  height: 75vh;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  overflow-y: scroll;
}
.card-text-container {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.svg-text-container {
  position: absolute;
  color: #fff;
  margin: 0 auto;
  width: 25px;
  text-align: center;
  font-size: 20px;
  top: -3px;
}
</style>