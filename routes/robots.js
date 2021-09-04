var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');


router.get('/', (req, res) => {
    
    res.render(`robots`, { msg  : '' });
  
})


module.exports = router;