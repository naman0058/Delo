var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'partners'
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('284477AL4qLlVYW6525d24849e');
var payumoney = require('payumoney-node');
payumoney.setKeys(`${process.env.PAYUMONEYKEY1}`, `${process.env.PAYUMONEYKEY2}`,`${process.env.PAYUMONEYKEY3}`);
payumoney.isProdMode(true);
//var msg91 = require("msg91")("284477AL4qLlVYW6525d24849e", "DELOTM", "4" );
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
var dialcode='91';

router.get('/',(req,res)=>{
    if(req.session.teamnumber || req.session.loginverify ) {
     var query = `select count(id) as ongoing_leads from booking where date = CURDATE() and service_agent = "${req.session.teamnumber}" and cancellation_charge is null and status is null or service_agent = "${req.session.loginverify}" and date = CURDATE() and  cancellation_charge is null and status is null ;`
     var query1= `select recharge_value from team where number = "${req.session.teamnumber}" or number = "${req.session.loginverify}";`
     var query2 = `select count(id) as upcoming_leads from booking where date = CURDATE() + INTERVAL 1 DAY and service_agent = "${req.session.teamnumber}" and  cancellation_charge is null or service_agent = "${req.session.loginverify}"  and date = CURDATE() + INTERVAL 1 DAY and  cancellation_charge is null; `
     var query3 = `select b.price,b.name,b.booking_id from booking b where  b.service_agent = "${req.session.teamnumber}" and  b.cancellation_charge is null and status = 'completed'  or b.service_agent = "${req.session.loginverify}"  and  b.cancellation_charge is null and status ='completed' order by b.id desc limit 1; `
     pool.query(query+query1+query2+query3,(err,result)=>{
         if(err) throw err;
     else res.render(`team_dashboard`,{result : result})
    //   else  res.json(result)
       
         
     })
      //  
    }
    else res.redirect('/team_login')
})


router.get('/all',(req,res)=>{
  console.log(req.session.pincode)
  console.log(req.session.categoryid)
  if(req.session.categoryid == '9'){
    var query1 = `select b.* from booking b where 
     b.service_agent is null and b.pincode = "${req.session.pincode}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
    || b.service_agent is null and b.pincode = "${req.session.pincode1}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
    || b.service_agent is null and b.pincode = "${req.session.pincode2}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
    || b.service_agent is null and b.pincode = "${req.session.pincode3}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
    || b.service_agent is null and b.pincode = "${req.session.pincode4}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
    || b.service_agent is null and b.pincode = "${req.session.pincode5}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
    || b.service_agent is null and b.pincode = "${req.session.pincode6}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
    || b.service_agent is null and b.pincode = "${req.session.pincode7}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
    || b.service_agent is null and b.pincode = "${req.session.pincode8}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 

     || b.service_agent = "" and b.pincode = "${req.session.pincode}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}" 
     || b.service_agent = "" and b.pincode = "${req.session.pincode1}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}"  
     || b.service_agent = "" and b.pincode = "${req.session.pincode2}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}"  
     || b.service_agent = "" and b.pincode = "${req.session.pincode3}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}"  
     || b.service_agent = "" and b.pincode = "${req.session.pincode4}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}"  
     || b.service_agent = "" and b.pincode = "${req.session.pincode5}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}"  
     || b.service_agent = "" and b.pincode = "${req.session.pincode6}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}"  
     || b.service_agent = "" and b.pincode = "${req.session.pincode7}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}"  
     || b.service_agent = "" and b.pincode = "${req.session.pincode8}" and categoryid = "${req.session.categoryid}" and subcategoryid = "${req.session.subcategoryid}"  

     
     order by id desc`
     
    pool.query(query1,(err,result)=>{
        if(err) throw err;
        else  res.json(result)
      
        
    })
  }
  else{

  var query1 = `select b.* from booking b where  
            b.service_agent is null and b.pincode = "${req.session.pincode}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent is null and b.pincode = "${req.session.pincode1}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent is null and b.pincode = "${req.session.pincode2}" and categoryid = "${req.session.categoryid}" 
            ||  b.service_agent is null and b.pincode = "${req.session.pincode3}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent is null and b.pincode = "${req.session.pincode4}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent is null and b.pincode = "${req.session.pincode5}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent is null and b.pincode = "${req.session.pincode6}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent is null and b.pincode = "${req.session.pincode7}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent is null and b.pincode = "${req.session.pincode8}" and categoryid = "${req.session.categoryid}" 

            || b.service_agent = "" and b.pincode = "${req.session.pincode}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent = "" and b.pincode = "${req.session.pincode1}" and categoryid = "${req.session.categoryid}"
            || b.service_agent = "" and b.pincode = "${req.session.pincode2}" and categoryid = "${req.session.categoryid}"
            || b.service_agent = "" and b.pincode = "${req.session.pincode3}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent = "" and b.pincode = "${req.session.pincode4}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent = "" and b.pincode = "${req.session.pincode5}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent = "" and b.pincode = "${req.session.pincode6}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent = "" and b.pincode = "${req.session.pincode7}" and categoryid = "${req.session.categoryid}" 
            || b.service_agent = "" and b.pincode = "${req.session.pincode8}" and categoryid = "${req.session.categoryid}"   
            
            order by id desc`
  pool.query(query1,(err,result)=>{
      if(err) throw err;
      else  res.json(result)
    
      
  })
}
})



