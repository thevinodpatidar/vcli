
//Require Controller in route file

const express = require('express');
const router = express.Router();
const HomeController = require("../controllers/index").HomeController;

router.get('/hello',HomeController.Hello);

module.exports = router;