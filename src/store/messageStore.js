function init(state) {
  const State = state;
  State.top = 50;
  State.message = '';
  State.type = 'info';
  State.duration = 3000;
  State.showClose = true;
  State.showMessage = false;
  State.showT = null;
  State.closeT = null;
}

export default {
  state: {
    top: 50,
    message: '',
    type: 'info',
    duration: 3000,
    showClose: true,
    showMessage: false,
    showT: null,
    closeT: null,
  },
  getters: {
    getConfig: (state) => {
      const config = {
        top: state.top,
        message: state.message,
        type: state.type,
        duration: state.duration,
        showClose: state.showClose,
        showMessage: state.showMessage,
      };
      return config;
    },
  },
  mutations: {
    Message(state, config) {
      const State = state;
      State.showMessage = false;
      if (typeof config === 'string') {
        State.message = config;
        State.showMessage = true;
      } else if (Object.prototype.toString.call(config) === '[object Object]') {
        const keys = Object.keys(State);
        Object.keys(config).forEach((key) => {
          if (keys.indexOf(key) !== -1) {
            State[key] = config[key];
          }
        });
        State.showMessage = true;
        if (State.duration !== 0) {
          clearTimeout(State.closeT);
          State.closeT = setTimeout(() => {
            State.showMessage = false;
            if (config.cb) {
              config.cb();
            }
            init(State);
          }, State.duration);
        }
      }
    },
    setShowStatus(state, bl) {
      const State = state;
      State.showMessage = bl;
      if (bl === false) {
        clearTimeout(State.closeT);
      }
      init(State);
    },
  },
  actions: {
    Message({ commit }, config) {
      commit('Message', config);
    },
    setShowStatus({ commit }, bl) {
      commit('setShowStatus', bl);
    },
  },
};
