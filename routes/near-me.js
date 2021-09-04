var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');

router.get('/',(req,res)=>{
  res.render('near-me')
})

module.exports = router
