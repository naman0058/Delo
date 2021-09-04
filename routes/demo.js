
var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');
<<<<<<< HEAD
var jwt = require('jsonwebtoken');
var config = require('config');
router.get('/',(req,res)=>{
    res.render(`demo`)
})



router.get('/jwt',(req,res)=>{
    var query =`select * from admin where email = "jnaman345@gmail.com" and password = "123"`
    pool.query(query,(err,result)=>{
        if(err)   res.status(200).send('dgf');
        else if(result[0]){
          
            var token = jwt.sign({ id: 'result[0]._id '}, 'fdgj', {
                expiresIn: 86400 // expires in 24 hours
                
              });

              var token1 = jwt.sign({ id: 'result[0]._id '}, 'fdgj', {
                expiresIn: 86400 // expires in 24 hours
                
              });
              console.log("token",token)
              res.status(200).send({ auth: true, token: token , token1 : token1});
        }
    })
})


router.get('/checkjwt',(req,res)=>{
    var token = req.headers['x-access-token'];
    if(!token){
res.send('token ni h')
    }
    else{
        jwt.verify(token, 'fdgj', function(err, decoded) {
            res.send('s')
            console.log(token)
          });
    }
  
})


router.get('/demo1',(req,res)=>{
    res.render(`demo1`)
})
/*const login = require("facebook-chat-api");
=======

>>>>>>> 9d006a9def31db3aa0e40e127ec194862579ef78
router.get('/',(req,res)=>{
    res.send('send')
})


module.exports = router;