router.get('/leads',(req,res)=>{
  if(req.session.teamnumber || req.session.loginverify ) {
    res.render(`leads`)
  }
  else res.redirect('/team_login')
})



router.get('/wallets',(req,res)=>{
  if(req.session.teamnumber || req.session.loginverify ) {
    var query = `select name,emailid,number,recharge_value from team where number = "${req.session.teamnumber}" or number = "${req.session.loginverify}"`
    pool.query(query,(err,result)=>{
      if(err) throw err;
      else  res.render(`wallets`,{result:result})
    })
   
  }
  else res.redirect('/team_login')
})




router.get('/single',(req,res)=>{
  const {id} = req.query
  pool.query(`select b.* from booking b where b.id = ${id}`,(err,result)=>{
    if(err) throw err;
    else res.render(`single`,{result:result})
  })
})





router.get('/ongoing',(req,res)=>{
  pool.query(`select b.* from booking b where b.date = CURDATE() and b.service_agent = "${req.session.teamnumber}" and  b.cancellation_charge is null and b.status is null or b.service_agent = "${req.session.loginverify}" and b.date = CURDATE() and  b.cancellation_charge is null and b.status is null order by time desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})

router.get('/upcoming',(req,res)=>{
  pool.query(`select b.* ,(select s.name from services s where s.id = b.booking_id) as servicesname from booking b where b.date = CURDATE() + INTERVAL 1 DAY and b.service_agent = "${req.session.teamnumber}" and  b.cancellation_charge is null or b.service_agent = "${req.session.loginverify}"  and b.date = CURDATE() + INTERVAL 1 DAY and  b.cancellation_charge is null order by time desc`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})


router.get('/profile',(req,res)=>{
  pool.query(`select * from team where number = "${req.session.teamnumber}" || number = "${req.session.loginverify}"`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})

router.get('/leads_history',(req,res)=>{
  pool.query(`select b.* from booking b where  b.service_agent = "${req.session.teamnumber}" and  b.cancellation_charge is null and status = 'completed' or b.service_agent = "${req.session.loginverify}"  and  b.cancellation_charge is null and status ='completed'`,(err,result)=>{
    if(err) throw err;
    else res.json(result);
  })
})




router.post('/recharge',(req,res)=>{
  if(req.session.teamnumber || req.session.loginverify ) {
 let body = req.body;
  req.session.productinfo = req.body.productinfo
  req.session.txnid = req.body.txnid
  req.session.ammount = req.body.amount
  req.session.email = req.body.email
  req.session.phone = req.body.phone
  req.session.firstname = req.body.firstname
 
  payumoney.makePayment(body, function(error, response) {
    if (error) {
     throw error;
    } else {
      console.log(response)
       res.send(response)
    }
  });
}
else res.redirect('/team_login')
})


router.post('/success_payment',(req,res)=>{
let body = req.body;
console.log(body)
body['productinfo'] =  req.session.productinfo
body['txnid'] = req.session.txnid
body['email'] = req.session.email


let msg = `your Rs. ${req.session.ammount} recharge is successfull. Benifits Revieved ${req.session.productinfo}`
pool.query(`update team set recharge_value = recharge_value+${req.session.productinfo} where number="${req.session.phone}"`,(err,result)=>{
  if(err) throw err;
  else{
    console.log('Updated')
    console.log('Body',body)
  
    pool.query(`insert into recharge set ?`,body,(err,result)=>{
      if(err) throw err;
      else{
        console.log('send')
        sendOtp.send(req.session.phone, "DELOTM", msg,(err,result)=>{
          if(err) throw err;
          else res.redirect('/team_dashboard/wallets');
        })
      }
    })
  }
}) 
})


router.get('/fail',(req,res)=>{
 res.redirect('/team_dashboard_wallets')
  })

router.post('/fail',(req,res)=>{
  res.redirect('/team_dashboard_wallets')
  })

router.get('/history',(req,res)=>{
  if(req.session.teamnumber || req.session.loginverify ) {
    res.render(`history`)
  }
  else res.redirect('/team_login')
})


router.get('/wallet_history',(req,res)=>{
  pool.query(`select mode,createdOn,productinfo,amount,payment_source from recharge where phone = "${req.session.teamnumber}" or phone = "${req.session.loginverify}" `,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


router.post('/fail_payment',(req,res)=>{
  res.render('failed_payment')
})

router.get('/logout',(req,res)=>{
  req.session.teamnumber = null;
  req.session.loginverify = null;
  res.redirect('/team_login');
})



router.get('/rating',(req,res)=>{
  if(req.session.teamnumber || req.session.loginverify ) {
  pool.query(`select name,rating,review from booking where service_agent = "${req.session.teamnumber}" and  cancellation_charge is null and status ='completed' || service_agent = "${req.session.loginverify}" and cancellation_charge is null and status ='completed' `,(err,result)=>{
    if(err) throw err;
    else res.render(`rating&review`,{result:result})
  })
  }
  else res.redirect('/team_login')
})



router.get('/details',(req,res)=>{
  const {id} = req.query
   var query = `select name ,image from team where number = "${id}";`
    var query1 = `select name,rating , review from booking where service_agent = "${id}" and rating is not null;`
    var query2 =`select avg(rating) as rating from booking where service_agent = "${id}";`
    pool.query(query+query1+query2,(err,result)=>{
      if(err) throw err;
      else res.render(`details`,{result:result})
     

    })
 
})



router.post('/send_message',(req,res)=>{
  let body = req.body
  console.log(body)
  pool.query(`select name,number from team1`,(err,result)=>{
    for(i=0;i<result.length;i++){ 
      console.log("team",result[i].number)  
      msg91.sendOne(authkey,result[i].number, ` Hello ${result[i].name}, ${body.message}`,senderid,route,dialcode,function(response){
 
        //Returns Message ID, If Sent Successfully or the appropriate Error Message
        console.log(response);
         
        })      
      
        }
       
            res.send('success...')
  })
})



router.post('/single_message',(req,res)=>{
  let body = req.body
  console.log(req.body)

  msg91.sendOne(authkey,result[i].number, ` Hello ${body.name}, ${body.singlemessage}`,senderid,route,dialcode,function(response){
 
    //Returns Message ID, If Sent Successfully or the appropriate Error Message
    res.send('successfully')   
     
    })   

 
  
})

module.exports = router;