var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');


const SendOtp = require('sendotp');
const sendOtp = new SendOtp('300563AFuzfOZn9ESb5db12f8f');
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
var dialcode='91';






  var d = new Date();
  var n = d.getDay();

//fp7x58

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


  console.log("aaj day hai",n)



router.get('/', (req, res) => {
    res.render('freelisting' , {msg:'List your business'});
 
})

router.post('/insert',upload.single('image'), (req, res) => {
    let body = req.body;
    body['image'] = req.file.filename
    body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
    body['seo_address'] = (body.address1.split(' ').join('-')).toLowerCase()
    body['status'] = "pending"
    body['created_date'] = today
    console.log("body data",req.body)
    pool.query(`insert into listing set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('freelisting',{msg : 'Your Lisitng is successfully completed.Our executive Will call you withiin 24 - 48 hours'})
    })
})




router.get('/listing-detail',(req,res)=>{
    var query = `select * from category;`
  var query1 = `select id,name from services;`
  var query2 = `select * from dial_category order by name;`
  var query3 = `select image from team where categoryid ="10";`
 pool.query(query+query1+query2+query3,(err,result)=>{
    if(err) throw err;
    else res.render(`listing`, {result : result , login:false});
  })
})


router.post('/send/contact_information', (req, res) => {
  if(req.session.status == 'get_details'){
let body = req.body
body['created_date'] = today
    body['created_time'] = todaytime
    console.log("n",req.body)
    let usernumber = req.session.enquiry_number
console.log("partner_number",req.session.enquiry_partner_number)
console.log("cityid",req.session.enquiry_cityid)
console.log("categoryid",req.session.enquiry_categoryid)

pool.query(`select * from dial_user where number = "${req.session.enquiry_number}"`,(err,result)=>{
  if(err) throw err;
  else{

pool.query(`insert into dial_user (name,number,partner_number,status,counter,created_date,created_time,address,pincode) values( "${req.session.enquiry_name}"  , "${req.session.enquiry_number}" ,"${req.session.enquiry_partner_number}" , 'sms' , '0', "${today}" , "${todaytime}" , "${req.session.enquiry_address}" , "${req.session.enquiry_pincode}")`,(err,result)=>{

if(err) throw err;
else {
 pool.query(`select name,number,address1 from listing where number = "${req.session.enquiry_partner_number}" and categoryid="${req.session.enquiry_categoryid}"`, (err, result) => {
        if (err) throw err;
        else {
          console.log("result h",result)
            let message = `Hi ${req.session.enquiry_name}, your enquiry is recieved successfully. Our Team Member will contact you as soon as`
                msg91.sendOne(authkey, result[0].number, `Hello ${result[0].name}, An new client ${req.session.enquiry_name} is finding you on dial delo. Please pick this lead`, senderid, route, dialcode, function (response) {

                })
            

            msg91.sendOne(authkey, usernumber, message, senderid, route, dialcode, function (response) {

            })

            res.send('success')

        }
    })
}

})


  }
})

  }
    
    else{
     let body = req.body


let partnerid = []
  let randomid = []

    console.log("n",req.body)
    let usernumber = req.session.enquiry_number
console.log("partner_number",req.session.enquiry_partner_number)
console.log("cityid",req.session.enquiry_cityid)
console.log("categoryid",req.session.enquiry_categoryid)

pool.query(`select * from dial_user where number = "${req.session.enquiry_number}"`,(err,result)=>{
  if(err) throw err;
  else{

pool.query(`insert into dial_user (name,number,partner_number,status,counter,created_date,created_time,address,pincode) values( "${req.session.enquiry_name}"  , "${req.session.enquiry_number}" ,"${req.session.enquiry_partner_number}" , 'sms' , '0', "${today}" , "${todaytime}" , "${req.session.enquiry_address}" , "${req.session.enquiry_pincode}")`,(err,result)=>{

if(err) throw err;
else {
 pool.query(`select name,number,address1 from listing where cityid="${req.session.enquiry_cityid}" and categoryid="${req.session.enquiry_categoryid}"`, (err, result) => {
        if (err) throw err;
        else {
              
 for(i=0;i<result.length;i++){
        let message = `\r\n ${result[i].name} - ${result[i].number} \r\n ${result[i].address1} \r\n`
      partnerid.push(message)

    }
    console.log('partnerid',partnerid);

for(i=0;i<5;i++){
const randomElement = partnerid[Math.floor(Math.random() * partnerid.length)];
randomid.push(randomElement)
   }
   console.log("randomid",randomid);
 
  // let messages = `Hii ${req.session.enquiry_name} \r\n ${randomid}`
   let messages = `Hii ${req.session.enquiry_name} your enquiry is recieved successfully. Our Team Member will contact you as soon as`

   for(i=0;i<result.length;i++){
                msg91.sendOne(authkey, result[i].number, `Hello ${result[i].name}, An new client ${req.session.enquiry_name} is finding you on dial delo. Please pick this lead`, senderid, route, dialcode, function (response) {

                })
              }
            

            msg91.sendOne(authkey, usernumber, messages, senderid, route, dialcode, function (response) {

            })

            res.send('success')

        }
    })
}

})


  }
})

  }
    


})



router.get('/filter_data', (req, res) => {
    console.log(req.query)
    pool.query(`select l.* , 
    (select c.name from dial_category c where c.id = "${req.query.categoryid}") as categoryname
    , (select ci.name from city ci where ci.id = "${req.query.cityid}") as cityname
    from listing l where l.cityid="${req.query.cityid}" and l.localityid="${req.query.localityid}" and l.categoryid="${req.query.categoryid}"`, (err, result) => {
        if(err) throw err;
        else if(result[0]) res.send(result)
        else res.send('no-data')
    })
})


router.get('/demo',(req,res)=>{
    res.render('deloworkdemo')
})




router.post('/searching',(req,res)=>{
    let body =  req.body;
    var seo_variable = (body.seo_name.split(' ').join('-')).toLowerCase();
    body['seo_name'] = seo_variable 
   
  
  console.log("searching-data",req.body)
  
   if(body.seo_name==null || body.seo_name=='null' || body.seo_name==[] || body.seo_name==''){
   res.render('not_found')
  }
  else {
   
  pool.query(`select id from dial_category where seo_name = "${req.body.seo_name}"`,(err,result)=>{
    if(err) throw err;
    else{
      let categoryid = result[0].id
      
      var query = `select l.* , (select c.name from dial_category c where c.id = "${categoryid}") as categoryname from listing l where l.categoryid="${categoryid}" and l.cityid="${req.body.city}";`
      var query1 = `select * from dial_category order by name;`
      pool.query(query+query1,(err,result)=>{
          if(err) throw err;
          else if(result[0][0]) res.render(`listing`, {result : result , login:false});
          //else if(result[0]) res.json(result)
          else res.render('not_found')
      })
  
  
  
        
    }
  })
  
  }
  })



  router.get('/list_details',(req,res)=>{
      res.render('listing_detail')
  })





router.post('/claim_now',(req,res)=>{
  let body = req.body;
   req.session.listing_number = req.body.number
   var otp =   Math.floor(100000 + Math.random() * 9000);
   req.session.listing_otp = otp;
   console.log("Request Number",req.session.listing_number);
   console.log("OTP",otp);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else res.render('listing_login', {msg : ''})
         })

})






router.post('/manageCampign',(req,res)=>{
  let body = req.body;
   req.session.listing_number_manage = req.body.number
   var otp =   Math.floor(100000 + Math.random() * 9000);
   req.session.listing_otp = otp;
   console.log("Request Number",req.session.listing_number_manage);
   console.log("OTP",otp);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else res.render('manage_login', {msg : ''})
         })

})







router.post('/send_otp',(req,res)=>{
  let body = req.body;
  console.log('body data',req.body)
   req.session.listing_number1 = req.body.number
   req.session.whatsapp_partner_number = req.body.partner_number
   req.session.whatsapp_name = req.body.name
   var otp =   Math.floor(100000 + Math.random() * 9000);
   req.session.listing_otp = otp;
   console.log("Request Number",req.session.listing_number1);
   console.log("OTP",otp);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else res.send('success')
         })

})



router.post('/enquiry_send_otp',(req,res)=>{
  let body = req.body;
  console.log('body data',req.body)
   req.session.enquiry_number = req.body.number
   req.session.enquiry_name = req.body.name
   req.session.enquiry_cityid = req.body.cityid
   req.session.enquiry_categoryid = req.body.categoryid
   req.session.enquiry_partner_number = req.body.partner_number
   req.session.enquiry_pincode = req.body.pincode
   req.session.enquiry_address = req.body.address
   req.session.status = req.body.status
   var otp =   Math.floor(100000 + Math.random() * 9000);
   req.session.listing_otp = otp;
   console.log("Request Number",req.session.enquiry_number);
   console.log("OTP",otp);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else res.send('success')
         })

})



 
router.get('/enquiry_resendotp',(req,res)=>{
    var otp =   Math.floor(100000 + Math.random() * 9000);
     req.session.listing_otp = otp;
    sendOtp.send(req.session.enquiry_number , "DELOTM", otp,(err,result)=>{
  if(err) throw err;
  else{
    res.send('success')
  }
    })
  })



router.post('/enquiry_otp_verification',(req,res)=>{
  let body = req.body
  console.log("number hai", req.session.enquiry_number)
  let number =  req.session.enquiry_number
  let message = 'Dial Delo gives an oppotunity for you.List your business in dial delo to get more success on your business'
  if( req.session.listing_otp == req.body.otp){
    pool.query(`select * from listing where number = "${req.session.enquiry_number}"`,(err,result)=>{
      if(err) throw err;
     //console.log("data hai iska",result)
      else if(result[0]) res.send('already users')
      else {

            msg91.sendOne(authkey, number, message, senderid, route, dialcode, function (response) {

            })

            res.send('new users')

      }
      }) 
      }
   
  else res.send('Invalid OTP')
})



router.post('/rating_send_otp',(req,res)=>{
  let body = req.body;
  console.log('body data',req.body)
   req.session.listing_number1 = req.body.number
   req.session.ratingname  = req.body.name
   req.session.ratingreview = req.body.review
   req.session.ratingid = req.body.id
   req.session.ratingnumber = req.body.number
   req.session.rating = req.body.rating
   var otp =   Math.floor(100000 + Math.random() * 9000);
   req.session.listing_otp = otp;
   console.log("Request Number",req.session.listing_number1);
   console.log("OTP",otp);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else res.send('success')
         })

})





router.post('/otp_verification',(req,res)=>{
  let body = req.body
  console.log("number hai",req.session.listing_number1)
  let number = req.session.listing_number1
  let message = 'Dial Delo gives an oppotunity for you.List your business in dial delo to get more success on your business'
  if( req.session.listing_otp == req.body.otp){
    pool.query(`select * from listing where number = "${req.session.listing_number}"`,(err,result)=>{
      if(err) throw err;
     // console.log("data hai iska",result)
      else if(result[0]) res.send('already users')
      else {

            msg91.sendOne(authkey, number, message, senderid, route, dialcode, function (response) {

            })

            res.send('new users')

      }
      }) 
      }
   
  else res.send('Invalid OTP')
})







router.post('/whatsapp_otp_verification',(req,res)=>{
  let body = req.body
  body['created_date'] = today
  body['created_time'] = todaytime
  body['status'] = 'whatsapp'
  body['partner_number'] = req.session.whatsapp_partner_number
  body['name'] = req.session.whatsapp_name
  console.log("number hai",req.session.listing_number1)
  let number = req.session.listing_number1
  let message = 'Dial Delo gives an oppotunity for you.List your business in dial delo to get more success on your business'
  if( req.session.listing_otp == req.body.otp){
    pool.query(`insert into dial_user (name,number,partner_number,status,created_date,created_time,counter) values("${req.body.name}" , "${req.session.listing_number1}" , "${req.body.partner_number}" , "${req.body.status}" , "${req.body.created_date}" , "${req.body.created_time}", "0") `,(err,result)=>{
      if(err) throw err;
     // console.log("data hai iska",result)
      else {

            msg91.sendOne(authkey, number, message, senderid, route, dialcode, function (response) {

            })

            res.send('new users')

      }
      }) 
      }
   
  else res.send('Invalid OTP')
})





 
router.get('/resendotp',(req,res)=>{
    var otp =   Math.floor(100000 + Math.random() * 9000);
    sendOtp.send(req.session.listing_number, "DELOTM", otp,(err,result)=>{
  if(err) throw err;
  else{
    res.render('/listing_login')
  }
    })
  })



router.get('/manege_resendotp',(req,res)=>{
    var otp =   Math.floor(100000 + Math.random() * 9000);
    sendOtp.send(req.session.listing_number_manage, "DELOTM", otp,(err,result)=>{
  if(err) throw err;
  else{
    res.render('/manage_login')
  }
    })
  })






router.post('/manage_verificationcomplete',(req,res)=>{
  let body = req.body
  console.log("number hai",req.session.listing_number_manage)
  if( req.session.listing_otp == req.body.otp){
    pool.query(`select * from listing where number = "${req.session.listing_number_manage}"`,(err,result)=>{
      if(err) throw err;
     // console.log("data hai iska",result)
      else if(result[0]) res.redirect('/manage_campign');
      else res.render('manage_login',{msg:'Sorry Number not exists'})
      }) 
      }
   
  else res.render('manage_login',{msg:'Enter Wrong OTP'})
})






router.post('/verificationcomplete',(req,res)=>{
  let body = req.body
  console.log("number hai",req.session.listing_number)
  if( req.session.listing_otp == req.body.otp){
    pool.query(`select * from listing where number = "${req.session.listing_number}"`,(err,result)=>{
      if(err) throw err;
     // console.log("data hai iska",result)
      else if(result[0]) res.redirect('listing_dashboard');
      else res.render('listing_login',{msg:'Sorry Number not exists'})
      }) 
      }
   
  else res.render('listing_login',{msg:'Enter Wrong OTP'})
})








//listing route

router.post('/insert1',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 } , { name: 'image3', maxCount: 1 } ,{ name: 'banner_image', maxCount: 1 }  ]), (req, res) => {
    let body = req.body;
  console.log("body h",req.body)
    var dirt = false
     body['image1'] = req.files['image1'][0].filename
     body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
     body['banner_image'] = req.files['banner_image'][0].filename
     body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
  body['seo_address'] = (body.address1.split(' ').join('-')).toLowerCase()
        
  
    pool.query(`insert into listing set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('success')
    })
})


