var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'services';
var upload = require('./multer');
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
var dialcode='91';
var payumoney = require('payumoney-node');
var checksum = require('../lib/checksum');
payumoney.setKeys(`${process.env.PAYUMONEYKEY1}`, `${process.env.PAYUMONEYKEY2}`,`${process.env.PAYUMONEYKEY3}`); 
payumoney.isProdMode(true);
const fetch = require('node-fetch');


const { Expo } = require('expo-server-sdk')



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

// router.get('/', (req, res) => {
//     res.render(`appointment_service`, { login: true , msg : '' });
  
// })


router.get('/', (req, res) => {
    res.render(`${table}`, { login: true , msg : '' });
  
})

router.post('/insert',upload.single('logo'), (req, res) => {
    let body = req.body;
    if(body.discount=="" || body.discount==[] || body.discount == null || body.discount == "null"){
        body['price'] = body.total_price
    }
    else{
    var finalprice = +(body.total_price) - ((body.total_price) * (body.discount) )/100;
     body['price'] = finalprice
    }
    body['logo'] = req.file.filename
    console.log(req.body)
   pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('services',{msg : 'Successfully Inserted'})
    })
})

router.get('/single', (req, res) => {
    const { id} = req.query;
    if(req.session.id) {
     
    pool.query(`select * from answer where subjectid =${id}  `, (err, result) => {
        if(err) throw err;
        else res.render('unitbyid',{result:result,login : true} );
     //   else res.json(result);
    })
}
else {
    pool.query(`select * from answer where subjectid =${id}  `, (err, result) => {
        if(err) throw err;
  else  res.render('unitbyid',{result:result,login : false} );

    })
}
})






