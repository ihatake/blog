<template>
  <div id="Message" :class="config.type" :style="{ top: config.top+'px' }" v-if="config.showMessage">
    <Icon :type="config.type | iconType" class="type-icon"></Icon>
    <p>{{config.message}}</p>
    <Icon type="close-round" v-if="config.showClose" @click.native="close"></Icon>
  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {};
    },
    computed: {
      config() {
        return this.$store.getters.getConfig;
      },
    },
    filters: {
      iconType(value) {
        let newValue = '';
        switch (value) {
          case 'info':
            newValue = 'information-circled';
            break;
          case 'success':
            newValue = 'checkmark-circled';
            break;
          case 'warn':
            newValue = 'android-warning';
            break;
          case 'error':
            newValue = 'close-circled';
            break;
          default:
            newValue = 'information-circled';
            break;
        }
        return newValue;
      },
    },
    created() {
//      console.log(this.config);
    },
    methods: {
      close() {
        this.$store.dispatch('setShowStatus', false);
      },
    },
  };
</script>

<style lang="less">
  #Message {
    z-index: 18;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 100px;
    min-width: 380px;
    border-width: 1px;
    border-style: solid;
    transition: opacity .3s, transform .4s;
    padding: 15px 15px 15px 20px;
    align-items: center;

    border-radius: 4px;
    display: flex;
    font-size: 14px;
    .type-icon {
      font-size: 18px;
      width: 20px;
      margin-right: 10px;
    }
    .ivu-icon-close-round {
      font-size: 14px;
      color: #b4bccc;
      cursor: pointer;
    }
    & > p {
      flex: 1;
      text-align: left;
    }
    &.error {
      background-color: #fee;
      border-color: #fedddd;
      .type-icon {
        color: #fa5555;
      }
      p {
        color: #fa5555;
      }
    }
    &.info {
      background-color: #edf2fc;
      border-color: #e6ebf5;
      .type-icon {
        color: #878d99;
      }
      p {
        color: #878d99;
      }
    }
    &.success {
      background-color: #f0f9eb;
      border-color: #e1f3d8;
      .type-icon {
        color: #67c23a;
      }
      p {
        color: #67c23a;
      }
    }
    &.warn {
      background-color: #fdf5e6;
      border-color: #fbeccd;
      .type-icon {
        color: #eb9e05
      }
      p {
        color: #eb9e05;
      }
    }
  }
</style>