//product route

router.post('/insert21',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 } , { name: 'image3', maxCount: 1 } , { name: 'image4', maxCount: 1 } , { name: 'main_image', maxCount: 1 }  ]), (req, res) => {
    let body = req.body;
  console.log("body h",req.body)
    var dirt = false
     body['image1'] = req.files['image1'][0].filename
     body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
     body['image4'] = req.files['image4'][0].filename
     body['main_image'] = req.files['main_image'][0].filename
     body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
     body['number'] = req.session.listing_number

  
    pool.query(`insert into delomart_product set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('success')
    })
})





router.get('/all',(req,res)=>{
  var query = `select l.* , (select c.name from dial_category c where c.id = l.categoryid) as categoryname,
               (select s.name from dial_subcategory s where s.id =l.subcategoryid) as subcategoryname,
                (select ci.name from city ci where ci.id = l.cityid) as cityname,
               (select lo.name from locality lo where lo.id =l.subcategoryid) as localityname
              from listing l;`

 pool.query(query,(err,result)=>{
  err ? console.log(err) : res.json(result)
 })             

})




router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from listing where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.post('/update', (req, res) => {
    console.log(req.body)
    pool.query(`update listing set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.post('/update_image',upload.single('banner_image'), (req, res) => {
    let body = req.body;

     body['banner_image'] = req.file.filename
   console.log(body)
   pool.query(`update listing  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/dial_subcategory/free-listing')
    })
})






router.post('/update_image1',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 } , { name: 'image3', maxCount: 1 } ]), (req, res) => {
    let body = req.body;

   body['image1'] = req.files['image1'][0].filename
    body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
   console.log(body)
   pool.query(`update listing  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/dial_subcategory/free-listing')
    })
})






router.post('/send/sms', (req, res) => {
    let body = req.body
    let usernumber =  req.body.number
    let partner_number =  req.body.partner_number
    
    body['status'] = 'sms'
    body['created_date'] = today
    body['created_time'] = todaytime
    body['counter'] = 0


pool.query(`select * from dial_user where number = "${req.body.number}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {

 pool.query(`insert into dial_user set ?`,body,(err,result)=>{
if(err) throw err;
      else {

  pool.query(`select name,number,address1,address2 from listing where number = "${req.body.partner_number}"`, (err, result) => {
        if (err) throw err;
        else {
          // console.log("result data",result);
            let message = `Hi ${req.body.name},your enquiry is recieved successfully. Our Team Member will contact you as soon as`
             msg91.sendOne(authkey, usernumber, message, senderid, route, dialcode, function (response) {

            })

            res.send('success')

        }
    })
   }
 })

  }
  else{
    pool.query(`insert into dial_user set ?`,body,(err,result)=>{
      if(err) throw err;
      else {
  pool.query(`select name,number,address1,address2 from listing where number = "${req.body.partner_number}"`, (err, result) => {
        if (err) throw err;
        else {
          // console.log("result data",result);
             let message = `Hi ${req.body.name},your enquiry is recieved successfully. Our Team Member will contact you as soon as`
             msg91.sendOne(authkey, usernumber, message, senderid, route, dialcode, function (response) {

            })

            res.send('success')

        }
    })
      }
    })
  }
})


  


})




router.get('/listing_dashboard',(req,res)=>{
  if(req.session.listing_number){
      pool.query(`select * from listing where number = "${req.session.listing_number}"`,(err,result)=>{
    if(err) throw err;
    else res.render('listing_dashboard',{result:result})
  })
  }
  else{
    res.send("You don't have access")
  }

})





router.get('/add-product',(req,res)=>{
  if(req.session.listing_number){
     res.render('add-product')
  }
  else{
    res.send("You don't have access")
  }

})







router.get('/listing_dashboard/update_image',(req,res)=>{
  if(req.session.listing_number){
      pool.query(`select * from listing where number = "${req.session.listing_number}"`,(err,result)=>{
    if(err) throw err;
    else res.render('listing_dashboard_update_image',{result:result})
  })
  }
  else{
    res.send("You don't have access")
  }

})



router.post('/listing_dashboard_update_image',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 } , { name: 'image3', maxCount: 1 } ]), (req, res) => {
    let body = req.body;

   body['image1'] = req.files['image1'][0].filename
    body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
   console.log(body)
   pool.query(`update listing  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/free-listing/listing_dashboard/update_image')
    })
})




