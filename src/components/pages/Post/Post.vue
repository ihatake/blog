<template>
  <div class="bl-post">
    <div class="post-content">
      <div class="row-wrapper">
        <span>文章标题：</span>
        <div><Input size="large" placeholder="请输入标题" v-model="title"/></div>
      </div>
      <div class="row-wrapper">
        <span>文章内容：</span>
        <div>
          <div id="editor">
            <mavon-editor ref="md" style="height: 100%" v-model="content" :ishljs="ishljs" code_style="code-hybrid"
                          :toolbars="toolbars"
                          placeholder="文章开始编辑..."
                          @imgAdd="$imgAdd" @imgDel="$imgDel"/>
          </div>
        </div>
      </div>
    </div>
    <Icon type="paper-airplane" class="post-icon" @click.native="post"></Icon>
    <Modal v-model="modal" width="360" class="post-modal">
      <p slot="header" style="color:#009688;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>发布这篇博客？</span>
      </p>
      <div style="text-align:center">
        <p>发布后你将在首页看见它</p>
        <p>确定发布?</p>
      </div>
      <div slot="footer">
        <Button class="post-bnt" size="large" long :loading="modal_loading" @click="postSubmit">发布</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import API from '@/config/api';

  export default {
    name: 'post',
    data() {
      return {
        content: '',
        ishljs: false,
        modal: false,
        modal_loading: false,
        title: '',
        img_file: {},
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
//          htmlcode: true, // 展示html源码
          /* 1.3.5 */
//          undo: true, // 上一步
//          redo: true, // 下一步
          trash: true, // 清空
//          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },
      };
    },
    created() {
      this.$store.dispatch('changeHeaderName', 'POST');
    },
    mounted() {
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickname;
      },
    },
    methods: {
      clickPostIcon() {

      },
      post() {
        if (this.title.trim().length < 1) {
          this.$store.dispatch('Message', {
            type: 'error',
            message: '需要填文章标题',
          });
        } else if (this.content.trim().length < 1) {
          this.$store.dispatch('Message', {
            type: 'error',
            message: '需要填文章内容不能为空',
          });
        } else {
          this.modal = true;
        }
      },
      async postSubmit() {
        this.modal = false;
        this.uploadimg();
      },
      postContent() {
        axios.post(API.POST, {
          title: this.title,
          content: this.content,
        }).then((response) => {
          const data = response.data;
          if (data.errorCode !== '000') {
            this.$store.dispatch('Message', {
              type: 'error',
              message: data.message,
              duration: 1000,
              showClose: false,
            });
          } else {
            const that = this;
            this.$store.dispatch('Message', {
              type: 'success',
              message: data.message,
              duration: 1000,
              showClose: false,
              cb() {
                that.$router.push({
                  path: `/blogs/${that.nickName}`,
                  query: {
                    p: 1,
                  },
                });
              },
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      $imgAdd(pos, $file) {
        this.img_file[pos] = $file;
      },
      $imgDel(pos) {
        delete this.img_file[pos];
      },
      uploadimg() {
        const formdata = new FormData();
        Object.keys(this.img_file).forEach((img) => {
          formdata.append(img, this.img_file[img]);
        });
        axios({
          url: API.POSTIMAGE,
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then((response) => {
          const data = response.data;
          if (data.errorCode === '000') {
            data.data.forEach((item) => {
              this.$refs.md.$img2Url(item.pos, item.key);
            });
            console.log(this.content);
            this.$nextTick(() => {
              console.log(this.content);
              this.postContent();
            });
            console.log('ndsd');
          }
        });
      },
    },
  };
</script>

<style lang="less">
  .bl-post {
    width: 100%;
    .post-content {
      margin: auto;
      #editor {
        width: 100%;
        height: calc(~"100vh - 100px");
        text-align: left;
        .v-note-wrapper {
          z-index: 8;
        }
        .v-note-edit, .v-note-show {
          word-break: break-all;
        }
      }
      .row-wrapper {
        width: 80%;
        margin: auto;
        display: flex;
        & > span {
          width: 80px;
          font-size: 14px;
          line-height: 36px;
        }
        & > div {
          flex: 1;
        }
        margin-bottom: 20px;
      }
    }
    .post-icon {
      position: absolute;
      right: 5%;
      top: 85%;
      font-size: 38px;
      cursor: pointer;
      color: #000;
      &:hover {
        color: #009688;
      }
    }
  }
</style>
<style lang="less">
  .post-modal {
    .ivu-modal-mask, .ivu-modal-wrap {
      z-index: 9;
    }
    .post-bnt {
      background-color: #009688;
      color: #fff;
    }
  }
</style>

