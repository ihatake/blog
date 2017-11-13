<template>
  <div class="header">
    <div :class="isShow ? 'sidebar-close' : 'sidebar-toggle'" @click="toggleAside">
      <div class="sidebar-toggle-line-wrap">
        <span class="sidebar-toggle-line sidebar-toggle-line-first"></span>
        <span class="sidebar-toggle-line sidebar-toggle-line-middle"></span>
        <span class="sidebar-toggle-line sidebar-toggle-line-last"></span>
      </div>
    </div>
    <a href="/" class="logo">
      <div>{{name}}</div>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'header',
    data() {
      return {
        name: 'XIAOXUA',
      };
    },
    computed: {
      isShow() {
        return this.$store.getters.getIsShowAside;
      },
    },
    methods: {
      toggleAside() {
        if (this.isShow) {
          this.$store.dispatch('changeShowAside', false);
        } else {
          this.$store.dispatch('changeShowAside', true);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .header {
    height: 66px;
    width: 100%;
    box-shadow: 0 0 3px rgba(0, 0, 0, .1);
    border-bottom: 1px solid #e1e2e3;
    background-color: #ffffff;
    border-top: 2px solid #000;
    position: relative;
    margin-bottom: 20px;
  }

  .logo {
    position: absolute;
    display: block;
    top: 0;
    left: 50%;
    margin-left: -75px;
    width: 150px;
    height: 76px;
    background-color: #000;
    padding: 10px 0 12px 0;
    transition: all .24s;
    text-align: center;
    color: #fff;
    font-size: 24px;
    font-family: 'GALLA';
    @media (max-width: 820px) {
      height: 66px;
    }
  }

</style>
<style lang="less">
  .header {

    .sidebar-toggle, .sidebar-close {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
      bottom: 45px;
      width: 14px;
      height: 14px;
      padding: 5px;
      background-color: #222;
      line-height: 0;
      z-index: 1050;
      cursor: pointer;
      &, & * {
        box-sizing: content-box;
      }
    }
    .sidebar-toggle-line {
      position: relative;
      display: inline-block;
      vertical-align: top;
      height: 2px;
      width: 100%;
      background-color: #fff;
      margin-top: 3px;
      transition: all 0.3s ease-in;
    }
    .sidebar-toggle-line:first-child {
      margin-top: 0;
    }
    .sidebar-toggle {
      .sidebar-toggle-line-first {
        width: 100%;
        top: 0px;
        left: 0px;
        transform: rotateZ(0deg);
        opacity: 1;
      }
      .sidebar-toggle-line-middle {
        width: 100%;
        opacity: 1;
        left: 0px;
        top: 0px;
        transform: rotateZ(0deg);
      }
      .sidebar-toggle-line-last {
        width: 100%;
        top: 0px;
        left: 0px;
        transform: rotateZ(0deg);
        opacity: 1;
      }
      &:hover .sidebar-toggle-line-first {
        width: 50%;
        top: 2px;
        left: -3px;
        transform: rotateZ(-45deg);
        opacity: 1;
      }
      &:hover .sidebar-toggle-line-middle {
        width: 90%;
        top: 0px;
        left: 0px;
        transform: rotateZ(0deg);
        opacity: 1;
      }
      &:hover .sidebar-toggle-line-last {
        width: 50%;
        top: -2px;
        left: -3px;
        transform: rotateZ(45deg);
        opacity: 1;
      }
    }
    .sidebar-close {
      .sidebar-toggle-line-first {
        width: 100%;
        top: 5px;
        transform: rotateZ(-45deg);
        opacity: 1;
        left: 0px;
      }
      .sidebar-toggle-line-middle {
        width: 90%;
        opacity: 0;
        left: 0px;
        top: 0px;
        transform: rotateZ(0deg);
      }
      .sidebar-toggle-line-last {
        width: 100%;
        top: -5px;
        transform: rotateZ(45deg);
        opacity: 1;
        left: 0px;
      }
    }
  }
</style>
