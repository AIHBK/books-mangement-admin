<!-- 已通过图书 -->
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="借阅失败" name="first">
        <el-button type="primary" size="mini" @click="reFindBooksMessage">重新查询</el-button>
        <el-table
          :data="borrowBookList"
          height="65vh"
          style="margin-top: 15px;"
          >
          <!-- @selection-change="handleSelectionChange" -->
          <el-table-column
            type="selection"
            width="55"
            fixed
          />
          <el-table-column label="图片" width="140">
            <template slot-scope="scope">
              <img width="100px" height="150px" :src="scope.row.url" alt="加载失败">
            </template>
          </el-table-column>
          <el-table-column prop="bookName" label="书名" width="120" />
          <el-table-column prop="borrower" label="借阅人" width="120" />
          <el-table-column prop="author" label="作者" width="150"/>
          <!-- <el-table-column prop="uploader" label="上传者" width="150" /> -->
          <el-table-column prop="classification" label="类别" />
          <!-- <el-table-column prop="content" label="简介" width="150">
            <template slot-scope="scope">
              <div
                v-if="scope.row.content"
                class="table-content-container"
              >
                <i class="el-icon-tickets" style="color: #409EFF; cursor: pointer;" @click="clickTextDialog(scope.row)"></i>
                {{ scope.row.content }}
                
                <el-dialog
                  :title="bookName + ' 简介'"
                  :visible.sync="textDialog"
                  width="40%"
                >
                  <div style="white-space: normal;">{{ content }}</div>
                  
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="textDialog = false">取 消</el-button>
                    <el-button type="primary" @click="textDialog = false">确 定</el-button>
                  </span>
                </el-dialog>
                
              </div>
              <div v-else>暂无简介</div>
              
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="publicationTime" label="出版时间" /> -->
          <el-table-column prop="outTime" width="100" label="借出时间" />
          <el-table-column prop="returnTime" width="100" label="归还时间" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
                <div v-if="scope.row.borrowStatus === -1">借阅失败</div>
            </template>
          </el-table-column>
          <el-table-column prop="createDate" label="上传时间"  />
          <el-table-column label="编辑" width="160" fixed="right">
            <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteBooksMessage(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="归还失败" name="second">
        <el-button type="primary" size="mini" @click="reFindBooksMessage">重新查询</el-button>
        <el-table
          :data="bookList"
          height="65vh"
          style="margin-top: 15px;"
          >
          
          <el-table-column
            type="selection"
            width="55"
            fixed
          />
          <el-table-column label="图片" width="140">
            <template slot-scope="scope">
              <img width="100px" height="150px" :src="scope.row.url" alt="加载失败">
            </template>
          </el-table-column>
          <el-table-column prop="bookName" label="书名" width="120" />
          <el-table-column prop="borrower" label="借阅人" width="120" />
          <el-table-column prop="author" label="作者" width="150"/>
          <el-table-column prop="classification" label="类别" />
          <el-table-column prop="content" label="拒绝信息" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.content">{{ scope.row.content }}</div>
              <div v-else>管理员未填写</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" width="100" label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.status === -1">归还失败</div>
            </template>
          </el-table-column>
          <el-table-column prop="outTime" width="100" label="借出时间" />
          <el-table-column prop="returnTime" width="100" label="归还时间" />
          <el-table-column prop="createDate" label="上传时间"  />
          <el-table-column label="编辑" width="180" fixed="right">
            <template slot-scope="scope">
                <!-- <el-button type="primary" size="mini" @click="reBooksMessage(scope.row)">重新审核</el-button> -->
                <el-button type="danger" size="mini" @click="deleteBooksMessage(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getBooksBorrow, returnBooksMessage, deleteBooksBorrow } from '../../api/book'
import { formatDate } from '../../util/index'
export default {
  data() {
    return {
      borrowBookList: [], // 已拒绝借阅审核
      activeName: 'first', //tab
      bookList: [] // 图书信息
    }
  },
  created() {
    this.reFindBooksMessage()
  },
  methods: {
    /**
     * 删除拒绝图书
     * @param {*} row 
     */
     async deleteBooksMessage(row) {
      console.log('----------row', row);
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          await deleteBooksBorrow(row.id)
          this.reFindBooksMessage()
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
     * 重新审核
     * @param {*} row 
     */
    async reBooksMessage(row) {
      const dataObj = {
        id: row.id,
      }
      try {
        await returnBooksMessage(dataObj)
        this.reFindBooksMessage()
        return this.$message({
          type: 'success',
          message: '已重新审核'
        })
      } catch (error) {
        this.$message({
          type: 'warning',
          message: '重新审核失败，请重试！'
        })
      }
    },
    /**
     * 查询已拒绝审核图书
     */
    async reFindBooksMessage() {
      const resBorrow = await getBooksBorrow({
        borrowStatus: -1,
      })
      const res = await getBooksBorrow({
        status: -1,
      })
      this.borrowBookList = resBorrow.data.result
      this.bookList = res.data.result
      console.log('---------borrowBookList', this.borrowBookList);
      console.log('---------bookList', this.bookList);
      for (const item in this.bookList) {
        this.bookList[item].outTime = formatDate(this.bookList[item].outTime)
        this.bookList[item].returnTime = formatDate(this.bookList[item].returnTime)
        this.borrowBookList[item].outTime = this.bookList[item].outTime
        this.borrowBookList[item].returnTime = this.bookList[item].returnTime
      }
    }
    
  }
}
</script>
<style>
</style>