var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'team'
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('300563AFuzfOZn9ESb5db12f8f');


router.get('/',(req,res)=>res.render('team_login',{msg : ''}));


router.get('/team',(req,res)=>res.render('team',{msg : ''}));


router.get('/login',(req,res)=>{
  if(req.session.teamnumber) res.render(`team`,{msg : ''})
  else res.redirect('/team_login')
})



router.post('/verification',(req,res)=>{
  let body = req.body
  console.log(req.body.number)
  req.session.partnernumberverify = 91+req.body.number
  var otp =   Math.floor(100000 + Math.random() * 9000);
  req.session.otp = otp;
  sendOtp.send(91+req.body.number, "DELOTM", otp,(err,result)=>{
    if(err) throw err;
    else{
      console.log(otp)
        res.json(result)
    }
   })
  
})



router.post('/verificationcomplete',(req,res)=>{
  let body = req.body
  
  //sendOtp.verify(req.session.partnernumberverify, req.body.otp, (err,result)=>{
    console.log( req.session.otp)
    console.log(req.body.otp)
   if (req.session.otp==req.body.otp){
     //if(err) throw err;
     //else if(result.type == 'success'){
        req.session.teamnumber = req.session.partnernumberverify
         res.redirect('/team_login/login');
      
      }
      //if(result.type == 'error') res.render('teamverify',{msg:'Enter Wrong OTP'})
      else res.render('teamverify',{msg:'Enter Wrong OTP'})
  //  });
  
})




router.get('/resendotpteamverification',(req,res)=>{
  var otp =   Math.floor(100000 + Math.random() * 9000);
  console.log('mynumber',req.session.loginverify)
  sendOtp.send(req.session.loginverify, "DELOTM", otp,(err,result)=>{
if(err) throw err;
else{
  res.redirect('/teamverify')
}
  })
})


router.get('/resendotp',(req,res)=>{
  var otp =   Math.floor(100000 + Math.random() * 9000);
  sendOtp.send(req.session.loginverify, "DELOTM", otp,(err,result)=>{
if(err) throw err;
else{
  res.redirect('/loginverify')
  

}
  });
})




router.post('/verifylogin',(req,res)=>{
  let body = req.body
  console.log(req.body)
  req.session.loginverify = 91+req.body.loginnumber
  var otp =   Math.floor(100000 + Math.random() * 9000);
  console.log(otp) 
  pool.query(`select * from team where number = "${req.body.loginnumber}"`,(err,result)=>{
    if(err) throw err;
    else if(result[0]) {
      console.log('nice')
    sendOtp.send(91+req.body.loginnumber, "DELOTM", otp,(err,result)=>{
        if(err) throw err;
        else{
           res.json(result);
        }
       })
    
      
    }
    else{
  res.render('team_login',{msg : 'Number Not Exist'})
//   res.redirect('/team_login')
    }
  })
 
})




router.post('/loginverificationcomplete',(req,res)=>{
  let body = req.body
  
  sendOtp.verify(req.session.loginverify, req.body.otp, (err,result)=>{
      if(err) throw err;
      else if(result.type == 'success'){
         res.redirect('/processing/login')
      }
         if(result.type == 'error') res.render('loginverify',{msg:'wrong otp'})
    });
})



router.post('/loginvalidation',(req,res)=>{
  const {email,number} = req.body;
  pool.query(`select * from ${table} where email = "${email}" and number = "${number}"`,(err,result)=>{
      if(result[0]){
      req.session.teamid = result[0].id;
      res.redirect('/team_dashboard'); 
    }
    else res.render('team_login',{msg : 'invalid password'})
  })
})




router.get('/logout',(req,res)=>{
req.session.teamid = null;
res.redirect('/team/login')})





router.get('/all',(req,res)=>pool.query(`select * from ${table}`,(err,result)=>err ? console.log(err) : res.json(result)));


module.exports = router;
