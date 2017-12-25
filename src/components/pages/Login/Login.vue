<template>
  <div class="bl-login">
    <Card class="login-box">
      <div class="banner">
        <img src="../../../assets/img/1.jpg"/>
      </div>
      <Form ref="form" class="login-form" :model="form" :rules="rules" :label-width="80">
        <Form-item label="邮箱" prop="email">
          <Input v-model="form.email" size="large" placeholder="请输入" @keyup.enter.native="login('form')"
                 autofocus></Input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input v-model="form.password" size="large" type="password" placeholder="请输入"
                 @keyup.enter.native="login('form')"></Input>
        </Form-item>
        <div class="btns-wrapper">
          <div>
            <Button type="primary" class="btn" size="large" @click="login('form')">登录</Button>
            <Spin size="small" fix v-if="spinShow"></Spin>
          </div>
          <div>
            <Button type="ghost" class="btn" size="large" @click="cancel">取消</Button>
          </div>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script>
  import axios from 'axios';
  import API from '@/config/api';

  export default {
    name: 'login',
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
        rules: {
          email: [
            { required: true, message: '请填写邮箱(づ｡◕‿‿◕｡)づ', trigger: 'blur' },
            { type: 'email', message: '邮箱格式不正确(╯︵╰)', trigger: 'change' },
          ],
          password: [
            { required: true, message: '请填写密码(╯▽╰)', trigger: 'blur' },
            { type: 'string', min: 6, message: '密码长度不能小于6位(╯︵╰)', trigger: 'change' },
          ],
        },
        spinShow: false,
      };
    },
    created() {
      this.$store.dispatch('changeHeaderName', 'LOGIN');
    },
    methods: {
      login(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            this.loginSubmit();
          }
        });
      },
      loginSubmit() {
        axios.post(API.LOGIN, {
          email: this.form.email,
          password: this.form.password,
        }).then((response) => {
          this.spinShow = false;
          const data = response.data;
          if (data.errorCode !== '000') {
            this.$store.dispatch('Message', {
              type: 'error',
              message: data.message,
            });
          } else {
            this.$store.dispatch('changeNickname', JSON.stringify(data.data));
            const redirect = this.$route.query.redirect;
            console.log(redirect);
            if (redirect) {
              this.$router.push(redirect);
            } else {
              this.$router.push('/home');
            }
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
    },
  };
</script>

<style lang="less">
  .bl-login {
    padding-top: 50px;
    .login-box {
      /*padding: 20px;*/
      width: 600px;
      height: 400px;
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
        img {
          height: 100%;
        }
      }
      .login-form {
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
  }
</style>