router.get('/listing_dashboard/update_banner_image',(req,res)=>{
  if(req.session.listing_number){
    console.log("your number",req.session.listing_number)
      pool.query(`select * from listing where number = "${req.session.listing_number}"`,(err,result)=>{
    if(err) throw err;
    else res.render('listing_dashboard_update_banner_image',{result:result})
  })
  }
  else{
    res.send("You don't have access")
  }

})





router.post('/listing_dashboard_update_banner_image',upload.single('banner_image'), (req, res) => {
    let body = req.body;

     body['banner_image'] = req.file.filename
   console.log(body)
   pool.query(`update listing  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/free-listing/listing_dashboard/update_banner_image')
    })
})


router.get('/get_all_data',(req,res)=>{
  pool.query(`select * from listing where number = "${req.session.listing_number}"`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})





router.post('/store_users',(req,res)=>{
  body['status'] = 'sms'
   body['created_date'] = today
    body['created_time'] = todaytime
    body['counter'] = 0
  pool.query(`select * from dial_users where number = "${req.body.number}"`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){

    }
    else{
      pool.query(`insert into dial_users set ?`,body,(err,result)=>{
        if(err)throw err;
        else res.json(result)
      })
    }
  })
})






router.get('/lead_generated',(req,res)=>{
  var query = `select * from dial_user where partner_number = "${req.session.listing_number}" and status = 'sms';`
  var query1 = `select * from dial_user where partner_number = "${req.session.listing_number}" and status = 'whatsapp';`
  pool.query(query+query1,(err,result)=>{
    err ? console.log(err) : res.render('lead_generated',{result:result})
  })

})


router.get('/listing_dashboard/personal_details',(req,res)=>{
  if(req.session.listing_number){
pool.query(`select l.*, (select c.name from category c where c.id = l.categoryid ) as categoryname from listing l where l.number = "${req.session.listing_number}"`,(err,result)=> err ? console.log(err) :res.render(`update_personal_details`,{result:result}))
  }
  else{
     res.send("You don't have access")
  }
})



router.get('/listing_dashboard/also_listing',(req,res)=>{
  if(req.session.listing_number){
    pool.query(`select id,categoryid from listing where number = "${req.session.listing_number}"`,(err,result)=>{
      if(err) throw err;
      else{
        let categoryid = result[0].categoryid
        let id = result[0].id
        var query = `select id,name from dial_subcategory where categoryid = "${categoryid}";`
        var query1 = `select * from also_listing where userid = "${categoryid}";`
pool.query(query+query1,(err,result)=>{
  if(err) throw err;
  else res.render('also_listing',{result:result,msg:id})
})
      }
    })

  }
  else{
     res.send("You don't have access")
  }
})





router.post('/insert/also_listing',(req,res)=>{
  let body = req.body;
  pool.query(`select * from also_listing where userid = "${req.body.userid}" and also_listing = "${req.body.also_listing}"`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
pool.query(`delete from also_listing where userid = "${req.body.userid}" and also_listing = "${req.body.also_listing}"`,(err,result)=>{
  if(err) throw err;
  else res.send('success')
})
    }
    else{
      pool.query(`insert into also_listing set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.send('success')
      })
    }
  })
})



