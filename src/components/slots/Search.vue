<template>
  <div class="search">
    <input type="text" v-model="key" class="search-input" placeholder="喵喵喵?" @keyup.enter="search"/>
    <Icon type="search" class="search-icon"></Icon>
  </div>
</template>

<script>
  export default {
    name: 'search',
    data() {
      return {
        key: '',
      };
    },
    methods: {
      search() {
        this.$router.push({
          path: '/search',
          query: { key: this.key, p: 1 },
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .search {
    margin: 10px 0 20px 0;
    position: relative;
    .search-input {
      width: 100%;
      padding: 0 10px;
      line-height: 36px;
      height: 36px;
      font-size: 12px;
      background-color: #414141;
      color: #fff;
      border: none;
      outline: 0;
      &:focus {
        background-color: #000;
        border-color: #000;
      }
    }
    .search-icon {
      position: absolute;
      right: 10px;
      font-size: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #fff;
    }
  }
</style>
