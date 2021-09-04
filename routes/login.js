var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('300563AFuzfOZn9ESb5db12f8f');

//var nodemailer = require('nodemailer');

 
var today = new Date();
var newdate = new Date();
    newdate.setDate(today.getDate()+30);




var dd = today.getDate();

var futuretime = today.getHours()+2 + ":" + today.getMinutes();


var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
var a = newdate.getDate()
var b = newdate.getMonth()+1;
if(dd<10) 
{
    dd='0'+dd;
  
} 

if(a<10){
  a='0'+a;
}


if(mm<10) 
{
    mm='0'+mm;
} 


if(b<10) 
{
    b='0'+b;
} 
today = yyyy+'-'+mm+'-'+dd;

 var my = newdate.toLocaleDateString()
 var my1 = newdate.getFullYear()+'-'+b+'-'+a
//console.log(today)
//console.log(newdate)
//console.log(my1)





/*
router.get('/send',(req,res)=>{

  let transporter = nodemailer.createTransport({
    host: "cs@deloservices.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'cs@deloservices.com', // generated ethereal user
      pass: 'TxsluQIh5' // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info =  transporter.sendMail({
    from: '"Fred Foo 👻" <cs@deloservices.com>', // sender address
    to: "jnaman345@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


})*/

router.get('/', (req, res) => {
      res.render(`login`, { msg  : '' });
  
})

router.post('/verification',(req,res)=>{
 let body = req.body
   console.log(req.body)
   req.session.numberverify = 91+req.body.number
   var otp =   Math.floor(100000 + Math.random() * 9000);
   req.session.reqotp = otp;
   console.log("Request Number",req.session.numberverify);
   console.log("OTP",otp);
   sendOtp.send(91+req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else{
         res.send('result')
     }
    })
  
 
})


 
router.get('/resendotp',(req,res)=>{
    var otp =   Math.floor(100000 + Math.random() * 9000);
    sendOtp.send(req.session.numberverify, "DELOTM", otp,(err,result)=>{
  if(err) throw err;
  else{
    res.redirect('/userverify')
  }
    })
  })

/*
router.post('/verificationcomplete',(req,res)=>{
    let body = req.body
    console.log("finalNumber",req.session.numberverify);
    console.log("final OTP",req.body.otp);
    sendOtp.verify(req.session.numberverify, req.body.otp, (err,result)=>{
        if(err) throw err;
        else if(result.type == 'success'){
          pool.query(`select * from users where number = "${req.session.numberverify}"`,(err,result)=>{
            if(err) throw err;
            else if(result[0]){
              req.session.usernumber = req.session.numberverify
              if(req.session.getcategoryid && req.session.getsubcategoryid){
                res.redirect('/subcategory/byservices');
              }
              
              else res.redirect('/');
            }
            else{
              pool.query(`insert into users(number) values(${req.session.numberverify}) `,(err,result)=>{
                if(err) throw err;
                else { 
                    req.session.usernumber = req.session.numberverify
                    res.redirect('/');
                  
                }
            }) 
           
            }
          })
            
        }
        else res.render('usersverify',{msg:'Enter Wrong OTP'})
      });
})*/

router.post('/verificationcomplete',(req,res)=>{
  let body = req.body
  if(req.session.reqotp == req.body.otp){
    pool.query(`select * from users where number = "${req.session.numberverify}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0]){
        req.session.usernumber = req.session.numberverify
        if(req.session.getcategoryid && req.session.getsubcategoryid){
          res.redirect('/subcategory/byservices');
        }
        
        else res.redirect('/');
      }
      else{
        pool.query(`insert into users(number,offer,date,valid_date,promocode) values(${req.session.numberverify},'1800','${today}','${my1}','DELO100') `,(err,result)=>{
          if(err) throw err;
          else { 
              req.session.usernumber = req.session.numberverify
              res.redirect('/');
            
          }
      }) 
      }
      

    
    })
  }
  else res.render('usersverify',{msg:'Enter Wrong OTP'})
})


 

router.get('/logout',(req,res)=>{
    req.session.usernumber = null;
    res.redirect('/')
})

router.post('/subscribe',(req,res)=>{
  let body = req.body
  pool.query(`insert into subscribe set ?`,body,(err,result)=>{
    if(err) throw err;
    else res.redirect('/')
  })
})


module.exports = router;