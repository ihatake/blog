import Vue from 'vue';
import Vuex from 'vuex';

import layoutStore from '@/store/layoutStore';
import messageStore from '@/store/messageStore';
import infoStore from '@/store/infoStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    layoutStore,
    messageStore,
    infoStore,
  },
});

