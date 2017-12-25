<template>
  <div class="bl-blog">
    <div class="content">
      <BlogList :list="list"></BlogList>
      <Spin size="large" fix v-if="spinShow">
      </Spin>
    </div>
    <pagination :currentPage="p" :total="total" :pageSize="pageSize" @pre="pre" @next="next"></pagination>
    <search></search>
  </div>
</template>

<script>
  import Pagination from '@/components/slots/Pagination';
  import Search from '@/components/slots/Search';
  import axios from 'axios';
  import API from '@/config/api';
  import BlogList from './BlogList';

  export default {
    name: 'blog',
    data() {
      return {
        list: [],
        currentPage: 1,
        pageSize: 5,
        total: 0,
        spinShow: true,
      };
    },
    components: {
      Pagination,
      Search,
      BlogList,
    },
    created() {
      this.$store.dispatch('changeHeaderName', 'BLOGS');
      this.getPosts();
    },
    computed: {
      nickname() {
        return this.$route.params.nickname;
      },
      p() {
        if (!this.$route.query.p) {
          return 1;
        }
        if (isNaN(+this.$route.query.p)) {
          return 1;
        }
        return +this.$route.query.p;
      },
    },
    watch: {
      $route() {
        this.getPosts();
      },
    },
    methods: {
      getPosts() {
        this.list = [];
        this.spinShow = true;
        axios.get(API.GETSOMEONEPOSTS, {
          params: {
            nickname: this.nickname,
            pageSize: this.pageSize,
            currentPage: this.p,
          },
        }).then((response) => {
          this.spinShow = false;
          const data = response.data;
          if (data.errorCode === '000') {
            this.list = data.data;
            this.total = data.total;
            const maxp = Math.ceil(this.total / this.pageSize);
            if (this.p > maxp) {
              this.$router.push({ path: `/blogs/${this.nickname}`, query: { p: maxp } });
            }
          }
        }).catch((err) => {
          this.spinShow = false;
          console.log(err);
        });
      },
      pre(currentPage) {
        this.$router.push({ path: `/blogs/${this.nickname}`, query: { p: currentPage } });
      },
      next(currentPage) {
        this.$router.push({ path: `/blogs/${this.nickname}`, query: { p: currentPage } });
      },
    },
  };
</script>

<style lang="less" scoped>
  .bl-blog {
    width: 760px;
    margin: 0 auto;
    padding: 20px 20px 20px 20px;
    position: relative;
    .content {
      min-height: 300px;
      position: relative;
    }
    @media (max-width: 820px) {
      width: 100%;
    }
  }
</style>
