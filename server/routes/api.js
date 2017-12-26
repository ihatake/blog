const Router = require('koa-router');
const controller = require('../controller');

const router = new Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/getUserName', controller.getUserName);
router.get('/logout', controller.logout);
router.post('/post', controller.post);
router.get('/getSomeOnePosts', controller.getSomeOnePosts);
router.get('/getAllPosts', controller.getAllPosts);
router.get('/getArticle', controller.getArticle);
router.post('/postImage', controller.postImage);
router.get('/downImage', controller.downImage);
router.get('/getComment', controller.getComment);
router.post('/postComment', controller.postComment);
router.post('/praiseComment', controller.praiseComment);
router.post('/replayComment', controller.replayComment);
router.get('/search', controller.search);
module.exports = router;
