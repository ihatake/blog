module.exports = {
  /**
   * 判断是否为正确的email
   * @param email
   * @returns {boolean}
   */
  isEmail(email) {
    const emailp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (!!email.match(emailp));
  },
  /**
   * 判断是否为字符串
   * @param str
   * @returns {boolean}
   */
  isString(str) {
    return Object.prototype.toString.call(str) === '[object String]';
  },
};
