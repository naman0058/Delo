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

router.get('/',(req,res)=>{
        var query = `select count(id) as total_users from users;`
        var query1 = `select count(id) as cancel_booking from cancel_booking;`
        var query2 = `select count(id) as total_booking from booking;`
        var query3 = `select count(id) as completed_booking from booking where status = 'completed';`
        var query4 = `select sum(price) as total_income from booking;`
        var query5 = `select count(id) as online_booking from booking where payment_mode = 'online';`
        var query6 = `select count(id) as offline_booking from booking where payment_mode = 'cash';`
        var query7 = `SELECT count(distinct usernumber) as booking_customer FROM booking;`
        var query8 = `select * from booking order by id desc limit 10;`
        pool.query(query+query1+query2+query3+query4+query5+query6+query7+query8,(err,result)=>{
            if(err) throw err;
            else  res.render('dial_call_center_dashboard',{msg : '',result: result});
        
        }) 
       
    
})

router.get('/search',(req,res)=>{
	if(req.query.pincode == null || req.query.pincode == "null" || req.query.pincode ==[] || req.query.pincode == null){


pool.query(`select * from listing where categoryid = "${req.query.categoryid}" and cityid="${req.query.cityid}" and localityid = "${req.query.localityid}" order by expiry_date`,(err,result)=>{
	err ? console.log(err) : res.json(result);
})

	}
	else{
pool.query(`select * from listing 
	where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode = ${req.query.pincode} 
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode1 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode2 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode3 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode4 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode5 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode6 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode7 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode8 = ${req.query.pincode}
	order by expiry_date
	`,(err,result)=>{
		err ? console.log(err) : res.json(result)
	})
	}
})


router.post('/send_message',(req,res)=>{
	let body = req.body;
	body['created_date'] = today;
	let partnerid = []
	let randomid = []
	pool.query(`insert into customer_requirement set ?`,body,(err,result)=>{
		if(err) throw err;
		else {
   if(req.body.pincode == null || req.body.pincode == "null" || req.body.pincode ==[] || req.body.pincode == null){

pool.query(`select id , name , number , address1 from listing where categoryid = "${req.body.categoryid}" and cityid="${req.body.cityid}" and localityid = "${req.body.localityid}" order by expiry_date`,(err,result)=>{
	if(err) throw err;
	else{
		
      for(i=0;i<result.length;i++){
      	let message = `\r\n ${result[i].name} - ${result[i].number} \r\n ${result[i].address1} \r\n`
		  partnerid.push(message)


 msg91.sendOne(authkey, result[i].number, `Hii ${result[i].name} , Mr./Mrs. ${req.body.customername}  is looking for you..Please contact on this number ${req.body.customernumber} `, senderid, route, dialcode, function (response) {
  })


	  }
	  console.log('partnerid',partnerid);

for(i=0;i<5;i++){
const randomElement = partnerid[Math.floor(Math.random() * partnerid.length)];
randomid.push(randomElement)
	 }
	 console.log("randomid",randomid);
 

let usernumber = req.body.customernumber;
let messages = `Hii ${req.body.customername} \r\n ${randomid}`
	 msg91.sendOne(authkey, usernumber, messages, senderid, route, dialcode, function (response) {

            })

 res.send('success')

	  
	  
	}
})
	}
	else{
pool.query(`select  id , name , number , address1 from listing 
	where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode = ${req.query.pincode} 
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode1 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode2 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode3 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode4 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode5 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode6 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode7 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode8 = ${req.query.pincode}
	order by expiry_date
	`,(err,result)=>{
		if(err) throw err;
		else{
			
		  for(i=0;i<result.length;i++){
			  let message = `\r\n ${result[i].name} - ${result[i].number} \r\n ${result[i].address1} \r\n`
			  partnerid.push(message)

 msg91.sendOne(authkey, result[i].number, `Hii ${result[i].name} , Mr./Mrs. ${req.body.customername}  is looking for you..Please contact on this number ${req.body.customernumber} `, senderid, route, dialcode, function (response) {

            })


		  }
		  console.log('partnerid',partnerid);
	
	for(i=0;i<5;i++){
	const randomElement = partnerid[Math.floor(Math.random() * partnerid.length)];
	randomid.push(randomElement)
		 }
		 console.log("randomid",randomid);
	 
	
	let usernumber = req.body.customernumber;
	let messages = `Hii ${req.body.customername} \r\n ${randomid}`
		 msg91.sendOne(authkey, usernumber, messages, senderid, route, dialcode, function (response) {
	
				})
	
	
	 res.send('success')
		  
		  
		}
	})
	}
		}
	})
})





