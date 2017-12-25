<template>
  <div class="bl-home">
    <div class="content">
      <Card v-for="(item,index) in list" :key="index" class="post" @click.native="goToArticle(item._id)">
        <article class="article">
          <div class="title">{{item.title}}</div>
          <div class="info">
            <span>{{item.posttime | parseDate}}</span>
            <!--<i class="line"></i>-->
            <span>@{{item.nickname}}</span>
          </div>
          <mavon-editor style="height: 100%" v-model="item.content" :toolbarsFlag="false" code_style="code-hybrid"
                        default_open="preview"/>
        </article>
        <div class="hiddenMask"></div>
      </Card>
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
    name: 'home',
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
    },
    created() {
      this.$store.dispatch('changeHeaderName', 'HOME');
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
    filters: {
      parseDate(val) {
        const date = new Date(val);
        const str = date.toString();
        const i = str.lastIndexOf(' GMT+0800 (CST)');
        return str.slice(4, i);
      },
    },
    watch: {
      $route() {
        this.getPosts();
      },
    },
    methods: {
      goToArticle(id) {
        this.$router.push(`/article/${id}`);
      },
      getPosts() {
        this.list = [];
        this.spinShow = true;
        axios.get(API.GETALLPOSTS, {
          params: {
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
        this.$router.push({ path: '/home', query: { p: currentPage } });
      },
      next(currentPage) {
        this.$router.push({ path: '/home', query: { p: currentPage } });
      },
    },
  };
</script>

<style lang="less" scoped>
  .bl-home {
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
    .post {
      margin-bottom: 50px;
      height: 300px;
      overflow: hidden;
      position: relative;
      .hiddenMask {
        position: absolute;
        bottom: 0;
        height: 100px;
        width: 100%;
        background: -webkit-gradient(linear, 0 top, 0 bottom, from(rgba(255, 255, 255, 0)), to(#fff));
        z-index: 10;
      }
      .article {
        .v-note-wrapper {
          z-index: 8;
        }
        .title {
          margin: 10px 0;
          text-align: center;
          font-size: 22px;
          cursor: pointer;
          color: #000;
          &:hover {
            color: #55b559;
          }
        }
        .info {
          height: 20px;
          line-height: 20px;
          font-size: 13px;
          text-align: center;
          margin-bottom: 30px;
          color: #b5b5b5;
          span {
            margin: 0 10px;
          }
          .line {
            display: inline-block;
            height: 1px;
            background-color: #b5b5b5;
            width: 30px;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .bl-home {
    .article {
      text-align: left;
      .v-note-wrapper .v-note-panel {
        box-shadow: none;
      }
    }
    .v-note-wrapper .v-note-panel .v-note-show .v-show-content {
      background-color: #fff;
    }
  }
</style>
