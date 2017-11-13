<template>
  <div class="pagination">
    <div class="prev">
      <Icon type="chevron-left"></Icon>
      <span>Previous</span>
    </div>
    <div class="next">
      <span>Next</span>
      <Icon type="chevron-right"></Icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pagination',
    data() {
      return {};
    },
  };
</script>

<style lang="less" scoped>
  .pagination {
    height: 30px;
    line-height: 30px;
    .prev, .next {
      padding: 0 12px;
      cursor: pointer;
      &:hover {
        background-color: #222;
        color: #fff;
      }
    }
    .prev {
      float: left;
    }
    .next {
      float: right;
    }
  }
</style>
