var express = require('express')
var pool = require('./pool')
var router = express.Router()
var upload = require('./multer');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('300563AFuzfOZn9ESb5db12f8f');
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
//promotional=1, transactional=4
var dialcode='91';
var payumoney = require('payumoney-node');
payumoney.setKeys(`${process.env.PAYUMONEYKEY1}`, `${process.env.PAYUMONEYKEY2}`,`${process.env.PAYUMONEYKEY3}`);
payumoney.isProdMode(true);
var request = require('request');
const fetch = require('node-fetch');
const { Expo } = require('expo-server-sdk')



const Razorpay = require("razorpay");
var instance = new Razorpay({
    key_id: 'rzp_live_2KlcXieUGyQ8k6',
    key_secret: '9CukFlVqEBgQ1l7LB03DXBPk',
  });

var dt = new Date();
var todaytime = (dt.getHours() + ":" + dt.getMinutes()).toString();


console.log("present time",todaytime)
console.log("aa gya",process.env.encryptedkey)

/////////////////////////Team API Starts/////////////////////////////
var today = new Date();
var newdate = new Date();
    newdate.setDate(today.getDate()+30);

    var dt = new Date();
    var todaytime = dt.getHours() + ":" + dt.getMinutes();


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




router.post('/cart',(req,res)=>{
    let body = req.body
    console.log(req.body)
    pool.query(`select * from appointment_service where id = "${req.body.booking_id}" `,(err,result)=>{
      if(err) throw err;
      else {
        body['categoryid'] = result[0].categoryid
        body['subcategoryid'] = result[0].subcategoryid
        body['price'] = result[0].our_price
        body['oneprice'] =  result[0].our_price
           body['quantity'] = '1'
        body['price'] = req.body.price
        var qua = '1'
  pool.query(`select * from appointment_cart where usernumber = '${req.body.usernumber}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {
    if(req.body.partnerid==result[0].partnerid){
      if(req.body.booking_id ==result[0].booking_id){
  pool.query(`update appointment_cart set quantity = quantity+${qua} , price = price+${req.body.price} where booking_id = '${req.body.booking_id}' and usernumber = '${req.body.usernumber}'`,(err,result)=>{
  if(err) throw err;
  else{
    res.json({
      msg : 'updated sucessfully'
    })
  }
  })
      }
      else{
      pool.query(`insert into appointment_cart set ?`,body,(err,result)=>{
        if(err) throw err;
        else{
          res.json({
            msg : 'updated sucessfully'
          })
        }
      })
    }
    }
    else{
      res.json({
        msg : 'Can not book two different partner services simultaneously. Replace cart ?'
      })
    }
  }
  else{
    pool.query(`insert into appointment_cart set ?`,body,(err,result)=>{
      if(err) throw err;
      else {
        res.json({
          msg : 'updated sucessfully'
        })
      }
    })
  }
  
  })
  }
  })
 
  
  })
       
  
  router.post('/cart/replace',(req,res)=>{
    let body = req.body
    console.log(req.body)
    pool.query(`select * from appointment_service where id = "${req.body.booking_id}" `,(err,result)=>{
      if(err) throw err;
      else {
        body['categoryid'] = result[0].categoryid
        body['subcategoryid'] = result[0].subcategoryid
        body['price'] = result[0].our_price
        body['oneprice'] =  result[0].our_price
           body['quantity'] = '1'
        body['price'] = req.body.price
  
    pool.query(`delete from appointment_cart where usernumber = '${req.body.usernumber}'`,(err,result)=>{
      if(err) throw err;
      else{
        pool.query(`insert into appointment_cart set ?`,body,(err,result)=>{
          if(err) throw err;
          else {
            res.json({
              msg : 'updated sucessfully'
            })
          }
        })
      }
     
    })
  }
  })
  
  })
  
  
  
  router.post('/cart/all',(req,res)=>{
    if(process.env.encryptedkey == req.body.key){
  pool.query(`select usernumber from appointment_cart where usernumber = '${req.body.usernumber}'`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  }
  else{
    res.json({
      type : 'error',
      description : '404 Not Found'
    })
  }
  })


  
  
  router.post('/mycart',(req,res)=>{
    if(process.env.encryptedkey == req.body.key){
      var query = `select c.*,(select s.name from appointment_service s where s.id = c.booking_id) as servicename
      from appointment_cart c where c.usernumber = '${req.body.usernumber}';`
      var query1 = `select count(id) as counter from appointment_cart where usernumber = '${req.body.usernumber}';`
      var query2 = `select sum(price) as total_ammount from appointment_cart  where usernumber = '${req.body.usernumber}'; `
         pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) {
               req.body.mobilecounter = result[1][0].counter
               console.log("MobileCounter",req.body.mobilecounter)
          res.json(result);
        }
        else res.json({
          msg : 'empty cart'
        })
      })
    } else{
      res.json({
        type : 'error',
        description : '404 Not Found'
      })
    }
  })
  
  
  router.post('/cartupdate',(req,res)=>{
    if(process.env.encryptedkey == req.body.key){
    pool.query(`select id,price,oneprice,quantity from appointment_cart where id = "${req.body.id}"`,(err,result)=>{
      if(err) throw err;
      else{
        console.log(result[0])
        pool.query(`update appointment_cart set price = price + oneprice , quantity = quantity+1  where id = "${req.body.id}"`,(err,result)=>{
          err ? console.log(err) : res.json({
            msg : 'updated successfully'
          })
        })
      }
    })
  }
  
  else{
    res.json({
      type : 'error',
      description : '404 Not Found'
    })
  }
  })
  
  router.post('/cartdelete',(req,res)=>{
    if(process.env.encryptedkey == req.body.key){
    pool.query(`select id,price,quantity from appointment_cart where id = "${req.body.id}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0].quantity > 1 ){
        console.log(result[0])
        pool.query(`update appointment_cart set price = price - (price/quantity) , quantity = quantity-1  where id = "${req.body.id}"`,(err,result)=>{
          err ? console.log(err) :  res.json({
            msg : 'deleted successfully'
          })
        })
      }
  
      else{
        pool.query(`delete from appointment_cart where id = "${req.body.id}"`,(err,result)=>{
          err ? console.log(err) : res.json({
            msg : 'deleted successfully'
          })
        })
      }
  
    })
  }
  else{
    res.json({
      type : 'error',
      description : '404 Not Found'
    })
  }
  })
  
  



module.exports = router;