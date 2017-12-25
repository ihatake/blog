<template>
  <div class="bl-register">
    <Card class="register-box">
      <div class="banner">
        <div class="avatar">
          <img v-if="imgSrc.length>0" :src="imgSrc"/>
          <input type="file" ref="file" class="file" @change="fileSelect"/>
          <Icon type="camera"></Icon>
        </div>
        <span class="error" v-if="showError">{{errorText}}</span>
      </div>
      <Form ref="form" class="register-form" :model="form" :label-width="80" :rules="rules">
        <Form-item label="用户名" prop="nickname">
          <Input v-model="form.nickname" size="large" placeholder="请输入" @keyup.enter.native="register('form')"
                 autofocus></Input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input v-model="form.password" type="password" size="large" placeholder="请输入"
                 @keyup.enter.native="register('form')"></Input>
        </Form-item>
        <Form-item label="验证密码" prop="passwordCheck">
          <Input v-model="form.passwordCheck" type="password" size="large" placeholder="请输入"
                 @keyup.enter.native="register('form')"></Input>
        </Form-item>
        <Form-item label="邮箱" prop="email">
          <Input v-model="form.email" size="large" placeholder="请输入" @keyup.enter.native="register('form')"></Input>
        </Form-item>
        <div class="btns-wrapper">
          <div>
            <Button type="primary" class="btn" size="large" @click="register('form')">注册</Button>
            <Spin size="small" fix v-if="spinShow"></Spin>
          </div>
          <div>
            <Button type="ghost" class="btn" size="large" @click="cancel">取消</Button>
          </div>
        </div>
      </Form>
    </Card>
    <div class="alert-wrapper">
      <Alert type="success" show-icon closable @on-close="closeAlert" v-if="showMask">
        {{successTitle}}
        <span slot="desc">{{successDesc}}</span>
      </Alert>
      <div class="mask" v-if="showMask"></div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import API from '@/config/api';

  export default {
    name: 'register',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写密码(╯▽╰)'));
        } else {
          if (value.length < 6) {
            callback(new Error('密码长度不能小于6位(╯︵╰)'));
          } else if (this.form.passwordCheck !== '') {
            this.$refs.form.validateField('passwordCheck');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入您的密码(╯▽╰)'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入的密码不一致(╯︵╰)'));
        } else {
          callback();
        }
      };
      return {
        form: {
          nickname: '',
          password: '',
          passwordCheck: '',
          email: '',
        },
        rules: {
          nickname: [
            { required: true, message: '请填写昵称 (●ﾟωﾟ●)', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请填写密码(╯▽╰)', trigger: 'blur' },
            { validator: validatePass, trigger: 'change' },
          ],
          passwordCheck: [
            { required: true, message: '请再次输入您的密码(╯▽╰)', trigger: 'blur' },
            { validator: validatePassCheck, trigger: 'change' },
          ],
          email: [
            { required: true, message: '请填写邮箱(づ｡◕‿‿◕｡)づ', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确(╯︵╰)', trigger: 'change' },
          ],
        },
        spinShow: false,
        showMask: false,
        successTitle: '',
        successDesc: '',
        T: null,
        imgSrc: '',
        showError: false,
        errorText: '请上传头像(●ﾟωﾟ●)',
      };
    },
    created() {
      this.$store.dispatch('changeHeaderName', 'REGISTER');
    },
    methods: {
      fileSelect() {
        this.showError = false;
        const file = this.$refs.file.files[0];
        if (this.$refs.file.files[0].type.indexOf('image/') === -1) {
          this.errorText = '请上传图片(●ﾟωﾟ●)';
          this.showError = true;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.imgSrc = e.target.result;
        };
      },
      register(name) {
        this.$refs[name].validate((valid) => {
          if (valid && this.$refs.file.files.length === 1 && this.$refs.file.files[0].type.indexOf('image/') !== -1) {
            this.spinShow = true;
            this.registerSubmit();
          } else if (this.$refs.file.files.length !== 1) {
            this.errorText = '请上传头像(●ﾟωﾟ●)';
            this.showError = true;
          } else if (this.$refs.file.files[0].type.indexOf('image/') === -1) {
            this.errorText = '请上传图片(●ﾟωﾟ●)';
            this.showError = true;
          }
        });
      },
      registerSubmit() {
        const formdata = new FormData();
        formdata.append('nickname', this.form.nickname);
        formdata.append('password', this.form.password);
        formdata.append('email', this.form.email);
        formdata.append('avatar', this.$refs.file.files[0]);
        console.log(formdata, API.REGISTER);
        axios.post(API.REGISTER,
          formdata,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        ).then((response) => {
          this.spinShow = false;
          const data = response.data;
          if (data.errorCode !== '000') {
            this.$store.dispatch('Message', {
              type: 'error',
              message: data.message,
            });
          } else {
            this.successTitle = data.message;
            this.$store.dispatch('changeNickname', JSON.stringify(data.data));
            let time = 3;
            this.successDesc = `将在 ${time} 秒后返回首页，也可以关闭弹框返回首页`;
            this.T = setInterval(() => {
              time -= 1;
              if (time === 0) {
                this.closeAlert();
              }
              this.successDesc = `将在 ${time} 秒后返回首页，也可以关闭弹框返回首页`;
            }, 1000);
            this.showMask = true;
          }
          console.log(response);
        }).catch((err) => {
          this.spinShow = false;
          console.log(err);
        });
      },
      cancel() {
        this.$router.go(-1);
      },
      closeAlert() {
        this.showMask = false;
        clearInterval(this.T);
        this.$router.push('/');
      },
    },
  };
</script>

<style lang="less">
  .bl-register {
    padding-top: 50px;
    .register-box {
      /*padding: 20px;*/
      width: 600px;
      margin: 0 auto;
      .ivu-card-body {
        padding: 0;
      }
      .banner {
        height: 150px;
        text-align: left;
        padding-left: 20px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        background-image: url("../../../assets/img/5.jpg");
        background-size: auto 100%;
        background-repeat: no-repeat;
        position: relative;
        span.error {
          position: absolute;
          bottom: 0px;
          left: 50%;
          transform: translateX(-50%);
          line-height: 1;
          padding-top: 6px;
          color: #ed3f14;
          font-size: 12px;
        }
        .avatar {
          border: 1px dashed #ccc;
          width: 100px;
          height: 100px;
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 100%;
          transform: translate(-50%, -50%);
          &:hover {
            border: 1px dashed #484848;
            .ivu-icon-camera {
              color: #484848;
            }
          }
          .ivu-icon-camera {
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 100%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            color: #aaa;
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
          .file {
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 100%;
            transform: translate(-50%, -50%);
            width: 30px;
            z-index: 1;
            opacity: 0;
            cursor: pointer;
          }
        }
        /*img {*/
        /*height: 100%;*/
        /*}*/
      }
      .register-form {
        padding: 20px 50px;
        .btns-wrapper {
          padding-left: 80px;
          display: flex;
          & > div {
            width: 40%;
            margin-bottom: 24px;
            margin-left: 10px;
            margin-right: 10px;
            position: relative;
          }
          .btn {
            width: 100%;
          }
        }
      }
      .ivu-form .ivu-form-item-label {
        font-size: 14px;
      }
    }

    .alert-wrapper {
      .ivu-alert {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        z-index: 2;
        .ivu-alert-desc {
          text-align: center;
        }
      }
      .mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.25);
        z-index: 1;
      }
    }

  }
</style>

