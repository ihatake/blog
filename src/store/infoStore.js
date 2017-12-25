export default {
  state: {
    info: '{}',
    storageNickName: sessionStorage.getItem('info'),
  },
  getters: {
    getNickname: state => JSON.parse(state.info).nickname,
    avatar: state => JSON.parse(state.info).avatar || 'http://p0jokceq3.bkt.clouddn.com/avatar.png',
    isLogin: (state) => {
      console.log(JSON.parse(state.info));
      if (!(JSON.parse(state.info).nickname)) {
        return false;
      }
      return true;
    },
  },
  mutations: {
    changeNickname(state, info) {
      const State = state;
      State.info = info;
      sessionStorage.removeItem('info');
      if (!(JSON.parse(state.info).nickname)) {
        sessionStorage.removeItem('info');
        State.storageNickName = '{}';
      } else {
        sessionStorage.setItem('info', info);
        State.storageNickName = info;
      }
    },
  },
  actions: {
    changeNickname({ commit }, info) {
      commit('changeNickname', info);
    },
  },
};
