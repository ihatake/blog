<template>
  <div id="bl-commet">
    <div class="commet-header">
      评论区
    </div>
    <div class="commet-content">
      <div class="comment-edit-container">
        <div class="commet-user">
          <img :src="avatar"/>
        </div>
        <div class="comment-edit">
          <textarea class="comment-textarea" v-model="comment" :disabled="!isLogin" :rows="4" placeholder=""></textarea>
          <a href="/login" v-if="!isLogin" class="tip">登录</a>
        </div>
      </div>
      <div class="comment-publish">
        <Button type="primary" shape="circle" @click="publish">发表</Button>
      </div>
      <div class="allcomment">
        <div class="allcomment-header">全部评论</div>
        <div class="comment-item" v-for="(item,index) in commentLits" :key="index">
          <div class="comment-item-user">
            <img :src="item.user.avatar"/>
            <div class="comment-item-info">
              <div class="comment-item-name">{{item.nickname}}
                <span v-if="item.nickname===author"
                      style="margin: 0 5px;font-size: 14px;color: #969696;">(作者)</span>
              </div>
              <div class="comment-item-time">{{index + 1}}楼 · {{item.posttime}}</div>
            </div>
          </div>
          <div class="comment-item-content">{{item.content}}</div>
          <div class="comment-item-operation">
            <span @click="praise(item._id)" :class="item.praise.indexOf(nickName)!==-1?'touched':''">
              <Icon type="thumbsup"></Icon>{{item.praise.length > 0 ? `${item.praise.length}人` : ''}}赞</span>
            <span @click="showReplay(index)">
              <Icon type="ios-chatbubble-outline"></Icon>{{item.replayList.length > 0 ? `${item.replayList.length}个` : ''}}回复
            </span>
          </div>
          <div class="comment-item-reply">
            <div class="comment-item-replylist">
              <ul>
                <li v-for="(it,i) in item.replayList">
                  <span class="highlightA">{{it.nickname}}</span>：
                  {{it.content}}
                  <p class="comment-item-time">
                    <span>{{it.posttime}}</span>
                    <span @click="childReplay(it.nickname,`input${item._id}`,index)" style="cursor: pointer">
                      <Icon type="ios-chatbubble-outline"></Icon>回复
                    </span>
                  </p>
                </li>
              </ul>
              <span class="comment-item-more" v-if="item.replayList.length>showReplayNum" @click="showAllReplay(index,$event)">
              展开回复>>
              </span>
            </div>
            <div class="comment-item-replyedit">
              <div class="comment-item-editinfo">
                <span>
                  <Icon type="comment-item-edit"></Icon>
                  添加新评论
                </span>
              </div>
              <div class="comment-item-editTextarea">
                <textarea class="comment-textarea" :rows="4" :ref="`input${item._id}`"></textarea>
                <div class="comment-item-publish">
                  <span class="comment-item-cancel" @click="closeReplay(index)">取消</span>
                  <Button type="primary" shape="circle" @click="replay(item._id,`input${item._id}`)">发表</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import axios from 'axios';
  import API from '@/config/api';

  export default {
    name: '',
    props: {
      author: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        comment: '',
        currentPage: 1,
        pageSize: 20,
        total: 0,
        commentLits: [],
        showReplayNum: 2,
      };
    },
    computed: {
      avatar() {
        return this.$store.getters.avatar;
      },
      isLogin() {
        return this.$store.getters.isLogin;
      },
      nickName() {
        return this.$store.getters.getNickname;
      },
    },
    created() {
      this.getComment();
    },
    methods: {
      getComment() {
        axios.get(API.GETCOMMENT, {
          params: {
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            postid: this.$route.params.id,
          },
        }).then((response) => {
          const data = response.data;
          if (data.errorCode !== '000') {
            this.$store.dispatch('Message', {
              type: 'error',
              message: data.message,
            });
          } else {
            this.commentLits = data.data;
            this.$nextTick(() => {
              $(`.comment-item-reply li:nth-of-type(n+${this.showReplayNum + 1})`).hide();
              $('.comment-item-replyedit').hide();
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      publish() {
        if (this.comment.trim().length > 0) {
          this.publishSubmit();
        }
      },
      publishSubmit() {
        axios.post(API.POSTCOMMENT, {
          comment: this.comment,
          postid: this.$route.params.id,
        }).then((response) => {
          const data = response.data;
          if (data.errorCode !== '000') {
            this.$store.dispatch('Message', {
              type: 'error',
              message: data.message,
            });
          } else {
            this.$store.dispatch('Message', {
              type: 'success',
              showClose: false,
              duration: 1000,
              message: data.message,
            });
            this.comment = '';
            this.getComment();
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      praise(id) {
        axios.post(API.PRAISECOMMENT, {
          postid: id,
        }).then((response) => {
          const data = response.data;
          if (data.errorCode === '000') {
            this.getComment();
          }
        }).catch((err) => {
          console.log(err);
        });
        console.log(id);
      },
      replay(id, elname, at) {
        axios.post(API.REPLAYCOMMENT, {
          parentid: id,
          at: at || '',
          content: this.$refs[elname][0].value,
        }).then((response) => {
          const data = response.data;
          this.$refs[elname][0].value = '';
          if (data.errorCode === '000') {
            this.getComment();
          }
        }).catch((err) => {
          console.log(err);
        });
        console.log(id);
      },
      showReplay(index) {
        $(`.comment-item-replyedit:not(:eq(${index}))`).hide();
        $(`.comment-item-replyedit:eq(${index})`).toggle().find('textarea').focus();
      },
      closeReplay(index) {
        $(`.comment-item-replyedit:eq(${index})`).hide();
      },
      childReplay(name, elname, index) {
        this.showReplay(index);
        this.$refs[elname][0].value = `@${name} `;
      },
      showAllReplay(index, $event) {
        if ($(`.comment-item-reply:eq(${index})`).find('li:hidden').length === 0) {
          $($event.currentTarget).text('展开回复>>');
          $(`.comment-item-reply:eq(${index})`).find(`li:nth-of-type(n+${this.showReplayNum + 1})`).hide();
        } else {
          $($event.currentTarget).text('收起回复');
          $(`.comment-item-reply:eq(${index})`).find('li').show();
        }
      },
    },
  };
</script>

<style lang="less">
  #bl-commet {
    padding: 10px 0;
    .commet-header {
      line-height: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ccc;
      text-align: left;
      font-size: 16px;
      font-weight: bolder;
    }
    .comment-textarea{
      resize: none;
      display: inline-block;
      width: 100%;
      position: relative;
      vertical-align: middle;
      cursor: text;
      transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      border: 1px solid #dddee1;
      border-radius: 4px;
      color: #495060;
      background-color: #fff;
      background-image: none;
      line-height: 1.5;
      padding: 4px 7px;
      &:focus {
        border-color: #33aba0;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(0, 150, 136, 0.2);
      }
    }
    .comment-edit-container {
      margin: 10px 0;
      align-items: center;
      display: flex;
      .commet-user {
        width: 70px;
        text-align: left;
        img {
          width: 50px;
          height: 50px;
          border-radius: 100%;
          border: 1px solid #ccc;
        }
      }
      .comment-edit {
        flex: 1;
        position: relative;
        .tip {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .comment-publish {
      &:after {
        content: '';
        clear: both;
        display: block;
      }
      .ivu-btn {
        float: right;
      }
    }
    .allcomment {
      .ivu-icon {
        margin-right: 5px;
      }
      .allcomment-header {
        line-height: 30px;
        border-bottom: 1px solid #ccc;
        text-align: left;
        font-size: 16px;
        font-weight: bolder;
        padding-bottom: 20px;
      }
      .comment-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin: 10px 0;
        align-items: center;
        border-bottom: 1px solid #ccc;
        & > div {
          text-align: left;
          width: 100%;
        }
      }
      .comment-item-user {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        img {
          background-image: url("../../../assets/img/5.jpg");
        }
      }
      .comment-item-content {
        font-size: 15px;
        color: #000;
        margin: 10px 0;
      }
      .comment-item-operation {
        color: #969696;
        margin-bottom: 10px;
        .touched {
          color: #049588;
        }
        span {
          margin-right: 10px;
          font-size: 14px;
          cursor: pointer;
          .ivu-icon {
            font-size: 18px;
          }
          &:hover {
            font-weight: 600;
            .ivu-icon {
              font-weight: 600;
            }
          }
        }
      }
      .comment-item-reply {
        margin-top: 10px;
        /*padding: 5px 0 5px 20px;*/
        margin-bottom: 10px;
        border-left: 2px solid #d9d9d9;
        font-size: 14px;
        & > div {
          margin-left: 20px;
        }
        .comment-item-replylist {
          li {
            margin: 15px 0;
            .highlightA {
              color: #3194d0;
            }
            .comment-item-time {
              color: #aaa;
              font-size: 12px;
              margin-top: 10px;
              & > span {
                margin-right: 10px;
              }
              .ivu-icon {
                font-size: 16px;
              }
            }
          }
        }
        .comment-item-more {
          font-size: 12px;
          color: #3194d0;
          cursor: pointer;
        }
        .comment-item-replyedit {
          textarea {
            resize: none;
            margin-bottom: 10px;
          }
        }
        .comment-item-editinfo {
          margin-bottom: 10px;
          color: #969696;
        }
        .comment-item-publish {
          text-align: right;
          .comment-item-cancel {
            margin-right: 20px;
            color: #d9d9d9;
            &:hover {
              color: #2f2f2f;
            }
          }
        }
      }
      .comment-item-info {
        margin-left: 10px;
        .comment-item-name {
          font-size: 15px;
          font-weight: 600;
        }
        .comment-item-time {
          color: #aaa;
        }
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        border: 1px solid #ccc;
      }
    }
  }
</style>
