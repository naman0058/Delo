var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'team'


router.get('/',(req,res)=>{
    pool.query(`select * from booking where id = '931'`,(err,result)=>{
        if(err) throw err;
        else res.render('invoice',{result:result})
    })

})


module.exports = router;
