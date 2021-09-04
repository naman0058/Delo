var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');

router.get('/',(req,res)=>{
    if(req.session.usernumber) {
    res.render('faq',{login:true})
    }
    else 
    res.render('faq',{login:false})
})

module.exports = router
