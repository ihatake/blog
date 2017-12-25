import Vue from 'vue';
import Router from 'vue-router';
import Blog from '@/components/pages/Page/Blog';
import Article from '@/components/pages/Article/Article';
import Post from '@/components/pages/Post/Post';
import Login from '@/components/pages/Login/Login';
import Register from '@/components/pages/Login/Register';
import Home from '@/components/pages/Home/index';
import About from '@/components/pages/About/index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/blogs/:nickname',
      name: 'blogs',
      component: Blog,
    },
    {
      path: '/welcome',
      name: 'page',
      component: Blog,
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
      meta: {
        requireAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
  ],
});
