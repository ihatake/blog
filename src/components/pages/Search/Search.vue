<template>
  <div class="bl-search">
    <div class="content">
      <p class="key">下面文章中包含搜索词：{{key}}</p>
      <ul>
        <a v-for="(item,index) in list" :href="`/article/${item._id}`">
          <li>
            {{index + 1}}- 标题：{{item.title}}
          </li>
        </a>
      </ul>
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

  export default {
    name: 'blog',
    data() {
      return {
        list: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        spinShow: true,
      };
    },
    components: {
      Pagination,
      Search,
    },
    created() {
      this.$store.dispatch('changeHeaderName', 'SEARCH');
      this.getPosts();
    },
    computed: {
      nickname() {
        return this.$route.params.nickname;
      },
      key() {
        return this.$route.query.key;
      },
      p() {
        if (!this.$route.query.p) {
          return 1;
        }
        if (isNaN(+this.$route.query.p)) {
          return 1;
        }
        console.log('mdksd', +this.$route.query.p);
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
        axios.get(API.SEARCH, {
          params: {
            key: this.key,
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
              this.$router.push({ path: '/search', query: { key: this.key, p: maxp || 1 } });
            }
          }
        }).catch((err) => {
          this.spinShow = false;
          console.log(err);
        });
      },
      pre(currentPage) {
        this.$router.push({ path: '/search', query: { key: this.key, p: currentPage } });
      },
      next(currentPage) {
        this.$router.push({ path: '/search', query: { key: this.key, p: currentPage } });
      },
    },
  };
</script>

<style lang="less" scoped>
  .bl-search {
    width: 760px;
    margin: 0 auto;
    padding: 20px 20px 20px 20px;
    position: relative;
    .content {
      min-height: 300px;
      position: relative;
      text-align: left;
      ul {
        padding: 10px;
      }
    }
    @media (max-width: 820px) {
      width: 100%;
    }
  }
</style>
