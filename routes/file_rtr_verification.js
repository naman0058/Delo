var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');


router.get('/', (req, res) => req.session.rtrnumber ?  res.render(`file_rtr_verification`, { msg  : '' }) : res.render(`file_rtr`))


module.exports = router;