router.get('/all', (req, res) => {
    if(req.session.adminid){
    pool.query(`select s.* ,(select c.name from category c where c.id=s.categoryid) as categoryname,
                (select sc.name from subcategory sc where sc.id=s.subcategoryid) as subcategoryname
                 from ${table} s`
                , (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
}
else res.render(`admin`, { msg : 'please login' });
})




router.get('/single', (req, res) => {
    const { id } = req.query
    pool.query(`select * from ${table} where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})

router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})

router.post('/update', (req, res) => {
   let body = req.body
    if(body.discount=="" || body.discount==[] || body.discount == null || body.discount == "null"){
        body['price'] = body.total_price
    }
    else{
        var finalprice = +(body.total_price) - ((body.total_price) * (body.discount) )/100;
     body['price'] = finalprice
    }
    console.log(req.body) 
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.post('/update_image',upload.single('logo'), (req, res) => {
    let body = req.body;

    body['logo'] = req.file.filename

    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/services')
    })
})




///Pay with mobikwik normal

router.get('/paywithmobikwik',(req,res)=>{
    var random =   Math.floor(Math.random() * 1000000000) + 1;
    var servicedata = {
        merchantIdentifier: '538b76b5342f498a8ccdb85da7a17baa',
        orderId: random,
        currency: 'INR',
        amount: ((req.session.reqprice)*100).toString(),
       buyerEmail: req.session.reqemail,
       buyerPhoneNumber: req.session.usernumber,
          buyerFirstName: req.session.reqname,
        returnUrl: "https://www.deloservices.com/services/booking_successfull_payement_mobikwik", //\"https://localhost:3000/payu/success"
    
    };
   
    var checksumstring = checksum.getChecksumString(servicedata);
    console.log("checksum string:"+checksumstring);
    var calculatedchecksum = checksum.calculateChecksum(checksumstring);
    console.log("checksum "+calculatedchecksum)
var servicedata = {
    merchantIdentifier: '538b76b5342f498a8ccdb85da7a17baa',
    orderId: random,
    currency: 'INR',
    amount: ((req.session.reqprice)*100).toString(),
   buyerEmail: req.session.reqemail,
   buyerPhoneNumber: req.session.usernumber,
      buyerFirstName: req.session.reqname,
    returnUrl: "https://www.deloservices.com/services/booking_successfull_payement_mobikwik", //\"https://localhost:3000/payu/success"
 
};

    if(req.session.usernumber){
  console.log("myservicedata",servicedata)
 console.log("mychecksum : "+calculatedchecksum)
        res.render('transact', {
            data: servicedata,
            checksum: calculatedchecksum
        });
    }
    else   res.redirect('/login')


})






///Pay with mobikwik with membership




router.get('/paywithmobikwikwithmembership',(req,res)=>{
    var random =   Math.floor(Math.random() * 1000000000) + 1;
    var servicedata = {
        merchantIdentifier: '538b76b5342f498a8ccdb85da7a17baa',
        orderId: random,
        currency: 'INR',
        amount: ((req.session.reqprice)*100).toString(),
       buyerEmail: req.session.reqemail,
       buyerPhoneNumber: req.session.usernumber,
          buyerFirstName: req.session.reqname,
        returnUrl: "https://www.deloservices.com/services/booking_successfull_payement_mobikwik_withmembership", //\"https://localhost:3000/payu/success"
    
    };
   
    var checksumstring = checksum.getChecksumString(servicedata);
    console.log("checksum string:"+checksumstring);
    var calculatedchecksum = checksum.calculateChecksum(checksumstring);
    console.log("checksum "+calculatedchecksum)
var servicedata = {
    merchantIdentifier: '538b76b5342f498a8ccdb85da7a17baa',
    orderId: random,
    currency: 'INR',
    amount: ((req.session.reqprice)*100).toString(),
   buyerEmail: req.session.reqemail,
   buyerPhoneNumber: req.session.usernumber,
      buyerFirstName: req.session.reqname,
    returnUrl: "https://www.deloservices.com/services/booking_successfull_payement_mobikwik_withmembership", //\"https://localhost:3000/payu/success"
 
};

    if(req.session.usernumber){
  console.log("myservicedata",servicedata)
 console.log("mychecksum : "+calculatedchecksum)
        res.render('transact', {
            data: servicedata,
            checksum: calculatedchecksum
        });
    }
    else   res.redirect('/login')


})




///Pay with mobikwik with already member

router.get('/paywithmobikwikwithalreadymember',(req,res)=>{
    var random =   Math.floor(Math.random() * 1000000000) + 1;
    var servicedata = {
        merchantIdentifier: '538b76b5342f498a8ccdb85da7a17baa',
        orderId: random,
        currency: 'INR',
        amount: (((req.session.reqprice)*100).toString())-100,
       buyerEmail: req.session.reqemail,
       buyerPhoneNumber: req.session.usernumber,
          buyerFirstName: req.session.reqname,
        returnUrl: "https://www.deloservices.com/services/booking_successfull_payement_mobikwik_withmembership", //\"https://localhost:3000/payu/success"
    
    };
   
    var checksumstring = checksum.getChecksumString(servicedata);
    console.log("checksum string:"+checksumstring);
    var calculatedchecksum = checksum.calculateChecksum(checksumstring);
    console.log("checksum "+calculatedchecksum)
var servicedata = {
    merchantIdentifier: '538b76b5342f498a8ccdb85da7a17baa',
    orderId: random,
    currency: 'INR',
    amount: (((req.session.reqprice)*100).toString())-100,
   buyerEmail: req.session.reqemail,
   buyerPhoneNumber: req.session.usernumber,
      buyerFirstName: req.session.reqname,
    returnUrl: "https://www.deloservices.com/services/booking_successfull_payement_mobikwik_withmembership", //\"https://localhost:3000/payu/success"
 
};

    if(req.session.usernumber){
  console.log("myservicedata",servicedata)
 console.log("mychecksum : "+calculatedchecksum)
        res.render('transact', {
            data: servicedata,
            checksum: calculatedchecksum
        });
    }
    else   res.redirect('/login')


})



router.get('/fail',(req,res)=>{
    res.render('failed')
    })


router.post('/fail',(req,res)=>{
res.render('failed')
})



router.post('/booking_successfull_payement_withmembership',(req,res)=>{

 var ournumber = '919873159745'
 if(req.body.responseCode == 100){
    var bookmsg = req.session.reqbokkingid
    console.log("subcategoryid",req.session.reqmembershipprice)
      let body = req.body

   
      if(req.session.reqmembershipprice){
        body['memebershipprice'] = req.session.reqmembershipprice
    }
    else{
      body['memebershipprice'] = 0
    }

        body['usernumber'] = req.session.usernumber
        body['name'] = req.session.reqname
        body['email'] = req.session.reqemail
        body['address'] = req.session.reqaddress
        body['date'] = req.session.reqdate
        body['time'] = req.session.reqtime
        body['price'] = req.session.reqprice
        body['booking_id'] =  req.session.reqbokkingid
        body['booking_date'] = today  
       body['pincode'] = req.session.reqpincode
        body['working_otp'] = req.session.working_otp
        body['quantity'] = req.session.reqquantity
        body['teamprice'] = req.session.reqteamprice
        body['booking_time'] = todaytime
    
        console.log(req.body)
    if(req.session.usernumber){
      pool.query(`insert into booking (name,email,usernumber,address,date,time,booking_date,booking_id,price,payment_mode,pincode,working_otp,quantity,categoryid,subcategoryid,teamprice,membershipprice,promocode,booking_time,color,terms_and_conditions) 
       values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
       ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','online','${req.session.reqpincode}','${req.session.working_otp}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.session.reqteamprice}','${body.memebershipprice}','','${req.body.booking_time}','#507ec0','accept')`,(err,result)=>{
              if(err) throw err;
              else {

               pool.query(`insert into our_member (validity,date,membershipprice,usernumber,code,categoryid) values('${req.session.reqvalidity}','${today}','${req.session.reqmembershipprice}','${req.session.usernumber}','DELO${req.session.reqvalidity}67','${req.session.reqcategoryid[0]}')`,(err,result)=>{
                   if(err) throw err;
                   else{
                       pool.query(`delete from membership_cart where usernumber = '${req.session.usernumber}'`,(Err,result)=>{
                           if(err) throw err;
                           else{
                         

                
                  pool.query(`delete from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                      if(err) throw err;
                     else{


                        pool.query(`delete from checkout_details where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                            if(err) throw err;
                           else{ 
                     
 
                            //Returns Message ID, If Sent Successfully or the appropriate Error Message
                           
                             
                        

                            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, Thanks for your request. We have recieved your booking for ${body.date},${body.time}. For any help, click on https://tinyurl.com/v6pj3fj `,senderid,route,dialcode,function(response){
 
                       if(err) throw err;
                       else{
                        msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, You are now  our delo member. You can save 3600 rs per year through this code DELO${req.session.reqvalidity}67 For any help, click on https://tinyurl.com/v6pj3fj`,senderid,route,dialcode,function(response){
                            if(err) throw err;
                            else{

                                msg91.sendOne(authkey,ournumber,`A new services is booked by ${body.name} on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(response){
                                    if(err) throw err;
                                    else{
  
  if(req.session.reqcategoryid == '9'){
  
  
      pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' and subcategoryid = "${req.session.reqsubcategoryid[0]}" `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
              console.log("team member",result)
              console.log('req.session.reqbokkingid[0]',bookmsg)
              for(i=0;i<result.length;i++){ 


                msg91.sendOne(authkey,result[i].number,`Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
 
                    //Returns Message ID, If Sent Successfully or the appropriate Error Message
                   
                     
                    })


             
              
              }


             res.redirect('/booking')
             
          }

          else{



            msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible.`,senderid,route,dialcode,function(response){
 
                //Returns Message ID, If Sent Successfully or the appropriate Error Message
               
                 
                })

        
              
              
              res.redirect('/booking')

        }


      })
  
  }
  else{
  
  
      pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' 
      
  
      
      `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
              console.log(result)
              console.log('req.session.reqbokkingid[0]',bookmsg)
              for(i=0;i<result.length;i++){ 


                msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible.`,senderid,route,dialcode,function(response){
 
                    //Returns Message ID, If Sent Successfully or the appropriate Error Message
                   
                     
                    })




                     msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
                
            }) 
              
              }







              
              res.redirect('/booking')
             
          }
          else{
            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
                
            }) 
              
              
              res.redirect('/booking')

        }

      })
  
  }
  
                      
                       }
                      });
                            
                    }
                })
            }
        })
            }
        })
    }
})
    }
})

                     }
                  })
              };
          }) 
       }
       else{
        res.redirect('/booking')
       }  
    }
    else{
        

        let body = req.body


    
        body['usernumber'] = req.session.usernumber
        body['name'] = req.session.reqname
        body['email'] = req.session.reqemail
        body['address'] = req.session.reqaddress
        body['date'] = req.session.reqdate
        body['time'] = req.session.reqtime
        body['price'] = req.session.reqprice
        body['booking_id'] =  req.session.reqbokkingid
        body['booking_date'] = today  
        body['pincode'] = req.session.reqpincode
        body['working_otp'] = req.session.working_otp
        body['quantity'] = req.session.reqquantity
        body['teamprice'] = req.session.reqteamprice
        body['booking_time'] = todaytime

        console.log("Body",req.body)

        console.log("name",req.session.reqname)
    
        pool.query(`insert into failed_payment (name,email,usernumber,address,date,time,booking_date,booking_id,price,pincode,quantity,categoryid,subcategoryid,failure_reason,orderid,checksum,booking_time) 
        values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
        ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','${req.session.reqpincode}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.body.responseDescription}','${req.body.orderId}','${req.body.checksum}','${req.body.booking_time}')`,(err,result)=>{
               if(err) throw err;
               else res.redirect('/services/fail')
        })
      
       
    }
})








