// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import iView from 'iview';
// import 'iview/dist/styles/iview.css';
import '@/assets/my-theme/index.less';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import API from '@/config/api';

Vue.use(mavonEditor);

Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(iView);

router.beforeEach(async (to, from, next) => {
  iView.LoadingBar.start();
  console.log(to.meta.requireAuth);
  await axios.get(API.GETUSERNAME).then((response) => {
    const data = JSON.parse(response.data.data);
    store.dispatch('changeNickname', JSON.stringify(data));
    const isLogin = !!data.nickname;
    if (isLogin || !to.meta.requireAuth) {
      console.log('login or don\'t need auth');
      next();
    } else {
      console.log('not login');
      next({
        path: '/login',
        query: { redirect: to.fullPath },  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  }).catch((err) => {
    console.log(err);
    if (to.meta.requireAuth) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    } else {
      next();
    }
  });
});

router.afterEach(() => {
  iView.LoadingBar.finish();
});

axios.defaults.timeout = 2500;
axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
