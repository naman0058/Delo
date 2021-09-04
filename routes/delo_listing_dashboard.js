var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'booking_dashboard_login'

var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var number='9716460730';
var message='hii';
var senderid='DELOTM';
var route='4';
var dialcode='91';
const { Expo } = require('expo-server-sdk')





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




router.get('/',(req,res)=>{
	var query = `select count(id) as pending_listing from listing where status = 'pending';`
	var query1 = `select count(id) as active_listing from listing where status = 'approved';`
	pool.query(query+query1,(err,result)=>{
		if(err) throw err;
		else res.render('delo_listing_dashboard',{result:result});
	}) 
})


router.get('/requested_listing',(req,res)=>{
	 pool.query(`select l.* , (select c.name from dial_category c where c.id = l.categoryid) as categoryname from listing l where l.status = 'pending' order by id desc `,(err,result)=>{
        if(err) throw err;
        else  res.json(result)
    })
})



router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from listing where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})



router.post('/accept', (req, res) => {
    console.log(req.body)
    pool.query(`update listing set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})

router.get('/advertise', (req, res) => {
     pool.query(`select * from advertise`, (err, result) => {
        if(err) throw err;
        else res.render('advertise_show',{result:result});
    })
})




router.get('/free-listing-list',(req,res)=>{
    pool.query(`select l.* , c.name as categoryname from listing l left join dial_category c on l.categoryid = c.id order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render('free-listing-list',{result:result,status:'Free Listing Details'})
    })
})



router.get('/paid-listing-list',(req,res)=>{
    pool.query(`select * from listing where expiry_date is not null order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render('free-listing-list',{result:result,status:'Paid Listing Details'})
    })
})



router.get('/full-details',(req,res)=>{
      var query = `select * from listing where id="${req.query.id}";`
      var query1 = `select * from also_listing where userid = "${req.query.id}";`
      pool.query(query+query1,(err,result)=>{
        err ? console.log(err) : res.render('listing-full-details',{result:result})
      })
})


router.get('/view-work-details',(req,res)=>{
  var query = `select * from dial_user where partner_number = "${req.query.partner_number}" and status = 'sms';`
  var query1 = `select * from dial_user where partner_number = "${req.query.partner_number}" and status = 'whatsapp';`
  pool.query(query+query1,(err,result)=>{
    err ? console.log(err) : res.render('lead_information',{result:result})
  })

})




router.post('/send_message',(req,res)=>{
 let body = req.body
  body['date'] = today;
  body['time'] = todaytime;
    console.log(req.body)
    msg91.sendOne(authkey,req.body.number,req.body.message,senderid,route,dialcode,function(response){

pool.query(`insert into normal_message set ?`, body , (err,result)=>{
  if(err) throw err;
  else res.send(result)
})

        //Returns Message ID, If Sent Successfully or the appropriate Error Message
      
         
        })
})


module.exports = router;