<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="图书信息" name="first">
        <!-- 图书信息button start -->
        <div style="position: relative;">
          <!-- <el-button type="primary" size="small" style="margin-left: 15px;" @click="uploadDialog = true">添加图书信息</el-button> -->
          <el-button type="primary" size="small" style="margin-left: 15px;" @click="reFindBooksMessage">
            <i class="el-icon-refresh-right" />
            重置查询
          </el-button>
          <!-- <el-button type="primary" size="small" style="margin-left: 15px;" @click="alipaySdkAPI">
            支付接口测试
          </el-button> -->
          
          <div class="button-right-container">
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
                  @click="searchBooks"
                />
              </el-input>
            </div>
            <!-- 搜索 end -->
            <el-button v-if="roleName === 1" type="danger" size="small" style="margin-left: 15px;" @click="batchDeleteBooksData">批量删除</el-button>
          </div>
        </div>
        <!-- 图书信息button end -->
        <el-table
          :data="bookList"
          height="65vh"
          style="margin-top: 15px;"
          @selection-change="handleSelectionChange"
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
          <el-table-column prop="author" label="作者" width="150"/>
          <el-table-column prop="classification" label="类别" />
          <el-table-column prop="recommendNum" label="推荐数" />
          <el-table-column prop="bookNumber" label="图书剩余量" width="100">
            <template slot-scope="scope">
              <div>{{ scope.row.bookNumber }} 本</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
                <div v-if="scope.row.status >= 0">空闲</div>
                <div v-else-if="scope.row.status === -1">暂无库存</div>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="简介" width="150">
            <template slot-scope="scope">
              <div
                v-if="scope.row.content"
                class="table-content-container"
              >
                <i class="el-icon-tickets" style="color: #409EFF; cursor: pointer;" @click="clickTextDialog(scope.row)"></i>
                {{ scope.row.content }}
              </div>
              <div v-else>暂无简介</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.price">{{ scope.row.price }} 元/本</div>
              <div v-else>暂无价格</div>
            </template>
          </el-table-column>
          <el-table-column prop="publicationTime" label="出版时间">
            <template slot-scope="scope">
              <div v-if="scope.row.publicationTime">{{ scope.row.publicationTime }}</div>
              <div v-else>暂无时间</div>
            </template>
          </el-table-column>
          <el-table-column prop="publishingHouse" label="出版社">
            <template slot-scope="scope">
              <div v-if="scope.row.publishingHouse">{{ scope.row.publishingHouse }}</div>
              <div v-else>暂无出版社</div>
            </template>
          </el-table-column>
          <el-table-column prop="uploader" label="上传者" width="100" />
          <el-table-column prop="createDate" label="上传时间"  />
          <el-table-column label="编辑" width="160" fixed="right">
            <template slot-scope="scope">
                <div v-if="roleName === 1">
                  <el-button type="primary" size="mini" @click="editBooksMessage(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="deleteBooksMessage(scope.row)">删除</el-button>
                </div>
                <div v-else>
                  <el-button type="primary" size="mini" @click="addFavoriteBooksMessage(scope.row)">
                    <i class="el-icon-star-off"/> 收藏
                  </el-button>
                  <el-button type="success" size="mini" @click="addRecommendMessage(scope.row)">推荐</el-button>
                  <el-button type="success" size="mini"
                    style="margin-top: 15px; margin-left: -27px; position: relative; left: 50%;"
                    @click="booksBorrowDialog(scope.row)"
                  >
                  借阅
                </el-button>
                </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
     <!-- 简介dialog start -->
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
    <!-- 简介dialog end --> 
    <!-- 上传dialog start -->
    <!-- <el-dialog
      title="添加图书信息"
      :visible.sync="uploadDialog"
      width="40%"
    >
      <div class="upload-container">
        <el-upload
          ref="upload"
          action="http://localhost:3000/books/admin/upload"
          list-type="picture"
          :on-change="changeFile"
          :on-remove="removeFile"
          :auto-upload="false"
          :data="uploadDataObj"
          :file-list="fileList"
          :limit="1"
        >
          <el-button slot="trigger" size="small" type="primary">选取封面</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="upload()">确认添加</el-button>
        </el-upload>
      </div>
      <el-form 
        :model="uploadDataObj"
        label-width="90px"
      >
        <el-form-item label="书名:" prop="userName">
          <el-input
            v-model="uploadDataObj.bookName"
            placeholder="请输入书名"
          />
        </el-form-item>
        <el-form-item label="分类:" prop="classification">
          <el-select v-model="uploadDataObj.classification" multiple placeholder="请选择" class="select-container">
            <el-option
              v-for="item in classificationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者:" prop="author">
          <el-input
            v-model="uploadDataObj.author"
            placeholder="请输入作者"
          />
        </el-form-item>
        <el-form-item label="简介内容:" prop="content">
          <el-input
            v-model="uploadDataObj.content"
            placeholder="请输入简介内容"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="出版时间:" prop="publicationTime">
          <el-input
            v-model="uploadDataObj.publicationTime"
            placeholder="请输入出版时间 如: 1998-12-31"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialog = false">关闭</el-button>
      </span>
    </el-dialog> -->
    <!-- 上传dialog end -->
    <!-- 借阅dialog start -->
    <el-dialog
      title="借阅信息填写"
      :visible.sync="borrowDialog"
      width="40%"
    >
      <el-form :model="borrowDataObj" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="borrowDataObj.bookName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="借阅人" prop="borrower">
          <el-input v-model="borrowDataObj.borrower" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="borrowDataObj.author" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classification">
          <el-input v-model="borrowDataObj.classification" :disabled="true"></el-input>
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
            :picker-options="pickerOptions"
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
    <!-- 图书信息编辑dialog start -->
    <el-dialog
      title="修改图书信息"
      :visible.sync="bookEditDialog"
      width="40%"
    >
      <el-form :model="bookEditObj" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="bookEditObj.bookName"></el-input>
        </el-form-item>
        <el-form-item label="上传者" prop="uploader">
          <el-input v-model="bookEditObj.uploader"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="bookEditObj.author"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classification">
          <el-input v-model="bookEditObj.classification"></el-input>
        </el-form-item>
        <el-form-item label="推荐数" prop="recommendNum">
          <el-input v-model.number="bookEditObj.recommendNum"></el-input>
        </el-form-item>
        <el-form-item label="图书剩余量" prop="bookNumber">
          <el-input v-model.number="bookEditObj.bookNumber"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="bookEditObj.status" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="content">
          <el-input v-model="bookEditObj.content"></el-input>
        </el-form-item>
        <el-form-item label="出版时间" prop="publicationTime">
          <el-input v-model="bookEditObj.publicationTime"></el-input>
        </el-form-item>
        <el-form-item label="出版社" prop="publishingHouse">
          <el-input v-model="bookEditObj.publishingHouse"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bookEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatedBookData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图书信息编辑dialog end -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getBooksData, deleteBooksData, batchDeleteBooksData, addFavoriteBooksData, addRecommendMessage, booksBorrow, searchBookData, updatedBookData, alipaySdkAPI } from '../../api/book'
