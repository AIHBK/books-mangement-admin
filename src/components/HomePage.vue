<template>
    <div>
      <div class="content-container">
      <!-- 头部 -->
      <HeaderPageVue />
      <!-- 内容区域 -->
    </div>
    <!-- 菜单 -->
    <MenuPage />
    </div>
</template>

<script>
import HeaderPageVue from './Header/HeaderPage.vue';
import MenuPage from './Menu/MenuPage.vue';
import { updataOrder } from '../api/book';

export default {
  name: 'HomePage',
  components: {
    MenuPage,
    HeaderPageVue,
  },
  async created() {
    console.log('this.$router', this.$route);
    // 更新本地订单信息
    if (this.$route.query.out_trade_no || this.$route.query.trade_no) {
      let data = {
        id: this.$route.query.out_trade_no,
        trade_no: this.$route.query.trade_no,
      }
      try {
        await updataOrder(data)
        this.$message({
          type: 'success',
          message: '支付成功！'
        })
      } catch (error) {
        this.$message({
          type: 'warning',
          message: '支付失败！'
        })
        console.log('支付错误', error);
      }
    }
    

  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
.content-container {
  width: 100%;
}
</style>
