<!-- 访问的页面不存在 -->
<template>
  <div class="errorPage-404">
      <i class="icon icon-yemianbucunzai"></i>
      <p>您访问的页面不存在</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },

  methods: {}
}

</script>
<style lang='scss' scoped>
.errorPage-404{
    background-color: #f0f0f6;
    margin: 300px auto;
    text-align: center;
    i{
        font-size: 50px;
        opacity: 0.5;
    }
    p {
        margin-top: 20px;
        color: #666;
    }
}
</style>