router.post('/booking_successfull_payement_mobikwik',(req,res)=>{
  if(req.body.responseCode == 100){
     var ournumber = '919873159745'
    var bookmsg = req.session.reqbokkingid
    console.log("subcategoryid",req.session.reqmembershipprice)
      let body = req.body


    
        body['usernumber'] = req.session.usernumber
        body['name'] = req.session.reqname
        body['email'] = req.session.reqemail
        body['address'] = req.session.reqaddress
        body['date'] = req.session.reqdate
        body['time'] = req.session.reqtime
        body['price'] = req.session.reqprice
        body['booking_id'] =  req.session.reqbokkingid
        body['booking_date'] = today  
       body['pincode'] = req.session.reqpincode
        body['working_otp'] = req.session.working_otp
        body['quantity'] = req.session.reqquantity
        body['teamprice'] = req.session.reqteamprice
        body['booking_time'] = todaytime
    
       
    if(req.session.usernumber){
      pool.query(`insert into booking (name,email,usernumber,address,date,time,booking_date,booking_id,price,payment_mode,pincode,working_otp,quantity,categoryid,subcategoryid,teamprice,membershipprice,promocode,orderid,checksum,booking_time,color,terms_and_conditions) 
       values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
       ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','online','${req.session.reqpincode}','${req.session.working_otp}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.session.reqteamprice}','','','${req.body.orderId}','${req.body.checksum}','${req.body.booking_time}','#507ec0','accept')`,(err,result)=>{
              if(err) throw err;
              else {

             
                  pool.query(`delete from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                      if(err) throw err;
                     else{

                        pool.query(`delete from checkout_details where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                            if(err) throw err;
                           else{ 

                     msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, Thanks for your request. We have recieved your booking for ${body.date},${body.time}. For any help, click on https://tinyurl.com/v6pj3fj`,senderid,route,dialcode,function(response){
                       if(err) throw err;
                       else{
                       
                        msg91.sendOne(authkey,ournumber,`A new services is booked by ${body.name} on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(response){
                            if(err) throw err;
                            else{
                           
  
  if(req.session.reqcategoryid == '9'){
  
  
      pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' and subcategoryid = "${req.session.reqsubcategoryid[0]}" 
    
  
      `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
              console.log("team member",result)
              console.log('req.session.reqbokkingid[0]',bookmsg)
              for(i=0;i<result.length;i++){ 
                     msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
                
            }) 
              
              }




           
              res.redirect('/booking')
             
          }



          else{

            msg91.sendOne(authkey,body.number,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){

           
                
            }) 
              
              
              res.redirect('/booking')

        }


      })
  
  }
  else{
  
  
      pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' 
      
      
      `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
              console.log(result)
              console.log('req.session.reqbokkingid[0]',bookmsg)
              for(i=0;i<result.length;i++){ 
                     msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
                
            }) 
              
              }


              res.redirect('/booking')
             
          }


          else{

         

            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
                
            }) 
              
              
              res.redirect('/booking')

        }



      })
  
  }
  
                      
                       }
                      });
                            
                   

                     }
                  })
                }
            })
                }
                
            })
              };
          }) 
       }
       else{
           res.redirect('/login')
       }  
    }
    else{
        

        let body = req.body


    
        body['usernumber'] = req.session.usernumber
        body['name'] = req.session.reqname
        body['email'] = req.session.reqemail
        body['address'] = req.session.reqaddress
        body['date'] = req.session.reqdate
        body['time'] = req.session.reqtime
        body['price'] = req.session.reqprice
        body['booking_id'] =  req.session.reqbokkingid
        body['booking_date'] = today  
        body['pincode'] = req.session.reqpincode
        body['working_otp'] = req.session.working_otp
        body['quantity'] = req.session.reqquantity
        body['teamprice'] = req.session.reqteamprice
        body['booking_time'] = todaytime

        console.log("Body",req.body)

        console.log("name",req.session.reqname)
    
        pool.query(`insert into failed_payment (name,email,usernumber,address,date,time,booking_date,booking_id,price,pincode,quantity,categoryid,subcategoryid,failure_reason,orderid,checksum,booking_time) 
        values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
        ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','${req.session.reqpincode}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.body.responseDescription}','${req.body.orderId}','${req.body.checksum}','${req.body.booking_time}')`,(err,result)=>{
               if(err) throw err;
               else res.redirect('/services/fail')
        })

       
    }
})
  




