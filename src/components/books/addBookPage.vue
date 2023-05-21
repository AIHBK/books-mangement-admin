<template>
  <div>
    <h3>添加图书信息</h3>
    <div class="upload-container">
      <div class="upload">
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
        size="small"
      >
        <el-form-item label="书名:" prop="userName">
          <el-input
            v-model="uploadDataObj.bookName"
            placeholder="请输入书名"
          />
        </el-form-item>
        <!-- <el-form-item label="数量:" prop="bookNumber">
          <el-input-number v-model="uploadDataObj.bookNumber" :min="1" :max="10" label="描述文字"></el-input-number>
        </el-form-item> -->
        <el-form-item label="分类:" prop="classification">
          <el-select v-model="uploadDataObj.classification" multiple placeholder="请选择" class="select-container">
            <el-option
              v-for="item in classificationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
          <span style="width: 85px; color: #606266; display: inline-block; text-align: right;">数量:</span> <el-input-number v-model="uploadDataObj.bookNumber" :min="1" :max="999" label="图书数量"></el-input-number>
          <span style="width: 85px; color: #606266; display: inline-block; text-align: right;">价格:</span> <el-input-number v-model="uploadDataObj.price" :min="1" :max="999" label="图书价格"></el-input-number>
        </el-form-item>
        <el-form-item label="上传者:" prop="uploader">
          <el-input
            v-model="uploadDataObj.uploader"
            :disabled="true"
          />
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
        <el-form-item label="状态:" prop="status">
          <!-- v-model="uploadDataObj.status" -->
          <el-input
            placeholder="空闲"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="出版时间:" prop="publicationTime">
          <el-date-picker
            v-model="uploadDataObj.publicationTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出版社:" prop="publishingHouse">
          <el-input
            v-model="uploadDataObj.publishingHouse"
            placeholder="请输入出版社"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/util'
import { mapState } from 'vuex'
// import { getBooksData, deleteBooksData, batchDeleteBooksData, addFavoriteBooksData, addRecommendMessage, booksBorrow } from '../../api/book'
export default {
  data() {
    return {      
      fileList: [], // 选取文件list
      uploadDataObj: { // 上传图书信息参数
        bookName: '',
        classification: '',
        author: '',
        publicationTime: '',
        publishingHouse: '',
        uploader: '',
        content: '',
        status: 0,
        bookNumber: 0,
        price: 0
      },
      classificationOptions: [{ // 分类信息
          value: '选项1',
          label: '编程'
        }, {
          value: '选项2',
          label: '动漫'
        }, {
          value: '选项3',
          label: '小说'
        },{
          value: '选项4',
          label: '文学'
        }, {
          value: '选项5',
          label: '艺术'
        }, {
          value: '选项6',
          label: '动漫幽默'
        }, {
          value: '选项7',
          label: '娱乐时尚'
        }, {
          value: '选项8',
          label: '旅游'
        }, {
          value: '选项9',
          label: '地图地理'
        }, {
          value: '选项10',
          label: '其他'
      }],
    }
  },
  computed: {
    ...mapState(['userData'])
  },
  created() {
    this.uploadDataObj.uploader = this.userData.userName
  },
  methods: {
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
      this.uploadDataObj.publicationTime = formatDate(this.uploadDataObj.publicationTime)
      console.log('-------------uploadDataObj', this.uploadDataObj);
      if (!this.uploadDataObj.bookName || this.uploadDataObj.classification.length <= 0 || !this.uploadDataObj.author || this.uploadDataObj.publicationTime.includes('NaN')) {
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
      console.log('-------------this.uploadDataObj', this.uploadDataObj);
      this.$message({
        message: '上传成功！',
        type: 'success'
      })
      this.$refs.upload.submit()
      this.$refs.upload.clearFiles();
      // setTimeout(() => {
      //   this.reFindBooksMessage()
      // }, 1000);
    },
  }
}
</script>
<style scoped>
.upload-container {
  width: 50vw;
  height: auto;
  margin: 0 auto;
  /* overflow: scroll; */
}
.upload {
  width: 100%;
  height: 140px;
  overflow: auto;
}
.select-container {
  width: 25%;
}

</style>