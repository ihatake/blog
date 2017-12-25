<template>
  <div id="app">
    <div class="content">
      <t-header></t-header>
      <router-view/>
      <div class="overlay" v-if="isShow" @click="closeAside"></div>
    </div>
    <transition name="slide">
      <div class="side" v-if="isShow">
        <t-aside></t-aside>
      </div>
    </transition>
    <Message></Message>
    <BackTop></BackTop>
  </div>
</template>

<script>
//  import axios from 'axios';
//  import API from '@/config/api';
  import THeader from '@/components/slots/Header';
  import TAside from '@/components/slots/Aside';
  import Message from '@/components/slots/Message';

  export default {
    name: 'app',
    data() {
      return {};
    },
    computed: {
      isShow() {
        return this.$store.getters.getIsShowAside;
      },
    },
    components: {
      THeader,
      TAside,
      Message,
    },
    created() {
      this.getUserName();
    },
    methods: {
      closeAside() {
        this.$store.dispatch('changeShowAside', false);
      },
      getUserName() {
//        sessionStorage.removeItem('nickname');
//        axios.get(API.GETUSERNAME).then((response) => {
//          const data = response.data;
//          this.$store.dispatch('changeNickname', data.data.nickname || '');
//        }).catch((err) => {
//          console.log(err);
//        });
      },
    },
  };
</script>

<style lang="less">
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: #fff;
    color: #414141;
    min-height: 100vh;
    font-size: 12px;
    position: relative;
    display: flex;
  }

  .content {
    flex: 1;
    position: relative;
  }

  .side {
    width: 260px;
    position: relative;
    @media (max-width: 820px) {
      width: 200px;
    }
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
    transition: all .24s ease;
    z-index: 20;
  }

  @font-face {
    font-family: 'GALLA';
    src: url('./assets/font/GALLA_.ttf');
  }

  .slide-enter-active {
    animation: slide-in .5s;
  }

  .slide-leave-active {
    animation: slide-in .5s reverse;
  }

  @keyframes slide-in {
    0% {
      width: 0px;
    }
    100% {
      width: 260px;
    }
  }


</style>
