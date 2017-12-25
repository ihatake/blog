const fs = require('fs');
const path = require('path');
const qiniu = require('qiniu');
const crypto = require('../untils/crypto');
const base = require('../untils/base');
const response = require('../untils/response');
const User = require('../dataBase/db').user;
const Post = require('../dataBase/db').post;
const Session = require('../dataBase/db').session;
const Comment = require('../dataBase/db').comment;
const Replay = require('../dataBase/db').replay;


/**
 * 文件长传到七牛云
 * @param file
 * @returns {Promise}
 */
async function uploadQiNiu(file) {
  return new Promise((resolve, reject) => {
    const accessKey = 'NVvpJ3rCeUk7EqJAVAb-CSfopIL7mdwHfMdMVF00';
    const secretKey = 'f9-WSTLFkoLCLC3LYfIxN3qwJiVHdN6swazJBt1P';
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: 'blog',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
// 文件上传
    formUploader.putStream(uploadToken, file.name, file.stream, putExtra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        } else if (respInfo.statusCode === 200) {
          resolve(respBody);
        } else {
          reject({ statusCode: respInfo.statusCode, respBody });
        }
      });
  });
}

module.exports = {
  /**
   * 注册
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  register: async (ctx, next) => {
    const body = ctx.request.body.fields;
    const nickname = body.nickname;
    const email = body.email;
    const password = body.password;
    const files = ctx.request.body.files || {};
    const responseData = response.res();
    if (!base.isString(nickname) || !base.isString(email) || !base.isString(password)
      || password.length < 6 || !base.isEmail(email) || Object.keys(files).length !== 1
      || Object.values(files)[0].type.indexOf('image/') === -1) {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.message = '格式有误';
      responseData.data = {};
      ctx.type = 'json';
      ctx.body = responseData;
      return;
    }
    // 检查是否有重复的昵称或邮箱
    const findName = User.find({ nickname }).exec();
    const findEmail = User.find({ email }).exec();
    await Promise.all([findName, findEmail]).then(async (results) => {
      if (results[0].length > 0) {
        responseData.errorCode = '001';
        responseData.callStatus = 'FAILED';
        responseData.data = {};
        responseData.message = '昵称已被占用';
        ctx.type = 'json';
        ctx.body = responseData;
      } else if (results[1].length > 0) {
        responseData.errorCode = '001';
        responseData.callStatus = 'FAILED';
        responseData.data = {};
        responseData.message = '该邮箱已被注册';
        ctx.type = 'json';
        ctx.body = responseData;
      } else {
        // 上传头像
        const filePaths = [];
        Object.keys(files).forEach(async (key) => {
          const file = files[key];
          const name = Date.now() + file.name;
          const readStream = fs.createReadStream(file.path);
          const fileObj = {
            name,
            type: file.type,
            size: file.size,
            pos: key,
            stream: readStream,
          };
          filePaths.push(fileObj);
        });
        const promiseArr = [];
        filePaths.forEach((item) => {
          promiseArr.push(
            uploadQiNiu({ name: item.name, stream: item.stream }),
          );
        });
        await Promise.all(promiseArr).then((result) => {
          console.log(result);
          result.forEach((item, index) => {
            delete filePaths[index].stream;
            filePaths[index].key = `http://p0jokceq3.bkt.clouddn.com/${item.key}`;
          });
        }).catch((err) => {
          responseData.errorCode = '001';
          responseData.callStatus = 'FAILED';
          responseData.message = '上传失败';
          responseData.data = {};
          ctx.type = 'json';
          ctx.body = response;
          return;
        });
        console.log(filePaths);
        const avatar = filePaths[0].key;
        // 注册用户
        const user = new User({
          nickname,
          email,
          avatar,
          password: crypto.enAES192(password),
        });
        await user.save().then((result) => {
          responseData.errorCode = '000';
          responseData.callStatus = 'SUCCEED';
          responseData.message = '注册成功';
          responseData.data = {
            nickname: result.nickname,
            email: result.email,
            avatar: result.avatar,
          };
          ctx.session = {
            nickname: result.nickname,
            email: result.email,
            avatar: result.avatar,
          };
        });
        ctx.type = 'json';
        ctx.body = responseData;
      }
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.message = '服务器发生错误';
      responseData.data = {};
      ctx.type = 'json';
      ctx.body = responseData;
      console.log(err);
    });
  },
  /**
   * 登录
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  login: async (ctx, next) => {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;
    const responseData = response.res();
    if (!base.isString(email) || !base.isString(password)
      || password.length < 6 || !base.isEmail(email)) {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.data = {};
      responseData.message = '格式有误';
      ctx.type = 'json';
      ctx.body = responseData;
      return;
    }
    const findUser = User.find({ email, password: crypto.enAES192(password) }).exec();
    await findUser.then((result) => {
      if (result.length > 0) {
        const user = result[0];
        responseData.errorCode = '000';
        responseData.callStatus = 'SUCCEED';
        responseData.message = '登录成功';
        responseData.data = {
          nickname: user.nickname,
          email: user.email,
          avatar: user.avatar,
        };
        ctx.session = {
          nickname: user.nickname,
          email: user.email,
          avatar: user.avatar,
        };// 将用户信息存入session
      } else {
        responseData.errorCode = '001';
        responseData.callStatus = 'FAILED';
        responseData.data = {};
        responseData.message = '邮箱或密码错误';
      }
      ctx.type = 'json';
      ctx.body = responseData;
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.data = {};
      responseData.message = '服务器发生错误';
      ctx.type = 'json';
      ctx.body = responseData;
      console.log(err);
    });
  },
  /**
   * 获取用户名，用于检查是否登录
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  getUserName: async (ctx, next) => {
    const data = ctx.session.session || '{}';
    const responseData = response.res();
    responseData.errorCode = '000';
    responseData.callStatus = 'SUCCEED';
    responseData.data = data;
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 注销
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  logout: async (ctx, next) => {
    const data = ctx.session.session;
    if (data) {
      ctx.cookies.set('SESSIONID', '', {
        maxAge: -1,
      });
      await Session.remove({ session: data }).then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
    }
    const responseData = response.res();
    responseData.errorCode = '000';
    responseData.callStatus = 'SUCCEED';
    responseData.data = data;
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 发布文章
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  post: async (ctx, next) => {
    const responseData = response.res();
    const data = ctx.session.session || '{}';
    const nickname = JSON.parse(data).nickname;
    if (!nickname) {
      responseData.errorCode = '002';
      responseData.callStatus = 'FAILED';
      responseData.data = {};
      responseData.message = '尚未登录';
      ctx.type = 'json';
      ctx.body = responseData;
      return;
    }
    const content = ctx.request.body.content;
    const title = ctx.request.body.title;
    const post = new Post({
      nickname,
      content,
      title,
    });
    await post.save().then(() => {
      responseData.errorCode = '000';
      responseData.callStatus = 'SUCCEED';
      responseData.data = {};
      responseData.message = '发布成功';
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.data = {};
      responseData.message = '发布失败';
      console.log(err);
    });
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 获取某个人的所有博客
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  getSomeOnePosts: async (ctx, next) => {
    const nickname = ctx.request.query.nickname;
    const currentPage = parseInt(ctx.request.query.currentPage, 10);
    const pageSize = parseInt(ctx.request.query.pageSize, 10);
    const responseData = response.res();
    const findCount = Post.count({ nickname });
    const findPost = Post.find({ nickname })
      .sort({ posttime: -1 })
      .limit(pageSize)
      .skip((currentPage - 1) * pageSize);
    await Promise.all([findCount, findPost]).then((result) => {
      responseData.errorCode = '000';
      responseData.callStatus = 'SUCCEED';
      responseData.message = '成功';
      responseData.data = result[1];
      responseData.total = result[0];
      responseData.currentPage = currentPage;
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.message = '获取数据失败';
      responseData.data = [];
      console.log(err);
    });
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 获取所有发布的博客
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  getAllPosts: async (ctx, next) => {
    const currentPage = parseInt(ctx.request.query.currentPage, 10);
    const pageSize = parseInt(ctx.request.query.pageSize, 10);
    const responseData = response.res();
    const findCount = Post.count({});
    const findPost = Post.find({})
      .sort({ posttime: -1 })
      .limit(pageSize)
      .skip((currentPage - 1) * pageSize);
    await Promise.all([findCount, findPost]).then((result) => {
      responseData.errorCode = '000';
      responseData.callStatus = 'SUCCEED';
      responseData.message = '成功';
      responseData.data = result[1];
      responseData.total = result[0];
      responseData.currentPage = currentPage;
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.message = '获取数据失败';
      responseData.data = [];
      console.log(err);
    });
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 获取文章详情
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  getArticle: async (ctx, next) => {
    const id = ctx.request.query.id;
    const responseData = response.res();
    await Post.find({ _id: id }).then((result) => {
      if (result.length > 0) {
        responseData.errorCode = '000';
        responseData.callStatus = 'SUCCEED';
        responseData.message = '成功';
        responseData.data = result[0];
      } else {
        responseData.errorCode = '001';
        responseData.callStatus = 'FAILED';
        responseData.data = {};
        responseData.message = '未找到该文章';
        responseData.data = [];
      }
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.message = '获取数据失败';
      responseData.data = {};
      console.log(err);
    });
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 图片上传
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  postImage: async (ctx, next) => {
    const responseData = response.res();
    const data = ctx.session.session || '{}';
    const nickname = JSON.parse(data).nickname;
    if (!nickname) {
      responseData.errorCode = '002';
      responseData.callStatus = 'FAILED';
      responseData.message = '尚未登录';
      responseData.data = {};
      ctx.type = 'json';
      ctx.body = responseData;
      return;
    }
    const files = ctx.request.body.files || {};
    const filePaths = [];
    Object.keys(files).forEach(async (key) => {
      const file = files[key];
      const name = Date.now() + file.name;
      const readStream = fs.createReadStream(file.path);
      const fileObj = {
        name,
        type: file.type,
        size: file.size,
        pos: key,
        stream: readStream,
      };
      filePaths.push(fileObj);
    });
    const promiseArr = [];
    filePaths.forEach((item) => {
      promiseArr.push(
        uploadQiNiu({ name: item.name, stream: item.stream }),
      );
    });
    await Promise.all(promiseArr).then((result) => {
      result.forEach((item, index) => {
        delete filePaths[index].stream;
        filePaths[index].key = `http://p0jokceq3.bkt.clouddn.com/${item.key}`;
        // fs.unlink(filePaths[index].filePath);
      });
      responseData.errorCode = '000';
      responseData.callStatus = 'SUCCEED';
      responseData.message = '成功';
      responseData.data = filePaths;
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.message = '上传失败';
      responseData.data = [];
      console.log('err11', err);
    });
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 下载图片
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  downImage: async (ctx, next) => {
    const fileName = ctx.request.query.fileName;
    try {
      const data = fs.readFileSync(`./uploads/${fileName}`);
      ctx.type = 'image/jpeg';
      ctx.body = data;
    } catch (err) {
      ctx.type = 'image/jpeg';
      ctx.body = '';
    }
  },
  /**
   * 发表评论
   * @param ctx
   * @param next
   */
  postComment: async (ctx, next) => {
    const responseData = response.res();
    const data = ctx.session.session || '{}';
    const nickname = JSON.parse(data).nickname;
    if (!nickname) {
      responseData.errorCode = '002';
      responseData.callStatus = 'FAILED';
      responseData.message = '尚未登录';
      responseData.data = {};
      ctx.type = 'json';
      ctx.body = responseData;
      return;
    }
    const content = ctx.request.body.comment;
    const postid = ctx.request.body.postid;
    const comment = new Comment({
      postid,
      content,
      nickname,
    });
    await comment.save().then(() => {
      responseData.errorCode = '000';
      responseData.callStatus = 'SUCCEED';
      responseData.data = {};
      responseData.message = '评论成功';
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.data = {};
      responseData.message = '评论失败';
      console.log(err);
    });
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 获取评论
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  getComment: async (ctx, next) => {
    const currentPage = parseInt(ctx.request.query.currentPage, 10);
    const pageSize = parseInt(ctx.request.query.pageSize, 10);
    const postid = ctx.request.query.postid;
    const responseData = response.res();
    const findCount = Comment.count({ postid });
    const findPost = Comment.find({ postid })
      .sort({ posttime: -1 })
      .limit(pageSize)
      .skip((currentPage - 1) * pageSize);
    await Promise.all([findCount, findPost]).then(async (result) => {
      const query = [];
      const data = [];
      const replayPromise = [];
      result[1].map(async (item, index) => {
        const Item = item;
        const replayQuery = [];
        if (Item.replay.length > 0) {
          Item.replay.forEach((it) => {
            replayQuery.push({ _id: it });
          });
        } else {
          replayQuery.push({ _id: null });
        }
        query.push({ nickname: Item.nickname });
        replayPromise.push(Replay.find({
          $or: replayQuery,
        }));
      });
      if (result[1].length > 0) {
        const findUsers = User.find({
          $or: query,
        });
        const keys = new Map();
        await findUsers.then((users) => {
          users.forEach((item) => {
            keys.set(item.nickname, {
              nickname: item.nickname,
              email: item.email,
              avatar: item.avatar,
            });
          });
        });
        result[1].forEach((item) => {
          data.push(
            Object.assign({ user: keys.get(item.nickname) }, JSON.parse(JSON.stringify(item)))
          );
        });

        await Promise.all(replayPromise).then((replayList) => {
          replayList.forEach((item, index) => {
            data[index] = Object.assign(data[index], { replayList: item });
          });
        }).catch((e) => {
          console.log(e);
        });
        responseData.data = data;
      } else {
        responseData.data = result[1];
      }

      // console.log(keys, data);
      responseData.errorCode = '000';
      responseData.callStatus = 'SUCCEED';
      responseData.message = '成功';
      responseData.data = data;
      responseData.total = result[0];
      responseData.currentPage = currentPage;
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.message = '获取数据失败';
      responseData.data = [];
      console.log(err);
    });
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 点赞评论
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  praiseComment: async (ctx, next) => {
    const responseData = response.res();
    const data = ctx.session.session || '{}';
    const nickname = JSON.parse(data).nickname;
    if (!nickname) {
      responseData.errorCode = '002';
      responseData.callStatus = 'FAILED';
      responseData.message = '尚未登录';
      responseData.data = {};
      ctx.type = 'json';
      ctx.body = responseData;
      return;
    }
    const postid = ctx.request.body.postid;
    let comment = {};
    await Comment.find({ _id: postid }).then(async (result) => {
      if (result.length === 1) {
        comment = result[0];
      }
    }).catch((err) => {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.message = '失败';
      responseData.data = [];
      console.log(err);
    });
    if (comment.praise) {
      const index = comment.praise.indexOf(nickname);
      if (index !== -1) {
        comment.praise.splice(index, 1);
      } else {
        comment.praise.push(nickname);
      }
      await Comment.update({ _id: postid }, { $set: { praise: comment.praise } }).then((resut) => {
        responseData.errorCode = '000';
        responseData.callStatus = 'SUCCEED';
        responseData.message = '成功';
        responseData.data = [];
      }).catch((err) => {
        responseData.errorCode = '001';
        responseData.callStatus = 'FAILED';
        responseData.message = '失败';
        responseData.data = [];
        console.log(err);
      });
    }
    ctx.type = 'json';
    ctx.body = responseData;
  },
  /**
   * 回复评论
   * @param ctx
   * @param next
   * @returns {Promise.<void>}
   */
  replayComment: async (ctx, next) => {
    let isSuccess = false;
    const responseData = response.res();
    const data = ctx.session.session || '{}';
    const nickname = JSON.parse(data).nickname;
    if (!nickname) {
      responseData.errorCode = '002';
      responseData.callStatus = 'FAILED';
      responseData.message = '尚未登录';
      responseData.data = {};
      ctx.type = 'json';
      ctx.body = responseData;
      return;
    }
    const parentid = ctx.request.body.parentid;
    const at = ctx.request.body.at;
    const content = ctx.request.body.content;
    const replay = new Replay({
      parentid,
      content,
      at,
      nickname,
    });
    let replayArry = [];
    await replay.save().then(async (result) => {
      await Comment.find({ _id: parentid }).then((comment) => {
        if (comment.length === 1) {
          comment[0].replay.push(result._id);
          replayArry = comment[0].replay;
        }
      }).catch((err) => {
        console.log(err);
        isSuccess = false;
      });
      if (replayArry.length > 0) {
        await Comment.update({ _id: parentid }, { $set: { replay: replayArry } }).then(() => {
          isSuccess = true;
        }).catch((err) => {
          isSuccess = false;
          console.log(err);
        });
      }
    }).catch((err) => {
      isSuccess = false;
      console.log(err);
    });
    if (isSuccess) {
      responseData.errorCode = '000';
      responseData.callStatus = 'SUCCEED';
      responseData.data = {};
      responseData.message = '评论成功';
    } else {
      responseData.errorCode = '001';
      responseData.callStatus = 'FAILED';
      responseData.data = {};
      responseData.message = '评论失败';
    }
    ctx.type = 'json';
    ctx.body = responseData;
  },
}
;
