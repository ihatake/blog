<template>
  <div class="pagination">
    <div class="prev" :class="currentPage<=1?'disable':'able'" @click="pre">
      <Icon type="chevron-left"></Icon>
      <span>Previous</span>
    </div>
    <div class="next" :class="currentPage>=pagesTotal?'disable':'able'" @click="next">
      <span>Next</span>
      <Icon type="chevron-right"></Icon>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pagination',
    props: {
      total: {
        type: Number,
        required: true,
      },
      currentPage: {
        type: Number,
        required: true,
      },
      pageSize: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
//        pagesTotal: Math.ceil(this.total / this.pageSize),
      };
    },
    computed: {
      pagesTotal() {
        return Math.ceil(this.total / this.pageSize);
      },
    },
    created() {
      console.log(this.total, this.pageSize, this.pagesTotal);
    },
    methods: {
      pre() {
        if (this.currentPage > 1) {
          this.$emit('pre', (this.currentPage - 1));
        }
      },
      next() {
        if (this.currentPage < this.pagesTotal) {
          this.$emit('next', (this.currentPage + 1));
        }
      },
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
      &.able:hover {
        background-color: #222;
        color: #fff;
      }
      &.disable {
        color: #ccc;
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
