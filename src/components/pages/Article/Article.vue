<template>
  <div id="bl-article">
    <Card class="post" v-if="post">
      <article class="article">
        <div class="title">{{post.title}}</div>
        <div class="info">
          <span>{{post.posttime | parseDate}}</span>
          <!--<i class="line"></i>-->
          <span>@{{post.nickname}}</span>
        </div>
        <mavon-editor style="height: 100%" v-model="post.content" :toolbarsFlag="false" code_style="code-hybrid"
                      default_open="preview"/>
      </article>
      <div class="hiddenMask"></div>
    </Card>
    <div v-if="post">
      <Comment :author="post.nickname"></Comment>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import API from '@/config/api';
  import Comment from './Commet';

  export default {
    name: 'article',
    data() {
      return {
        post: null,
      };
    },
    computed: {
      id() {
        return this.$route.params.id;
      },
    },
    components: {
      Comment,
    },
    created() {
      this.$store.dispatch('changeHeaderName', 'ARTICLE');
      this.getArticle();
    },
    watch: {
      $route() {
        this.getArticle();
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
    methods: {
      getArticle() {
        console.log('dnsknd');
        axios.get(API.GETARTICLE, {
          params: {
            id: this.id,
          },
        }).then((response) => {
          const data = response.data;
          if (data.errorCode === '000') {
            this.post = data.data;
            console.log(this.post);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  #bl-article {
    width: 760px;
    margin: 0 auto;
    margin-bottom: 20px;
    .post {
      margin-bottom: 40px;
      min-height: 600px;
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
  #bl-article {
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
