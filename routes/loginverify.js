var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');


router.get('/', (req, res) => {
    
    res.render(`loginverify`, { msg  : '' });
  
})


module.exports = router;