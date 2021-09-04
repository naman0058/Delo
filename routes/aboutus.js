var express = require('express')
var router = express.Router()


router.get('/',(req,res)=> req.session.usernumber ? res.render(`aboutus`,{login:false}) :  res.render('aboutus',{login:false}))


module.exports = router
