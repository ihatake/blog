<template>
  <aside class="aside">
    <div class="about-me">
      <div class="avatar">
        <img :src="require('@/assets/logo.png')"/>
        <div class="info">
          <a href="#">
            喵喵
          </a>
        </div>
        <div class="info">
          <span>
            balabala....
          </span>
        </div>
      </div>
    </div>
    <div class="menu">
      <ul>
        <li><a href="#/">主页</a></li>
        <li><a href="#/post">发布</a></li>
        <li><a href="#">存档</a></li>
        <li><a href="#">关于</a></li>
      </ul>
    </div>
  </aside>
</template>

<script>
  export default {
    name: '',
    data() {
      return {};
    },
  };
</script>

<style lang="less" scoped>
  .aside {
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
        &:nth-of-type(odd) {
          float: left;
        }
        &:nth-of-type(even) {
          float: right;
        }
      }
      a {
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