router.post('/booking_successfull_payement_mobikwik_withmembership',(req,res)=>{

    if(req.body.responseCode == 100){
  
    var ournumber = '919873159745'
    var bookmsg = req.session.reqbokkingid
    console.log("subcategoryid",req.session.reqmembershipprice)
      let body = req.body

   
      if(req.session.reqmembershipprice){
        body['memebershipprice'] = req.session.reqmembershipprice
    }
    else{
      body['memebershipprice'] = 0
    }

        body['usernumber'] = req.session.usernumber
        body['name'] = req.session.reqname
        body['email'] = req.session.reqemail
        body['address'] = req.session.reqaddress
        body['date'] = req.session.reqdate
        body['time'] = req.session.reqtime
        body['price'] = req.session.reqprice
        body['booking_id'] =  req.session.reqbokkingid
        body['booking_date'] = today  
       body['pincode'] = req.session.reqpincode
        body['working_otp'] = req.session.working_otp
        body['quantity'] = req.session.reqquantity
        body['teamprice'] = req.session.reqteamprice
        body['booking_time'] = todaytime
    
        console.log(req.body)
    if(req.session.usernumber){
      pool.query(`insert into booking (name,email,usernumber,address,date,time,booking_date,booking_id,price,payment_mode,pincode,working_otp,quantity,categoryid,subcategoryid,teamprice,membershipprice,promocode,orderid,checksum,booking_time,color,terms_and_conditions) 
       values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
       ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','online','${req.session.reqpincode}','${req.session.working_otp}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.session.reqteamprice}','${body.memebershipprice}','','${req.body.orderId}','${req.body.checksum}','${req.body.booking_time}','#507ec0','accept')`,(err,result)=>{
              if(err) throw err;
              else {

               pool.query(`insert into our_member (validity,date,membershipprice,usernumber,code,categoryid) values('${req.session.reqvalidity}','${today}','${req.session.reqmembershipprice}','${req.session.usernumber}','DELO${req.session.reqvalidity}67','${req.session.reqcategoryid[0]}')`,(err,result)=>{
                   if(err) throw err;
                   else{
                       pool.query(`delete from membership_cart where usernumber = '${req.session.usernumber}'`,(Err,result)=>{
                           if(err) throw err;
                           else{
                         
                
                  pool.query(`delete from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                      if(err) throw err;
                     else{

                        pool.query(`delete from checkout_details where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                            if(err) throw err;
                           else{ 

                     msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, Thanks for your request. We have recieved your booking for ${body.date},${body.time}. For any help, click on https://tinyurl.com/v6pj3fj`,senderid,route,dialcode,function(response){
                       if(err) throw err;
                       else{

                        msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, You are now  our delo member. You can save 3600 rs per year through this code DELO${req.session.reqvalidity}67 For any help, click on https://www.deloservices.com/help`,senderid,route,dialcode,function(response){

                      
                            if(err) throw err;
                            else{

                                msg91.sendOne(authkey,ournumber,`A new services is booked by ${body.name} on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(response){
                                    if(err) throw err;
                                    else{
  
  if(req.session.reqcategoryid == '9'){
  
  
      pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' and subcategoryid = "${req.session.reqsubcategoryid[0]}" 
  
  
      `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
              console.log("team member",result)
              console.log('req.session.reqbokkingid[0]',bookmsg)
              for(i=0;i<result.length;i++){ 
                     msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
                
            }) 
              
              }



             
  
             res.redirect('/booking')
             
          }


          else{
            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
                
            }) 
              
              
              res.redirect('/booking')

        }



      })
  
  }
  else{
  
  
      pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' 
     
  
      
      `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
              console.log(result)
              console.log('req.session.reqbokkingid[0]',bookmsg)
              for(i=0;i<result.length;i++){ 
                     msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
                
            }) 
              
              }


       
              res.redirect('/booking')
             
          }



          else{
            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
                
            }) 
              
              
              res.redirect('/booking')

        }


      })
  
  }
  
                      
                       }
                      });
                            
                    }
                })
                       }
                    })
                }
            })
            }
        })
    }
})

                     }
                  })
              };
          }) 
       }
       else{
        res.redirect('/booking')
       }  
    }
    else{
    
        pool.query(`insert into failed_payment (name,email,usernumber,address,date,time,booking_date,booking_id,price,pincode,quantity,categoryid,subcategoryid,failure_reason,orderid,checksum) 
        values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
        ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','${req.session.reqpincode}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.body.responseDescription}','${req.body.orderId}','${req.body.checksum}')`,(err,result)=>{
               if(err) throw err;
               else res.redirect('/services/fail')
        })


    }
})





router.post('/booking_successfull_payement',(req,res)=>{

    var ournumber = '919873159745' 
    var bookmsg = req.session.reqbokkingid
    console.log("subcategoryid",req.session.reqmembershipprice)
      let body = req.body


    
        body['usernumber'] = req.session.usernumber
        body['name'] = req.session.reqname
        body['email'] = req.session.reqemail
        body['address'] = req.session.reqaddress
        body['date'] = req.session.reqdate
        body['time'] = req.session.reqtime
        body['price'] = req.session.reqprice
        body['booking_id'] =  req.session.reqbokkingid
        body['booking_date'] = today  
       body['pincode'] = req.session.reqpincode
        body['working_otp'] = req.session.working_otp
        body['quantity'] = req.session.reqquantity
        body['teamprice'] = req.session.reqteamprice
        body['booking_time'] = todaytime
       
    if(req.session.usernumber){
      pool.query(`insert into booking (name,email,usernumber,address,date,time,booking_date,booking_id,price,payment_mode,pincode,working_otp,quantity,categoryid,subcategoryid,teamprice,membershipprice,promocode,booking_time,color,terms_and_conditions) 
       values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
       ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','online','${req.session.reqpincode}','${req.session.working_otp}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.session.reqteamprice}','','','${req.body.booking_time}','507ec0','accept')`,(err,result)=>{
              if(err) throw err;
              else {

             
                  pool.query(`delete from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                      if(err) throw err;
                     else{

                        pool.query(`delete from checkout_details where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                            if(err) throw err;
                           else{ 

                     msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, Thanks for your request. We have recieved your booking for ${body.date},${body.time}. For any help, click on https://tinyurl.com/v6pj3fj`,senderid,route,dialcode,function(response){
                       if(err) throw err;
                       else{
                       
                        msg91.sendOne(authkey,ournumber,`A new services is booked by ${body.name} on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(response){
                            if(err) throw err;
                            else{             
  
  if(req.session.reqcategoryid == '9'){
  
  
      pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' and subcategoryid = "${req.session.reqsubcategoryid[0]}" 
      
      `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
              console.log("team member",result)
              console.log('req.session.reqbokkingid[0]',bookmsg)
              for(i=0;i<result.length;i++){ 
                     msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
                
            }) 
              
              }




              res.redirect('/booking')
             
          }


          else{
            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
                
            }) 
              
              
              res.redirect('/booking')

        }



      })
  
  }
  else{
  
  
      pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' 
     
      `,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
              console.log(result)
              console.log('req.session.reqbokkingid[0]',bookmsg)
              for(i=0;i<result.length;i++){ 
                     msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
                
            }) 
              
              }





   
              res.redirect('/booking')
             
          }

          else{
            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
                
            }) 
              
              
              res.redirect('/booking')

        }

         
          
      })
  
  }
  
                      
                       }
                      });
                    }
                }) 
                   

                     }
                  })
                }
            })
              };
          }) 
       }
       else{
           res.redirect('/login')
       }  
})
  




router.get('/booking',(req,res)=>{
   // let body = req.body
   console.log(req.query)


if(req.query.check =="check"){



if(req.query.date && req.query.time[0] || req.query.date && req.query.time[1] ){
   console.log("sahi h") 



   pool.query(`select * from membership_cart where membershipid = "${req.query.categoryid[0]}" and usernumber = "${req.session.usernumber}"`,(err,result)=>{
       if(err) throw err;
       else if(result[0]){
           console.log('result hai',result[0].membershipprice)
           req.session.reqmembershipprice = '5';
           console.log("Session Price12",req.session.reqmembershipprice)
       }
       else{
           
        req.session.reqmembershipprice = 0
       }
   })


   console.log("Session Price",req.session.reqmembershipprice)

   const {price,time} = req.query
    var working_otp =   Math.floor(1000 + Math.random() * 9000);
    var total_price = 0;
    var prices = price.join("-")
    console.log('prices',prices)
    var finalprice = prices.split("-")
    console.log(finalprice)

    

    var times = time.join("-")
    var finaltime = times.split("-")


if(finaltime[0]==[] || finaltime[0]=="" || finaltime[0]==null || finaltime[0]=="null")
 req.session.reqtime = finaltime[1];
else
  req.session.reqtime = finaltime[0];

    for(i=0;i<req.session.counter;i++){
   total_price = +(finalprice[i])+(+total_price);
    }

    if(total_price < 500 && req.query.categoryid=='19' || total_price < 500 && req.query.categoryid=='48' || 
       total_price < 500 && req.query.categoryid=='49' || total_price < 500 && req.query.categoryid=='50' || 
       total_price < 500 && req.query.categoryid=='52' || total_price < 500 && req.query.categoryid=='32'){
        var convenience_charge = '0'
    }
    else if(total_price>500){
      var convenience_charge = '0'
    }
    else{
        var convenience_charge = '149'

    }

    if(req.query.promocode == 'asdfghjklzxcvbnmqwertyuiopfghfchsdfdgshzgdkgfkgz'){
    var discount =  total_price - 30;
    req.session.previousprice = +(discount) + (+convenience_charge); 
    }
    else{
        req.session.previousprice = +(total_price) + (+convenience_charge); 
    }
 



   
  if(req.session.usernumber){



    pool.query(`insert into checkout_details (name,email,address,pincode,date,time,booking_id,price,quantity,categoryid,subcategoryid,booking_time,usernumber,booking_date)
    values('${req.query.name}','${req.query.email}','${req.query.address}','${req.query.pincode}','${req.query.date}','${  req.session.reqtime}','${req.query.booking_id}','${req.session.previousprice}','${req.query.quantity}','${req.query.categoryid[0]}','${req.query.subcategoryid[0]}','${todaytime}','${req.session.usernumber}','${today}')`,(err,result)=>{
        if(err) throw err;
        else{

       

    console.log("body",req.query)  
    var query1 =`select * from membership_cart where membershipid = "${req.query.categoryid[0]}" and usernumber = "${req.session.usernumber}"`
    pool.query(query1,(err,result)=>{
        if(err) throw err;
        else if(result[0]) {
var query = `select sum(cancellation_charge) as cancellation_charge from booking where usernumber = "${req.session.usernumber}";`
var query2 =  `select * from membership_cart where membershipid = "${req.query.categoryid[0]}" and usernumber = "${req.session.usernumber}";`
pool.query(query+query2,(err,result)=>{
                if(err) throw err;
                else {
            req.session.reqname = req.query.name
            req.session.reqemail = req.query.email
            req.session.reqaddress = req.query.address
            req.session.reqdate = req.query.date
            req.session.reqquantity = req.query.quantity /// for our
            req.session.previouscancellationcharge = result[0][0].cancellation_charge /// for our 
            req.session.reqmembershipprice = result[1][0].membershipprice
            req.session.reqvalidity = result[1][0].validity
            req.session.reqprice = +(req.session.previousprice) + (+result[1][0].membershipprice) - 100;
            req.session.reqteamprice =  +(+req.session.previousprice)-(+(req.session.previousprice)*12)/100
            req.session.reqbokkingid = req.query.booking_id
            req.session.reqpincode = req.query.pincode
            req.session.working_otp = working_otp
            req.session.reqcategoryid = req.query.categoryid
            req.session.reqsubcategoryid = req.query.subcategoryid
            req.session.total_price = total_price
           
            console.log(req.query.booking_id);
            console.log("Mytotalprice1",req.session.reqprice)
             res.redirect('/payment_mode');
                }
            })
          
        
     

        }
        else {

    var query = `select sum(cancellation_charge) as cancellation_charge from booking where usernumber = "${req.session.usernumber}";`

    pool.query(query,(err,result)=>{
        if(err) throw err;
        else {
    req.session.reqname = req.query.name
    req.session.reqemail = req.query.email
    req.session.reqaddress = req.query.address
    req.session.reqdate = req.query.date
    req.session.reqquantity = req.query.quantity /// for our
    req.session.previouscancellationcharge = result[0].cancellation_charge /// for our 
    req.session.reqprice = +(req.session.previousprice)
    req.session.reqteamprice =  +(+req.session.previousprice)-(+(req.session.previousprice)*12)/100
    req.session.reqbokkingid = req.query.booking_id
    req.session.reqpincode = req.query.pincode
    req.session.working_otp = working_otp
    req.session.reqcategoryid = req.query.categoryid
    req.session.reqsubcategoryid = req.query.subcategoryid
    req.session.total_price = total_price
    req.session.reqmembershipprice = null;
   
    console.log(req.query.booking_id);
    console.log("Mytotalprice2",req.session.reqprice)
     res.redirect('/payment_mode');
        }
    })
  

}
}) 
}
})

     }

     else{
         res.redirect('/login')
     }
    }
    else{
        res.redirect('/booking/mycartwithmsg')
    }
    }
else{
  res.redirect('/booking/mycart-covid-19-self-declaration')
}
 })




 router.post('/booking',(req,res)=>{
     let body = req.body
    console.log(req.body)
    console.log("subcategoryid",req.session.reqsubcategoryid)
  
    if(req.body.promocode == '123'){
        var discount =  (+(req.body.price) *(req.body.quantity)) - 30;
        req.session.previousprice = discount;
        }
        else{
            req.session.previousprice = +(req.body.price)*(req.body.quantity); 
        }

     var working_otp =   Math.floor(1000 + Math.random() * 9000);
        
   if(req.session.usernumber){
        pool.query(`select sum(cancellation_charge) as cancellation_charge from booking where usernumber = "${req.session.usernumber}"`,(err,result)=>{
         if(err) throw err;
         else {
     req.session.reqname = req.body.name
     req.session.reqemail = req.body.email
     req.session.reqaddress = req.body.address
     req.session.reqdate = req.body.date
     req.session.reqquantity = req.body.quantity /// for our
     req.session.previouscancellationcharge = result[0].cancellation_charge /// for our 
     req.session.reqprice = +(req.session.previousprice) +(result[0].cancellation_charge)
     req.session.reqbokkingid = req.body.booking_id
     req.session.reqpincode = req.body.pincode
     req.session.working_otp = working_otp
     req.session.reqcategoryid = req.body.categoryid[0]
     req.session.reqtime = req.body.time
     console.log(req.body.booking_id);
      res.send('/payment_mode');
         }
     })
   
      }
      else{
          res.redirect('/login')
      } 
  })
 










 
router.post('/booking_successfull',(req,res)=>{
  var bookmsg = req.session.reqbokkingid
  var ournumber = '919873159745'
  console.log("subcategoryid",req.session.reqsubcategoryid[0])
    let body = req.body
   
      body['usernumber'] = req.session.usernumber
      body['name'] = req.session.reqname
      body['email'] = req.session.reqemail
      body['address'] = req.session.reqaddress
      body['date'] = req.session.reqdate
      body['time'] = req.session.reqtime
      body['price'] = req.session.reqprice
      body['booking_id'] =  req.session.reqbokkingid
      body['booking_date'] = today  
     body['pincode'] = req.session.reqpincode
      body['working_otp'] = req.session.working_otp
      body['quantity'] = req.session.reqquantity
      body['booking_time'] = todaytime
  if(req.session.usernumber){
    pool.query(`insert into booking (name,email,usernumber,address,date,time,booking_date,booking_id,price,payment_mode,pincode,working_otp,quantity,categoryid,subcategoryid,teamprice,membershipprice,promocode,booking_time,color,terms_and_conditions) 
     values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
     ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','cash','${req.session.reqpincode}','${req.session.working_otp}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.session.reqteamprice}','','','${req.body.booking_time}','507ec0','accept')`,(err,result)=>{
            if(err) throw err;
            else {
                pool.query(`delete from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                    if(err) throw err;
                   else{


                    pool.query(`delete from checkout_details where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                        if(err) throw err;
                       else{ 


                   msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, Thanks for your request. We have recieved your booking for ${body.date},${body.time}. For any help, click on https://tinyurl.com/v6pj3fj`,senderid,route,dialcode,function(response){
                     if(err) throw err;
                     else{

                        msg91.sendOne(authkey,ournumber,`A new services is booked by ${body.name} on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(response){
                            if(err) throw err;
                            else{



if(req.session.reqcategoryid == '9'){

    pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' and subcategoryid = "${req.session.reqsubcategoryid[0]}" 
   
    
    `,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            console.log("team member",result)
            console.log('req.session.reqbokkingid[0]',bookmsg)
            for(i=0;i<result.length;i++){ 


              msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
              
          }) 
            
            }


           res.redirect('/booking')
           
        }


        else{
            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
                
            }) 
              
              
              res.redirect('/booking')

        }


    })

}
else{


    pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' 
   
    
    `,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            console.log(result)
            console.log('req.session.reqbokkingid[0]',bookmsg)
            for(i=0;i<result.length;i++){ 
              msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
              

             

          }) 
            
            }



           res.redirect('/booking')
           
        }


        else{


            msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
 
                //Returns Message ID, If Sent Successfully or the appropriate Error Message
               
                 
                })

        
              
              res.redirect('/booking')

        }


    })

}
                            
                    
                     }
                    });
                }
            })
                   }
                })
            }
        })
            };
        }) 
     }
     else{
         res.redirect('/login')
     }  
 })
 


 //razorpay

 router.post('/razorpay',(req,res)=>{


    const url = `https://rzp_live_2KlcXieUGyQ8k6:9CukFlVqEBgQ1l7LB03DXBPk@api.razorpay.com/v1/orders/`;
    const data = {
        amount:req.session.reqprice*100,  // amount in the smallest currency unit
      //amount:100,
      currency: 'INR',
        payment_capture: true
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(url, options)
        .then(res => res.json())
        .then(
            resu => res.send(resu)
            
        
        );
      
        

   
 })










 router.post('/dial_razorpay',(req,res)=>{
let body= req.body



console.log(req.body)

var today = new Date();
var newdate = new Date();
    newdate.setDate(today.getDate()+parseInt(req.body.validity));




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
 req.session.validity = my1
req.session.created_date = today
 console.log("valiity aayi",req.session.validity)
/*onsole.log(today)
//console.log(newdate)
console.log(my1)*/





    const url = `https://rzp_live_2KlcXieUGyQ8k6:9CukFlVqEBgQ1l7LB03DXBPk@api.razorpay.com/v1/orders/`;
    const data = {
        amount:req.body.amount,  // amount in the smallest currency unit
      //amount:100,
      currency: 'INR',
        payment_capture: true
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(url, options)
        .then(res => res.json())
        .then(
            resu => res.send(resu)
            
        
        );
      
        

   
 })









 router.post('/rtr_razorpay',(req,res)=>{


    const url = `https://rzp_live_2KlcXieUGyQ8k6:9CukFlVqEBgQ1l7LB03DXBPk@api.razorpay.com/v1/orders/`;
    const data = {
        amount:req.body.amount*100,  // amount in the smallest currency unit
      //amount:100,
      currency: 'INR',
        payment_capture: true
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(url, options)
        .then(res => res.json())
        .then(
            resu => res.send(resu)
            
        
        );
      
        

   
 })






 router.post('/booking_successfull_razorpay',(req,res)=>{
let body = req.body


console.log(todaytime)

    var ournumber = '919873159745'
   var bookmsg = req.session.reqbokkingid
   console.log("subcategoryid",req.session.reqmembershipprice)
    

       body['usernumber'] = req.session.usernumber
       body['name'] = req.session.reqname
       body['email'] = req.session.reqemail
       body['address'] = req.session.reqaddress
       body['date'] = req.session.reqdate
       body['time'] = req.session.reqtime
       body['price'] = req.session.reqprice
       body['booking_id'] =  req.session.reqbokkingid
       body['booking_date'] = today  
      body['pincode'] = req.session.reqpincode
       body['working_otp'] = req.session.working_otp
       body['quantity'] = req.session.reqquantity
       body['teamprice'] = req.session.reqteamprice
       body['booking_time'] = todaytime
   
      
   if(req.session.usernumber){
     pool.query(`insert into booking (name,email,usernumber,address,date,time,booking_date,booking_id,price,payment_mode,pincode,working_otp,quantity,categoryid,subcategoryid,teamprice,membershipprice,promocode,orderid,checksum,booking_time,payment_id,color,terms_and_conditions) 
      values('${req.session.reqname}','${req.session.reqemail}','${req.session.usernumber}','${req.session.reqaddress}'
      ,'${req.session.reqdate}','${req.session.reqtime}','${today}','${req.session.reqbokkingid}','${req.session.reqprice}','online','${req.session.reqpincode}','${req.session.working_otp}','${req.session.reqquantity}','${req.session.reqcategoryid[0]}','${req.session.reqsubcategoryid[0]}','${req.session.reqteamprice}','','','${req.body.razorpay_order_id}','${req.body.razorpay_signature}','${todaytime}','${req.body.razorpay_payment_id}','507ec0','accept')`,(err,result)=>{
             if(err) throw err;
             else {

            
                 pool.query(`delete from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                     if(err) throw err;
                    else{


                        pool.query(`delete from checkout_details where usernumber = "${req.session.usernumber}"`,(err,result)=>{
                            if(err) throw err;
                           else{ 

                    msg91.sendOne(authkey,body.usernumber,`Hello ${body.name}, Thanks for your request. We have recieved your booking for ${body.date},${body.time}. For any help, click on https://tinyurl.com/v6pj3fj`,senderid,route,dialcode,function(response){
                      if(err) throw err;
                      else{
                      
                       msg91.sendOne(authkey,ournumber,`A new services is booked by ${body.name} on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(response){
                           if(err) throw err;
                           else{
                          
 
 if(req.session.reqcategoryid == '9'){
 
 
     pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' and subcategoryid = "${req.session.reqsubcategoryid[0]}" 
    
     `,(err,result)=>{
         if(err) throw err;
         else if(result[0]){
             console.log("team member",result)
             console.log('req.session.reqbokkingid[0]',bookmsg)
             for(i=0;i<result.length;i++){ 
                    msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
               
           }) 
             
             }



             res.send('/success')
            
         }



         else{

           msg91.sendOne(authkey,body.number,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){

          
               
           }) 
             
             
             res.send('success')

       }


     })
 
 }
 else{
 
 
     pool.query(`select name,number from team where categoryid = '${req.session.reqcategoryid[0]}' 
     
     
     `,(err,result)=>{
         if(err) throw err;
         else if(result[0]){
             console.log(result)
             console.log('req.session.reqbokkingid[0]',bookmsg)
             for(i=0;i<result.length;i++){ 
                    msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.session.reqdate} , ${req.session.reqtime}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
               
           }) 
             
             }

             res.send('success')
            
         }


         else{

        

           msg91.sendOne(authkey,body.usernumber,` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,senderid,route,dialcode,function(response){
               
           }) 
             
             
             res.send('success')

       }



     })
 
 }
 
                     
                      }
                     });
                           
                  

                    }
                 })
                }
            })
               }
           })
             };
         }) 
      }
      else{
          res.send('login')
      }  
   
  
        
     


    })


    router.get('/dem',(req,res)=>{
        res.render(`dem`)
    })
 

router.get('/demo1',(req,res)=>{
    console.log(req.query)
    res.send(req.query)
})





 router.post('/booking_successfull_dial_razorpay',(req,res)=>{
let body = req.body
let usernumber = req.session.listing_number;
let message = `Your business plan has been upgraded unitll ${req.session.validity}...` 
console.log("body hai response ki",req.body)
pool.query(`select * from listing where number = "${req.session.listing_number}"`,(err,result)=>{
  if(err) throw err;
  else {
    console.log(result)
    body['userid'] = result[0].id
    body['expiry_date'] = req.session.validity
    body['created_date'] = req.session.created_date

 pool.query(`insert into paid_listing set ? `,req.body,(err,result)=>{
   if(err) throw err;
   else{
     pool.query(`update listing set created_date = "${req.session.created_date}",expiry_date = "${req.session.validity}" where number = "${req.session.listing_number}"`,(err,result)=>{
      if(err) throw err;
      else {

    msg91.sendOne(authkey, usernumber, message, senderid, route, dialcode, function (response) {

            })

    res.send('success')

      }
    })
  }
})

  }
})
console.log(todaytime)

  

    })
















 router.post('/booking_successfull_mart_razorpay',(req,res)=>{
let body = req.body
let usernumber = req.session.product_number;
let message = `Your business plan has been upgraded unitll ${req.session.validity}...` 
console.log("body hai response ki",req.body)
pool.query(`select * from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
  if(err) throw err;
  else {
    console.log(result)
    body['userid'] = result[0].id
    body['expiry_date'] = req.session.validity
    body['created_date'] = req.session.created_date

 pool.query(`insert into paid_mart_listing set ? `,req.body,(err,result)=>{
   if(err) throw err;
   else{
     pool.query(`update mart_user set validity = "${req.session.validity}" where number = "${req.session.product_number}"`,(err,result)=>{
      if(err) throw err;
      else {

    msg91.sendOne(authkey, usernumber, message, senderid, route, dialcode, function (response) {

            })

    res.send('success')

      }
    })
  }
})

  }
})
console.log(todaytime)

  

    })







module.exports = router;