router.get('/also_listing/get',(req,res)=>{
   pool.query(`select id,categoryid from listing where number = "${req.session.listing_number}"`,(err,result)=>{
 if(err) throw err;
      else{
        let categoryid = result[0].categoryid
        let id = result[0].id
        var query = `select * from also_listing where userid = "${id}";`
pool.query(query,(err,result)=>{
  if(err) throw err;
  else res.json(result)
})
      }
    })
})



router.get('/successfully',(req,res)=>{
 
  res.render('payment_success')
})


router.post('/insert_rating',(req,res)=>{
  let body = req.body;

  console.log(req.body)
   body['name'] = req.session.ratingname;
   body['number'] = req.session.ratingnumber;
   body['review'] = req.session.ratingreview;
   body['rating'] = req.session.rating;
   pool.query(`insert into dial_rating set ? `,body,(err,result)=>{
    if(err) throw err;
    else {
pool.query(`select avg(rating)as avg_rating from dial_rating where userid = "${req.body.userid}"`,(err,result)=>{
  if(err) throw err;
  else{
    let get_rating = result[0].avg_rating
    pool.query(`update listing set rating = ${get_rating} where id = "${req.body.userid}"`,(err,result)=>{
      if(err) throw err;
      else res.send('success')
    })
  }
})
    }
   })
})




