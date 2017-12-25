const crypto = require('crypto');


module.exports = {
  /**
   * aes192加密模块
   * @param str string 要加密的字符串
   * @param key string 要使用的加密密钥
   * @retrun string 加密后的字符串
   */
  enAES192(str, key = 'myblog') {
    const cipher = crypto.createCipher('aes192', key);
    let result = cipher.update(str, 'utf8', 'hex');
    result += cipher.final('hex');
    return result;
  },
  /**
   * aes192解密模块
   * @param str string 要加密的字符串
   * @param key string 要使用的加密密钥
   * @retrun string 加密后的字符串
   */
  deAES192(str, key = 'myblog') {
    const decipher = crypto.createDecipher('aes192', key);
    let result = decipher.update(str, 'hex', 'utf8');
    result += decipher.final('utf8');
    return result;
  },

};
