
var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var pool = require('./pool')
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
var dialcode='91';


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

router.post('/appointment',(req,res)=>{
    if(req.session.usernumber){
        let body = req.body
        req.session.laundrybooking = body.booking_id
        req.session.laundryprice = body.price
        req.session.laundrycategory = body.categoryid
        req.session.laundrysubcategory = body.subcategoryid
        res.send('success')
    }
  
    else{
        res.send('failed')
    }
})

router.get('/book-appointment',(req,res)=>{
    res.render('book-appointment',{msg : ''})
})


router.post('/booking',(req,res)=>{
    let body = req.body
    let ournumber = '919875139745'
    if(req.body.date && req.body.time[0] || req.body.date && req.body.time[1] ){

        var working_otp =   Math.floor(1000 + Math.random() * 9000);

        body['usernumber'] = req.session.usernumber
        body['booking_id'] =   req.session.laundrybooking
        body['price'] =   req.session.laundryprice 
        body['teamprice'] =   req.session.laundryprice 
        body['working_otp'] = working_otp
        body['service_agent'] = '8088879880'
        body['status'] = 'Booked'
        body['payment_mode'] = 'Delo Services'
        body['rating'] = ''
        body['review'] = ''
        body['cancellation_charge'] = ''
        body['working'] = ''
        body['quantity'] = '1'
        body['categoryid'] = req.session.laundrycategory
        body['subcategoryid'] = req.session.laundrysubcategory
        body['membershipprice'] = ''
        body['promocode'] = ''
        body['color'] = '#507ec0'

         var times = req.body.time.join("-")  
        var finaltime = times.split("-")

        if(finaltime[0]==[] || finaltime[0]=="" || finaltime[0]==null || finaltime[0]=="null")
       body['time'] = finaltime[1];
        else
         body['time'] =  finaltime[0];
         body['booking_date'] = today
         pool.query(`insert into laundry_appointment set ? ` , body, (err,result)=>{
            if(err) console.log(err)
            else{
                pool.query(`insert into booking set ? ` , body, (err,result)=>{
                     if(err) console.log(err)
                     else {


                        msg91.sendOne(authkey,req.session.usernumber,` Hello ${req.body.name}, your appointment is sucessfully booked`,senderid,route,dialcode,function(response){
                       
                        }) 


                        msg91.sendOne(authkey,ournumber,`New appointment is booked by ${req.body.name}  `,senderid,route,dialcode,function(response){
                       
                        }) 

                        res.redirect('/booking')
                     }
                })
            }
         })
      
    }
        else{
            res.render('book-appointment',{msg : 'Please Choose Date & Time Properly'})
        }
     
   
})


 

router.get('/shopkeeper',(req,res)=>{
    pool.query(`select * from booking where categoryid = "14" and status = "picked successfully"`,(err,result)=>{
        if(err) throw err;
        else res.render('shopkeeper',{result:result})
       // else res.json(result)
    })
})


router.get('/shopkeeperhistory',(req,res)=>{
    pool.query(`select * from booking where categoryid = "14" and status = "completed" and dispatch = 'dispatched'`,(err,result)=>{
        if(err) throw err;
        else res.render('ShopkeeperHistory',{result:result})
         // else res.json(result)
    })
})



router.post('/dispatch',(req,res)=>{
let body = req.body
pool.query(`update booking set ? where id = ?`, [req.body, req.body.id], (err, result) => {
    if(err) throw err;
    else res.send('success');
})
})

module.exports = router;