const mongoose = require('mongoose');

mongoose.connect('mongodb://blogRoot:Xuwenli526@localhost:27017/blog', { useMongoClient: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
  // yay!
  console.log('数据库连接成功');
});
const Schema = mongoose.Schema;   //  创建模型
const userScheMa = new Schema({
  nickname: String,
  email: String,
  password: String,
  registertime: { type: Date, default: Date.now },
  introduction: { type: String, default: '暂无介绍' },
  avatar: String,
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
const PostScheMa = new Schema({
  nickname: String,
  content: String,
  title: String,
  commentCount: { type: Number, default: 0 },
  praiseCount: { type: Number, default: 0 },
  lookCount: { type: Number, default: 0 },
  posttime: { type: Date, default: Date.now },
});
const SessionScheMa = new Schema({
  sessionid: String,
  createdAt: { type: Date, default: Date.now },
  session: String,
});
const CommentScheMa = new Schema({
  postid: String,
  nickname: String,
  content: String,
  praise: { type: Array, default: [] },
  replay: { type: Array, default: [] },
  posttime: { type: Date, default: Date.now },
});
const replayScheMa = new Schema({
  parentid: String,
  nickname: String,
  content: String,
  at: String,
  praise: { type: Array, default: [] },
  posttime: { type: Date, default: Date.now },
});
SessionScheMa.index({ createdAt: 1 }, { expireAfterSeconds: (1 * 60 * 60 * 24) })
const session = db.model('sessions', SessionScheMa);
exports.user = db.model('users', userScheMa); //  与users集合关联
exports.post = db.model('posts', PostScheMa); //  与post集合关联
exports.session = session; //  与session集合关联
exports.comment = db.model('comment', CommentScheMa);// 评论
exports.replay = db.model('replay', replayScheMa);// 回复
