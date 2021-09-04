var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');

router.get('/instatnt-articles',(req,res)=>{
 res.render(`blogs`)
})

module.exports = router
