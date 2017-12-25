export default {
  state: {
    headerName: '',
    isShowAside: false,
    isShowAsideIcon: true,
  },
  getters: {
    getIsShowAside: state => state.isShowAside,
    getIsShowAsideIcon: state => state.isShowAsideIcon,
    getHeaderName: state => state.headerName,
  },
  mutations: {
    changeShowAside(state, bl) {
      const State = state;
      State.isShowAside = bl;
    },
    changeShowAsideIcon(state, bl) {
      const State = state;
      State.isShowAsideIcon = bl;
    },
    changeHeaderName(state, name) {
      const State = state;
      State.headerName = name;
    },
  },
  actions: {
    changeShowAside({ commit }, bl) {
      commit('changeShowAside', bl);
    },
    changeShowAsideIcon({ commit }, bl) {
      commit('changeShowAsideIcon', bl);
    },
    changeHeaderName({ commit }, name) {
      commit('changeHeaderName', name);
    },
  },
};
