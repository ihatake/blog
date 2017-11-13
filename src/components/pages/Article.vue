<template>
  <div class="article">
    <Card class="post">
      <article>
        <p>一套基于 Vue.js 的高质量UI组件库</p>
      </article>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'article',
    data() {
      return {
        id: this.$route.params.id,
      };
    },
  };
</script>

<style lang="less" scoped>
  .article {
    width: 760px;
    margin: 0 auto;
    .post {
      margin-bottom: 50px;
      min-height: 600px;
    }
  }
</style>
