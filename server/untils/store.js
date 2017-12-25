const Session = require('../dataBase/db').session;
const { Store } = require('koa-session2');

class MongodbStore extends Store {
  constructor() {
    super();
    this.Session = Session;
  }

  async get (sid, ctx) {
    const data = await this.Session.findOne({ sessionid: `SESSION:${sid}` });
    return data;
  }

  async set (session, { sid = this.getID(24), maxAge = 30 * 1000 } = {}, ctx) {
    try {
      const sessionObj = new this.Session({
        sessionid: `SESSION:${sid}`,
        session: JSON.stringify(session),
        // expirationDate: new Date(),
        // createdAt: { type: Date, default: Date.now, maxAge },
      });
      await sessionObj.save();
    } catch (e) {
    }
    return sid;
  }

  async destroy(sid, ctx) {
    return await this.Session.remove({ sessionid: `SESSION:${sid}` });
  }
}

module.exports = MongodbStore;
