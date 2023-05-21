<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="图书信息" name="first">
        <!-- 图书信息button start -->
        <div style="position: relative;">
          <el-button type="primary" size="small" style="margin-left: 15px;" @click="reFindFavoriteBooksData">
            <i class="el-icon-refresh-right" />
            重置查询
          </el-button>
          <!-- <div class="button-right-container">
            <el-button type="danger" size="small" style="margin-left: 15px;" @click="batchDeleteBooksData">批量删除</el-button>
          </div> -->
        </div>
        <!-- 图书信息button end -->
        <el-table
          :data="bookList"
          height="65vh"
          style="margin-top: 15px;"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="图片" width="140">
            <template slot-scope="scope">
              <img width="100px" height="150px" :src="scope.row.url" alt="加载失败">
            </template>
          </el-table-column>
          <el-table-column prop="bookName" label="书名" width="120" />
          <el-table-column prop="author" label="作者" />
          <el-table-column prop="uploader" label="上传者" />
          <el-table-column prop="classification" label="类别" />
          <el-table-column prop="price" label="价格" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.price">{{ scope.row.price }} 元/本</div>
              <div v-else>暂无价格</div>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="简介">
            <template slot-scope="scope">
              <div
                v-if="scope.row.content"
                class="table-content-container"
              >
                <i class="el-icon-tickets" style="color: #409EFF;" @click="textDialog = true"></i>
                {{ scope.row.content }}
                <!-- 简介dialog start -->
              <el-dialog
                :title="scope.row.bookName + ' 简介'"
                :visible.sync="textDialog"
                width="40%"
              >
                <div style="white-space: normal;">{{ scope.row.content }}</div>
                
                <span slot="footer" class="dialog-footer">
                  <el-button @click="textDialog = false">取 消</el-button>
                  <el-button type="primary" @click="textDialog = false">确 定</el-button>
                </span>
              </el-dialog>
              <!-- 简介dialog end -->
              </div>
              <div v-else>暂无简介</div>
              
            </template>
          </el-table-column>
          <el-table-column prop="publicationTime" label="出版时间" />
          <el-table-column prop="type" label="发布状态">
            <template slot-scope="scope">
                <span v-if="scope.row.type === 1">最近更新</span>
                <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="recommendNum" label="推荐数" />
          <el-table-column prop="size" label="大小" />
          <el-table-column prop="createDate" label="上传时间"  />
          <el-table-column label="编辑" width="150">
            <template slot-scope="scope">
                <el-button type="success" size="mini" @click="booksBorrowDialog(scope.row)">借阅</el-button>
                <el-button type="danger" size="mini" @click="deleteFavoriteBooksData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
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
            placeholder="选择日期"
          >
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
import { mapState } from 'vuex'
import { getFavoriteBooksData, deleteFavoriteBooksData, booksBorrow } from '../../api/book'
import { formatDate } from '../../util/index'
export default {
  name: 'bookPage',
  data() {
    return {
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
      borrowDialog: false, // 借阅信息dialog
      textDialog: false, // 简介dialog
      bookList:[ // 图书信息
      ],
      activeName: 'first', // tab位置
      userId: ''
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  created() {
    this.borrowDataObj.borrower = this.userData.userName
    this.userId = this.userData.id
    this.reFindFavoriteBooksData()
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
      delete this.borrowDataObj.bookNumber
      delete this.borrowDataObj.recommendNum
      delete this.borrowDataObj.size
      delete this.borrowDataObj.status
      delete this.borrowDataObj.type
      delete this.borrowDataObj.userId
      delete this.borrowDataObj.publicationTime
      delete this.borrowDataObj.publishingTouse
      
      this.borrowDataObj.outTime = formatDate(this.borrowDataObj.outTime)
      if (!this.borrowDataObj.bookName || !this.borrowDataObj.author || !this.borrowDataObj.classification || !this.borrowDataObj.outTime || !this.borrowDataObj.returnTime) {
        return this.$message({
          type: 'warning',
          message: '请将信息填写完整！'
        })
      }
      console.log('------------this.borrowDataObj', this.borrowDataObj);
      try {
        const res = await booksBorrow(this.borrowDataObj)
        if (res.data.state === 5) {
          return this.$message({
            type: 'warning',
            message: '其他用户以借阅，请等待归还！'
          })
        }
        if (res.data.state === 2) {
          return this.$message({
            type: 'warning',
            message: '借阅信息已存在，请归还后重新借阅'
          })
        }
        this.reFindFavoriteBooksData()
        this.$message({
          type: 'success',
          message: '已提交借阅信息，等待管理员审核！'
        })
      } catch (error) {
        console.log('error', error);
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
      console.log('-----row', row);
      this.borrowDialog = true
      this.borrowDataObj.bookName = row.bookName
      this.borrowDataObj.author = row.author
      this.borrowDataObj.url = row.url
      this.borrowDataObj.classification = row.classification
      this.borrowDataObj.bookid = row.bookid
      this.borrowDataObj.userid = row.userid
      this.borrowDataObj.price = row.price
    },
    /**
     * 删除收藏信息
     * @param {*} row 
     */
    deleteFavoriteBooksData(row) {
      this.$confirm('此操作将删除收藏信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await deleteFavoriteBooksData({
            userid: this.userId,
            bookid: row.bookid
          })
          this.reFindFavoriteBooksData()
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
     * 重新查询收藏信息
     */
    async reFindFavoriteBooksData() {
      try {
        const res = await getFavoriteBooksData(this.userId)
        this.bookList = res.data.result
        // this.$message({
        //   type: 'success',
        //   message: '刷新成功！'
        // })
      } catch (error) {
        console.log('reFindFavoriteBooksData.error', error);
        this.$message.error('刷新失败!');
      }
    }
   
  },
}
</script>

<style>
.upload-container {
  width: 100%;
  height: 140px;
  overflow: auto;
}
v-deep .el-form-item .el-input{
  width: 90%;
}
.select-container {
  width: 100%;
}
.button-right-container {
  display: inline-block;
  width: auto;
  position: absolute;
  right: 30px;
  text-align: right;
}
.table-content-container {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>