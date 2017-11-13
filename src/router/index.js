import Vue from 'vue';
import Router from 'vue-router';
import Page from '@/components/pages/Page';
import Article from '@/components/pages/Article';
import Post from '@/components/pages/Post';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/page/1',
    },
    {
      path: '/page/:currentPage',
      name: 'page',
      component: Page,
    },
    {
      path: '/article/:id',
      name: 'article',
      component: Article,
    },
    {
      path: '/post',
      name: 'post',
      component: Post,
    },
  ],
});
