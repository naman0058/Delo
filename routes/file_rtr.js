var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'team'
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('300563AFuzfOZn9ESb5db12f8f');
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
var dialcode='91';
var request = require('request');
var payumoney = require('payumoney-node');
payumoney.setKeys(`${process.env.PAYUMONEYKEY1}`, `${process.env.PAYUMONEYKEY2}`,`${process.env.PAYUMONEYKEY3}`);
payumoney.isProdMode(true);

const fetch = require('node-fetch');



const Razorpay = require("razorpay");
var instance = new Razorpay({
    key_id: 'rzp_live_2KlcXieUGyQ8k6',
    key_secret: '9CukFlVqEBgQ1l7LB03DXBPk',
  });








var dt = new Date();
var todaytime = dt.getHours() + ":" + dt.getMinutes();



var today = new Date();
var dd = today.getDate();

var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
today = yyyy+'-'+mm+'-'+dd;

router.get('/',(req,res)=>{
    if(req.session.usernumber){
        res.render(`file_rtr_document`)
    }
    else{
        res.redirect('/login')
    }
})

   




router.post('/insert',upload.fields([{ name: 'image', maxCount: 1 },{ name: 'image_back', maxCount: 1 },{ name: 'aadhar_front_side', maxCount: 1 }, { name: 'aadhar_back_side', maxCount: 1 }]),(req,res)=>{
  
    let body = req.body
    if(req.files['image_back']){
  req.session.image = req.files['image'][0].filename
  req.session.imageback = req.files['image_back'][0].filename
  req.session.aadhar_front_side = req.files['aadhar_front_side'][0].filename
req.session.aadhar_back_side = req.files['aadhar_back_side'][0].filename
req.session.rtrname = body.name
  req.session.rtremail = body.email
  req.session.rtrdob = body.dob
 req.session.rtrfather = body.father_name
 req.session.rtraadhar = body.aadhar_number
 req.session.rtrpan = body.pan_number
 req.session.rtrpwd = body.password
 req.session.rtraddinfo = body.additional_information
req.session.rtrbankname = body.bank_name
req.session.rtraccount = body.account_number
req.session.rtrifsc = body.ifsc 
req.session.rtraccountname = body.account_holder_name
req.session.rtrtype = body.type 
req.session.add1 =  body.address1
req.session.add2 = body.address2
req.session.state = body.state
req.session.city = body.city
req.session.pincode = body.pincode
req.session.rtrnumber = body.number
res.redirect('/file_rtr/pay');

}
    else{

  req.session.image = req.files['image'][0].filename
         req.session.aadhar_front_side = req.files['aadhar_front_side'][0].filename
      req.session.aadhar_back_side = req.files['aadhar_back_side'][0].filename
      req.session.rtrname = body.name
        req.session.rtremail = body.email
        req.session.rtrdob = body.dob
       req.session.rtrfather = body.father_name
       req.session.rtraadhar = body.aadhar_number
       req.session.rtrpan = body.pan_number
       req.session.rtrpwd = body.password
       req.session.rtraddinfo = body.additional_information
       req.session.rtrbankname = body.bank_name
      req.session.rtraccount = body.account_number
      req.session.rtrifsc = body.ifsc 
      req.session.rtraccountname = body.account_holder_name
      req.session.rtrtype = body.type 
      req.session.add1 =  body.address1
      req.session.add2 = body.address2
      req.session.state = body.state
      req.session.city = body.city
      req.session.pincode = body.pincode
      req.session.rtrnumber = body.number
    res.redirect('/file_rtr/pay');
    }

  })


  router.get('/pay',(req,res)=>{
      if(req.session.rtrnumber){
          res.render('rtr_payment',{name : req.session.rtrname , email : req.session.rtremail , address : req.session.add1  })
      }
      else{
          res.redirect('login')
      }
  })



  router.post('/getpay',(req,res)=>{
      if(req.session.usernumber){
      let body = req.body
      console.log('Body',body)
    payumoney.makePayment(body, function(error, response) {
        if (error) {
         throw error;
        } else {
          console.log(response)
           res.send(response)
        }
      });
    }
    else{
        res.redirect('/file_rtr');
    }
  })





  router.post('/payment_successfull',(req,res)=>{
      let body = req.body
      console.log(req.body)
      pool.query(`insert into file_rtr(name,email,dob,father_name,aadhar_number,pan_number,password,additional_information,bank_name,account_number,ifsc,account_holder_name,type,address1,address2,state,city,pincode,image,image_back,aadhar_front_side,aadhar_back_side,number,orderid,signature,paymentid,booking_date,booking_time)
      values ('${req.session.rtrname}','${req.session.rtremail}','${req.session.rtrdob}','${req.session.rtrfather}','${ req.session.rtraadhar}','${req.session.rtrpan}','${req.session.rtrpwd}','${req.session.rtraddinfo}'
      ,'${req.session.rtrbankname}','${req.session.rtraccount}','${req.session.rtrifsc}','${req.session.rtraccountname}','${req.session.rtrtype}','${req.session.add1}','${req.session.add2}','${req.session.state}' 
      ,'${req.session.city}','${req.session.pincode}','${req.session.image}','${req.session.imageback}','${ req.session.aadhar_front_side}','${ req.session.aadhar_back_side}','${req.session.rtrnumber}','${req.body.razorpay_order_id}','${req.body.razorpay_signature}','${req.body.razorpay_payment_id}','${today}','${todaytime}')`,(err,result)=>{
          if(err) throw err;
          else {
            console.log('success')
              res.send('success')
          } 
      })
  })    


  

  

  router.post('/payment_failed',(req,res)=>{
      res.render(`failed_payment`)
  })



router.get('/details',(req,res)=>{
    if(req.session.usernumber){
    pool.query(`select * from file_rtr where number = "${req.session.usernumber}" and status is null `,(err,result)=>{
        if(err) throw err;
        //else res.json(result)
       else res.render(`file-rtr-details`,{result:result})
    })
}
else res.redirect('/login');
})



router.get(`/successfully`,(req,res)=>{
    res.render(`file_rtr_success`)
})
  
module.exports = router;