router.get('/get_mart_category',(req,res)=>{
  pool.query(`select * from delomart_category`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})





router.get('/get_mart_subservices',(req,res)=>{
  pool.query(`select * from delomart_subservices`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})



router.get('/get_mart_subcategory',(req,res)=>{
  pool.query(`select * from delomart_subcategory`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})


router.get('/get_mart_product',(req,res)=>{
  pool.query(`select d.*,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.number = "${req.session.listing_number}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})










router.post('/update_mart_product', (req, res) => {
    console.log(req.body)
    pool.query(`update delomart_product set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.post('/update_image_mart_product',upload.single('main_image'), (req, res) => {
    let body = req.body;

     body['main_image'] = req.file.filename
   console.log(body)
   pool.query(`update delomart_product  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/free-listing/add-product')
    })
})






router.post('/update_image1_mart_product',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 } , { name: 'image3', maxCount: 1 } , { name: 'image4', maxCount: 1 } ]), (req, res) => {
    let body = req.body;

   body['image1'] = req.files['image1'][0].filename
    body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
     body['image4'] = req.files['image4'][0].filename
   console.log(body)
   pool.query(`update delomart_product  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/free-listing/add-product')
    })
})



router.get('/delete_mart_product', (req, res) => {
    const { id } = req.query
    pool.query(`delete from delomart_product where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})










router.get('/search',(req,res)=>{

  pool.query(`select id from dial_category where name = "${req.session.search}"`,(err,result)=>{
    if(err) throw err;
    else{
      let categoryid = result[0].id
      pool.query(`select name from dial_subcategory  where categoryid="${categoryid}"`,(err,result)=>{
        if(err) throw err;
        else if(result[0].name == "Nops"){
          pool.query(`select id from city where name = "${req.session.citysearch}"`,(err,result)=>{
            if(err) throw err;
            else{
              let city = result[0].id
              console.log("result",result[0].id)
           var query = `select l.* , (select c.name from dial_category c where c.id = "${categoryid}") as categoryname,
              (select ca.seo_name from dial_category ca where ca.id="${categoryid}") as categoryseoname ,
              (select ci.name from city ci where ci.id = "${city}") as cityname
              from listing l where l.categoryid="${categoryid}" and l.cityid="${city}" order by expiry_date desc;`
              var query1 = `select * from dial_category order by name; `
              var query2 = `select * from dial_subcategory where categoryid = "${categoryid}";`
              pool.query(query+query1+query2,(err,result)=>{
                  if(err) throw err;
                  else if(result[0][0]) res.render(`single_listing`, {result : result , login:false,date:today});
                  //else if(result[0]) res.json(result)
                  else res.render('not_found')
              })
            }
          })
        
        }
        else{


pool.query(`select name from dial_subservices where categoryid = "${categoryid}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0].name=="Nops"){
  pool.query(`select id from city where name = "${req.session.citysearch}"`,(err,result)=>{
 if(err) throw err;
            else{
              let city = result[0].id
              console.log("result",result[0].id)
              var query = `select l.* , (select c.name from dial_category c where c.id = "${categoryid}") as categoryname,
              (select ca.seo_name from dial_category ca where ca.id="${categoryid}") as categoryseoname ,
              (select ci.name from city ci where ci.id = "${city}") as cityname
              from listing l where l.categoryid="${categoryid}" and l.cityid="${city}" order by expiry_date desc;`
              var query1 = `select * from dial_category order by name;`
              var query2 = `select * from dial_subcategory where categoryid = "${categoryid}";`
              pool.query(query+query1+query2,(err,result)=>{
                  if(err) throw err;
                  else if(result[0][0]) res.render(`listing`, {result : result , login:false,date:today});
                  //else if(result[0]) res.json(result)
                  else res.render('not_found')
              })

            }
  })
  }
  else{
 pool.query(`select id from city where name = "${req.session.citysearch}"`,(err,result)=>{
 if(err) throw err;
            else{
              let city = result[0].id
              console.log("result",result[0].id)
                var query = `select l.* , (select c.name from dial_category c where c.id = "${categoryid}") as categoryname,
              (select ca.seo_name from dial_category ca where ca.id="${categoryid}") as categoryseoname ,
              (select ci.name from city ci where ci.id = "${city}") as cityname
              from listing l where l.categoryid="${categoryid}" and l.cityid="${city}" order by expiry_date desc ;`
              var query1 = `select * from dial_category order by name;`
              var query2 = `select * from dial_subcategory where categoryid = "${categoryid}";`
              pool.query(query+query1+query2,(err,result)=>{
                  if(err) throw err;
                  else if(result[0][0]) res.render(`multi_listing`, {result : result , login:false,date:today});
                  //else if(result[0]) res.json(result)
                  else res.render('not_found')
              })

            }
  })
  }
})

        
        }
      })
    }
  })

})







module.exports = router;