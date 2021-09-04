var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');

const SendOtp = require('sendotp');
const sendOtp = new SendOtp('300563AFuzfOZn9ESb5db12f8f');
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
var dialcode='91';


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




router.post('/signup',upload.single('image'), (req, res) => {
    let body = req.body;
    body['image'] = req.file.filename
    body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
    body['seo_address'] = (body.address1.split(' ').join('-')).toLowerCase()
    body['status'] = "pending"
    body['created_date'] = today
    console.log("body data",req.body)
    pool.query(`insert into affiliate set ?`, body, (err, result) => {
        if(err) throw err;
        else if(result[0]){ res.json({
          status : "200",
          description : 'success'
        })
      }
      else{
        res.json({
          status:'500',
          description:'already registered'
        })
      }

    })
})



router.post('/update-listing-details',upload.single('banner_image'), (req, res) => {
    let body = req.body;

     body['banner_image'] = req.file.filename
   console.log(body)
   pool.query(`update affiliate  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json({
          msg:'success'
        })
    })
})








module.exports = router;