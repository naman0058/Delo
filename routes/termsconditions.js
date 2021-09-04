var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');

router.get('/',(req,res)=>{
    if(req.session.usernumber) {
    res.render('termsconditions',{login:true})
    }
    else 
    res.render('termsconditions',{login:false})
})

module.exports = router