router.get('/customer-details',(req,res)=>{
	pool.query(`select c.*,
			  (select ca.name from dial_category ca where ca.id = c.categoryid) as categoryname,
			  (select sub.name from dial_subcategory sub where sub.id = c.subcategoryid) as subcategoryname,
			  (select subs.name from dial_subservices subs where subs.id = c.subservicesid) as subservicesname,
			  (select ci.name from city ci where ci.id = c.cityid ) as cityname,
			  (select lo.name from locality lo where lo.id = c.localityid) as localityname
	from customer_requirement c order by id`,(err,result)=>{
		if(err) throw err;
		//else res.json(result)
		else res.render('dial-customer-details',{result:result})
	})
})
























router.get('/search',(req,res)=>{
	if(req.query.pincode == null || req.query.pincode == "null" || req.query.pincode ==[] || req.query.pincode == null){


pool.query(`select * from listing where categoryid = "${req.query.categoryid}" and cityid="${req.query.cityid}" and localityid = "${req.query.localityid}" order by expiry_date`,(err,result)=>{
	err ? console.log(err) : res.json(result);
})

	}
	else{
pool.query(`select * from listing 
	where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode = ${req.query.pincode} 
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode1 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode2 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode3 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode4 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode5 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode6 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode7 = ${req.query.pincode}
	||  where categoryid = "${req.query.categoryid}" and cityid = "${req.query.cityid}" and pincode8 = ${req.query.pincode}
	order by expiry_date
	`,(err,result)=>{
		err ? console.log(err) : res.json(result)
	})
	}
})


router.post('/send_message/customer',(req,res)=>{
	let body = req.body;
	body['created_date'] = today;
	let partnerid = []
	let randomid = []
	pool.query(`insert into customer_requirement set ?`,body,(err,result)=>{
		if(err) throw err;
		else {
   if(req.body.pincode == null || req.body.pincode == "null" || req.body.pincode ==[] || req.body.pincode == null){

pool.query(`select id , name , number , address from mart_user where subservicesid = "${req.body.categoryid}"`,(err,result)=>{
	if(err) throw err;
	else{
		console.log("gie",result)
      for(i=0;i<result.length;i++){
      	let message = `\r\n ${result[i].name} - ${result[i].number} \r\n ${result[i].address} \r\n`
		  partnerid.push(message)

 msg91.sendOne(authkey, result[i].number, `Hii ${result[i].name} , Mr./Mrs. ${req.body.customername}  is looking for you..Please contact on this number ${req.body.customernumber} `, senderid, route, dialcode, function (response) {

            })

	  }
	  console.log('partnerid',partnerid);

for(i=0;i<5;i++){
const randomElement = partnerid[Math.floor(Math.random() * partnerid.length)];
randomid.push(randomElement)
	 }
	 console.log("randomid",randomid);
 

let usernumber = req.body.customernumber;
let messages = `Hii ${req.body.customername} \r\n ${randomid}`
	 msg91.sendOne(authkey, usernumber, messages, senderid, route, dialcode, function (response) {

            })

	  res.send('success')
	  
	}
})
	}
	else{

	}
		}
	})
})




router.post('/insert_request_looking', (req, res) => {
    let body = req.body;
    pool.query(`insert into customer_request set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.render('not_search',{msg : 'Your Request is successfully submitted..Our team will contact you within 24-48 hours'})
    })
})

router.get('/request', (req, res) => {
     pool.query(`select * from customer_request`, (err, result) => {
        if(err) throw err;
        else res.render('request_show',{result:result});
    })
})



module.exports = router
