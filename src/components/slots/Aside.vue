<template>
  <aside class="aside">
    <div class="about-me">
      <div class="avatar">
        <img :src="avatar"/>
        <div class="info">
          <a href="javascript:void(0)" @click="goto('/home')" v-if="isLogin">
            {{nickName}}
          </a>
          <a href="javascript:void(0)" @click="goto('/login')" v-if="!isLogin">
            登录
          </a>
        </div>
        <div class="info">
          <span>
            <!--balabala....-->
          </span>
        </div>
      </div>
    </div>
    <div class="menu">
      <ul>
        <li @click="goto(`/home?p=1`)"><span>首页</span></li>
        <li v-if="isLogin" @click="goto(`/blogs/${nickName}`)"><span>我的博客</span></li>
        <li v-if="isLogin" @click="goto('/post')"><span>发布</span></li>
        <li v-if="isLogin" @click="logout"><span>注销</span></li>
        <li @click="goto('/about')"><span>关于网站</span></li>
      </ul>
    </div>
  </aside>
</template>

<script>
  import axios from 'axios';
  import API from '@/config/api';

  export default {
    name: '',
    data() {
      return {};
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickname;
      },
      isLogin() {
        return this.$store.getters.isLogin;
      },
      avatar() {
        return this.$store.getters.avatar;
      },
    },
    methods: {
      goto(path) {
        this.$router.push(path);
        this.$store.dispatch('changeShowAside', false);
      },
      logout() {
        axios.get(API.LOGOUT).then((response) => {
          const data = response.data;
          if (data.errorCode === '000') {
            this.$store.dispatch('changeNickname', '{}');
            this.$router.push('/login');
            this.$store.dispatch('changeShowAside', false);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .aside {
    position: absolute;
    z-index: 20;
    height: 100%;
    width: 100%;
    background-image: url(../../assets/aside.png);
    background-repeat: repeat;
    background-size: 102px 102px;
    padding-top: 20px;
    .about-me {
      width: 80%;
      margin: 0 auto;
      height: 200px;
      background: rgba(0, 0, 0, .1);
      border: 1px solid #262626;
      transition: background .24s, border-color .24s;
      .avatar {
        width: 96px;
        height: 96px;
        margin: 4px auto;
        background: rgba(0, 0, 0, .3);
        border-radius: 50%;
        border: 1px solid #000;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        margin: 10px;
        color: #a9a9a9;
        a {
          display: inline-block;
          padding: 5px 15px;
          background: rgba(0, 0, 0, .3);
          border: 1px solid #000;
          text-align: center;
          color: #c2c2c2;
          &:hover {
            background-color: #009688;
            color: #f5f5f5;
          }
        }
      }
    }
    .menu {
      width: 80%;
      margin: 0 auto;
      li {
        width: calc(~"50% - 5px");
        margin-bottom: 5px;
        margin-top: 15px;
        display: inline-block;
        cursor: pointer;
        &:nth-of-type(odd) {
          float: left;
        }
        &:nth-of-type(even) {
          float: right;
        }
      }
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        background: rgba(0, 0, 0, .3);
        border: 1px solid #000;
        text-align: center;
        color: #c2c2c2;
        &:hover {
          background-color: #009688;
          color: #f5f5f5;
        }
      }
    }
  }
</style>
