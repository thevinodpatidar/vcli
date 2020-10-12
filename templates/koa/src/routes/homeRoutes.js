
//Require Controller in route file
const koaRouter = require('koa-router');

const router = new koaRouter();

const HomeController = require("../controllers/index").HomeController;

router.get('/hello',HomeController.Hello);

module.exports = router;