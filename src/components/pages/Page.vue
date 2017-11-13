<template>
  <div class="page">
    <Card v-for="(item,index) in list" :key="index" class="post" @click.native="goToArticle(index)">
      <article>
        <p>一套基于 Vue.js 的高质量UI组件库</p>
      </article>
    </Card>
    <pagination></pagination>
    <search></search>
  </div>
</template>

<script>
  import Pagination from '@/components/slots/Pagination';
  import Search from '@/components/slots/Search';

  export default {
    name: 'page',
    data() {
      return {
        list: [1, 2, 3, 4, 5],
      };
    },
    components: {
      Pagination,
      Search,
    },
    methods: {
      goToArticle(index) {
        this.$router.push(`/article/${index}`);
      },
    },
  };
</script>

<style lang="less" scoped>
  .page {
    width: 760px;
    margin: 0 auto;
    padding: 20px 20px 20px 20px;
    position: relative;
    @media (max-width: 820px) {
      width: 100%;
    }
    .post {
      margin-bottom: 50px;
      height: 600px;
    }
    article {
    }
  }
</style>
