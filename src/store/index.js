import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isShowAside: false,
  },
  getters: {
    getIsShowAside: state => state.isShowAside,
  },
  mutations: {
    changeShowAside(state, bl) {
      const State = state;
      State.isShowAside = bl;
    },
  },
  actions: {
    changeShowAside({ commit }, bl) {
      commit('changeShowAside', bl);
    },
  },
});

