
var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var pool = require('./pool')



router.get('/', (req, res) => {
res.render('htaccess')
})

 


module.exports = router;