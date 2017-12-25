<template>
  <div id="bl-blog-list">
    <div v-if="list.length===0" class="noData">
      <p>空的诶~</p>
      <img :src="require('@/assets/img/4.jpg')" alt="">
    </div>
    <Card v-for="(item,index) in list" :key="index" class="post" @click.native="goToArticle(item._id)">
      <article class="article">
        <div class="title">{{item.title}}</div>
        <div class="info">
          <span>{{item.posttime | parseDate}}</span>
          <span>@{{item.nickname}}</span>
        </div>
        <mavon-editor style="height: 100%" v-model="item.content" :toolbarsFlag="false" code_style="code-hybrid"
                          default_open="preview"/>
      </article>
      <div class="hiddenMask"></div>
    </Card>
  </div>
</template>

<script>
  export default {
    name: 'article-list',
    props: {
      list: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {};
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
      goToArticle(id) {
        this.$router.push(`/article/${id}`);
      },
    },
  };
</script>

<style lang="less">
  #bl-blog-list {
    position: relative;
    min-height: 300px;
    .noData {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        height: 260px;
      }
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