import { formatDate } from '@/util'
export default {
  name: 'bookPage',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() > Date.now();  // 可选历史天、可选当前天、不可选未来天
          // return time.getTime() > Date.now() - 8.64e7;  // 可选历史天、不可选当前天、不可选未来天
          // return time.getTime() < Date.now() - 8.64e7;  // 不可选历史天、可选当前天、可选未来天
          return time.getTime() < Date.now(); // 不可选历史天、不可选当前天、可选未来天
        }
      },
      bookEditObj: { // 图书编辑obj
      },
      bookEditDialog: false, // 编辑图书dialog 
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
          label: '上传人',
          value: 'uploader'
        },
        {
          label: '分类',
          value: 'classification'
        },
        {
          label: '出版社',
          value: 'publishingHouse'
        },
      ],
      searchValue: '', // 搜索输入的值
      selectValue: '', // 搜索分类
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
        borrower: '',
        price: 0
      },
      borrowDialog: false, // 借阅信息dialog
      bookName: '', // 书名
      content:'', // 简介内容
      textDialog: false, // 简介弹窗
      activeName: 'first', // 切换tab Flag
      bookList:[ // 图书信息
      ],
      uploadList:[], // 上传信息的lsit
      uploadDialog: false,  // 上传信息dialog
      pictureDialog: false, // 图片dialog
      uploadDataObj: { // 上传图书信息参数
        bookName: '',
        classification: '',
        author: '',
        publicationTime: '',
        uploader: '',
        content: '',
        status: 0
      },
      classificationOptions: [{ // 分类信息
          value: '选项1',
          label: '青春'
        }, {
          value: '选项2',
          label: '小说'
        }, {
          value: '选项3',
          label: '文学'
        }, {
          value: '选项4',
          label: '艺术'
        }, {
          value: '选项5',
          label: '动漫幽默'
        }, {
          value: '选项6',
          label: '娱乐时尚'
        }, {
          value: '选项7',
          label: '旅游'
        }, {
          value: '选项8',
          label: '地图地理'
        }, {
          value: '选项9',
          label: '其他'
      }],
      fileList: [], // 选取文件list
      tableSelectList: [], // 选取表格list
      roleName: null, // 用户角色
      userid: '' // 用户id
    }
  },
  watch: {
    searchValue(newVal) {
     if (!newVal) {
      this.reFindBooksMessage()
     }
    },
    selectValue(newVal) {
     if (!newVal) {
      this.reFindBooksMessage()
     }
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  async created() {
    // const res = await getBooksData()
    // this.bookList = res.data.resultthis.reFindBooksMessage()
    // 查询books data
    this.borrowDataObj.borrower = this.userData.userName
    this.reFindBooksMessage()
    this.roleName = this.userData.roleName
    this.userid = this.userData.id
    this.uploadDataObj.uploader =  this.userData.userName
    this.getDate()
  },
  methods: {
    // imgClick(url){
    //     let path=window.location.protocol+'//'+url
    //     window.location.href=path
    // },
    /**
     * 支付宝支付测试接口
     */ 
    async alipaySdkAPI() {
      const dataObj = {
        orderID: 'a123456'
      }
      console.log('alipaySdkAPI.dataObj', dataObj);
      const res = await alipaySdkAPI(dataObj)

      
      let urlObj = res.data 
      console.log('-----urlObj', urlObj.data.paymentUrl);
      window.location.href = urlObj.data.paymentUrl
    },
    /**
     * 修改图书信息
     */
    async updatedBookData() {
      console.log('this.bookEditObj', this.bookEditObj);
      try {
        await updatedBookData(this.bookEditObj)
        this.reFindBooksMessage()
        this.bookEditDialog = false
        this.$message({
          type: 'success',
          message: '图书信息修改成功！'
        })
      } catch (error) {
        console.log('updatedBookData.error', error);
        this.$message({
          type: 'warning',
          message: '图书信息修改成功！'
        })
      }
    },
    /**
     * 搜索图书信息
     */
    async searchBooks() {
      if (!this.searchValue || !this.selectValue) {
        return this.$message({
          type: 'warning',
          message: '请选择搜索分类或内容不能为空!'
        })
      }
      // let name = '213'
      let obj = {
        [this.selectValue]: this.searchValue
      }
      try {
        const res =  await searchBookData(obj)  
        console.log('----res', res);
        this.bookList = res.data.result
      } catch (error) {
        this.$message({
          type: 'warning',
          message: '搜索失败，请重试!'
        })
      }
      
      console.log('--', obj);
    },
    /**
     * 改变查询标签
     * @param {*} item 
     */
     handleSelectChange(item) {
      this.searchCondition = item
    },
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
      if (!this.borrowDataObj.bookName || !this.borrowDataObj.author || !this.borrowDataObj.classification || !this.borrowDataObj.outTime || !this.borrowDataObj.returnTime) {
        return this.$message({
          type: 'warning',
          message: '请将信息填写完整！'
        })
      }
      console.log('this.borrowDataObj:', this.borrowDataObj);
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
        this.reFindBooksMessage()
        this.$message({
          type: 'success',
          message: '已提交借阅信息，等待管理员审核！'
        })
      } catch (error) {
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
      this.borrowDataObj.price = row.price
    },
    /**
     * 点击打开简介预览dialog
     * @param {*} row 
     */
    clickTextDialog(row) {
      this.$nextTick(() => {
        this.textDialog = true
      this.bookName = row.bookName,
      this.content = row.content
      })
    },

    /**
     * 添加推荐
     * @param {*} row 
     */
    async addRecommendMessage(row) {
      try {
        const res = await addRecommendMessage({
          userid: this.userid,
          bookid: row.id
        })
        if (res.data.state === 2) {
          return this.$message({
            type: 'warning',
            message: '你已经推荐过了，不可重复推荐！'
          })
        }
        this.reFindBooksMessage()
        return this.$message({
          type: 'success',
          message: '推荐成功！'
        })
      } catch (error) {
        this.$message({
          type: 'warning',
          message: '推荐失败，请重试！'
        })
      }
    },
    /**
     * 添加到我的收藏
     * @param {*} row 
     */
    async addFavoriteBooksMessage(row) {
      try {
        const res = await addFavoriteBooksData({
          userid: this.userid,
          bookid: row.id
        })
        console.log('---res', res);
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
     * 选择文件信息
     */
    handleSelectionChange(val) {
      this.tableSelectList = val
    },

    /**
     * 批量删除图书信息
     */
    async batchDeleteBooksData() {
      if (this.tableSelectList.length < 1) {
        return this.$message({
          message: '请选择要删除的信息',
          type: 'warning'
        })
      }
      let list = []
      for (const item in this.tableSelectList) {
        list[item] = this.tableSelectList[item].id
      }
      this.$confirm('此操作将永久删除已选中信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await batchDeleteBooksData(list)
          this.reFindBooksMessage()
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
    },
    /**
     * 清除文件list
     */
    removeFile() {
      this.$refs.upload.clearFiles();
    },

    /**
     * 选择文件改变钩子
     * @param {*} file 
     */
    changeFile(file, fileList) {
      // console.log('---changeFile.fileList', fileList);
      this.$nextTick(() => {
        this.fileList = fileList
      })
    },
    
    /**
     * 文件上传
     */
    async upload() {
      if (!this.uploadDataObj.bookName || this.uploadDataObj.classification.length <= 0 || !this.uploadDataObj.author || !this.uploadDataObj.publicationTime) {
        return this.$message({
          message: '请填入一下信息！',
          type: 'warning'
        })
      }
      // console.log('----this.fileList', this.fileList);
      if (this.fileList.length < 1) {
        return this.$message({
          message: '请选择一张图书封面!',
          type: 'warning'
        })
      }
      this.$message({
        message: '上传成功！',
        type: 'success'
      })
      this.$refs.upload.submit()
      this.$refs.upload.clearFiles();
      setTimeout(() => {
        this.reFindBooksMessage()
      }, 1000);
    },

    /**
     * 重新查找表格数据
     * @param {*} data 条件查询
     */
    async reFindBooksMessage() {
      const res = await getBooksData()
      for (let i = 0; i < res.data.result.length; i++) {
        res.data.result[i].edit = 0
      }
      this.bookList = res.data.result
    },
    /**
     * 修改图书信息
     * @param {*} row 当前行信息
     */
    editBooksMessage(row) {
      console.log('------row', row)
      this.bookEditObj = row
      delete this.bookEditObj.edit
      this.bookEditDialog = true
    },
    /**
     * 删除图书信息
     * @param {*} row 当前行信息 
     */
    deleteBooksMessage(row) {
      if (this.roleName !== 1) {
        return this.$message({
          type: 'warning',
          message: '没有权限，请联系管理员！'
        });
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteBooksData(row.id)
        // 重插列表
        this.reFindBooksMessage()
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
    },
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
.search-container {
  display: inline-block;
}
</style>