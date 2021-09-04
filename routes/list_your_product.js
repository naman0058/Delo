var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');
var nodemailer = require('nodemailer');


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



router.get('/', (req, res) => {
    res.render('list_your_product' , {msg:'List your product'});
 
})



router.post('/verification',(req,res)=>{
  let body = req.body;
   body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
    body['seo_address'] = (body.address.split(' ').join('-')).toLowerCase()
    pool.query(`select id from mart_user where number = "${req.body.number}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0]) res.render('list_your_product' , {msg:'Your Accound has been already registered..'});
      else{
  console.log("data recieve",body)
   req.session.product_number = req.body.number
   pool.query(`insert into mart_user set ?`, body, (err, result) => {  
     if(err) throw err;
    else {
 var otp =   Math.floor(100000 + Math.random() * 9000);
   req.session.product_otp = otp;
   console.log("Request Number",req.session.product_number);
   console.log("OTP",otp);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else res.render('mart_otp_verification', {msg : ''})
         })

    }
   })
      }
    })

})






router.post('/login-verification',(req,res)=>{
  let body = req.body;
  req.session.product_number = req.body.number
    pool.query(`select id from mart_user where number = "${req.body.number}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0]) {
var otp =   Math.floor(100000 + Math.random() * 9000);
   req.session.product_otp = otp;
   console.log("Request Number",req.session.product_number);
   console.log("OTP",otp);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else res.render('mart_otp_verification', {msg : ''})
         })
      }
      else{
 res.render('product_login', {msg : 'Your Account does not exists'})
      }
    })

})




router.post('/verificationcomplete',(req,res)=>{
  let body = req.body
  console.log("number hai",req.session.product_number)
  if( req.session.product_otp == req.body.otp){
    pool.query(`update mart_user set status = 'success' where number = "${req.session.product_number}"`,(err,result)=>{
      if(err) throw err;
      else res.redirect('dashboard');
    })
     
      }
   
  else res.render('mart_otp_verification',{msg:'Enter Wrong OTP'})
})
  


router.get('/resendotp',(req,res)=>{
    var otp =   Math.floor(100000 + Math.random() * 9000);
    sendOtp.send(req.session.product_number, "DELOTM", otp,(err,result)=>{
  if(err) throw err;
  else{
    res.render('/mart_otp_verification')
  }
    })
  })


router.get('/dashboard',(req,res)=>{
  req.session.product_number="8319339945"
  if(req.session.product_number) {
pool.query(`select * from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
  if(err) throw err;
  else res.render('mart_dashboard',{result:result})
})
  }
    else res.render('login',{msg : 'Please Login First'})
})




// Dashboard Functionality

router.post('/update', (req, res) => {
    console.log(req.body)
    pool.query(`update mart_user set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})




router.get('/add-product',(req,res)=>{
  if(req.session.product_number){
     res.render('add-product')
  }
  else{
    res.send("You don't have access")
  }

})




router.post('/insert-add-product',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 } , { name: 'image3', maxCount: 1 } , { name: 'image4', maxCount: 1 } , { name: 'main_image', maxCount: 1 } , { name: 'catlogue', maxCount: 1 }  ]), (req, res) => {
 
if(req.files['catlogue']){
   let body = req.body;
  console.log("body h",req.session.product_number)
    var dirt = false

pool.query(`select * from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0].validity==null || result[0].validity=="null" || result[0].validity == [] || result[0].validity ==""){

pool.query(`select * from delomart_product where number = "${req.session.product_number}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0]){
  res.send('Your limit exceed...Please Upgrade your plan')
  }
  else{
  pool.query(`select categoryid , subcategoryid , subservicesid from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
      if(err) throw err;
      else{


 body['image1'] = req.files['image1'][0].filename
     body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
     body['image4'] = req.files['image4'][0].filename
     body['main_image'] = req.files['main_image'][0].filename
     body['catlogue'] = req.files['catlogue'][0].filename
     body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
     body['number'] = req.session.product_number
     body['categoryid'] = result[0].categoryid
     body['subcategoryid'] = result[0].subcategoryid
     body['subservicesid'] = result[0].subservicesid

pool.query(`insert into delomart_product set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('Successfully Submitted...')
    })
      }
    })
  }
})

  }
  else{

if(result[0].validity > today){
  pool.query(`select categoryid , subcategoryid , subservicesid from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
      if(err) throw err;
      else{
 body['image1'] = req.files['image1'][0].filename
     body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
     body['image4'] = req.files['image4'][0].filename
     body['main_image'] = req.files['main_image'][0].filename
     body['catlogue'] = req.files['catlogue'][0].filename
     body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
     body['number'] = req.session.product_number
     body['categoryid'] = result[0].categoryid
     body['subcategoryid'] = result[0].subcategoryid
     body['subservicesid'] = result[0].subservicesid

pool.query(`insert into delomart_product set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('Successfully Submitted')
    })
      }
    })
}
else{
  res.send('Your Validity has been expired...Please Upgrade your plan')
}


  }
})

}
else{

     let body = req.body;
  console.log("body h",req.session.product_number)
    var dirt = false

pool.query(`select * from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0].validity==null || result[0].validity=="null" || result[0].validity == [] || result[0].validity ==""){

pool.query(`select * from delomart_product where number = "${req.session.product_number}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0]){
  res.send('Your limit exceed...Please Upgrade your plan')
  }
  else{
  pool.query(`select categoryid , subcategoryid , subservicesid from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
      if(err) throw err;
      else{


 body['image1'] = req.files['image1'][0].filename
     body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
     body['image4'] = req.files['image4'][0].filename
     body['main_image'] = req.files['main_image'][0].filename
     body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
     body['number'] = req.session.product_number
     body['categoryid'] = result[0].categoryid
     body['subcategoryid'] = result[0].subcategoryid
     body['subservicesid'] = result[0].subservicesid

pool.query(`insert into delomart_product set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('Successfully Submitted...')
    })
      }
    })
  }
})

  }
  else{

if(result[0].validity > today){
  pool.query(`select categoryid , subcategoryid , subservicesid from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
      if(err) throw err;
      else{
 body['image1'] = req.files['image1'][0].filename
     body['image2'] = req.files['image2'][0].filename
     body['image3'] = req.files['image3'][0].filename
     body['image4'] = req.files['image4'][0].filename
     body['main_image'] = req.files['main_image'][0].filename
     body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
     body['number'] = req.session.product_number
     body['categoryid'] = result[0].categoryid
     body['subcategoryid'] = result[0].subcategoryid
     body['subservicesid'] = result[0].subservicesid

pool.query(`insert into delomart_product set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('Successfully Submitted')
    })
      }
    })
}
else{
  res.send('Your Validity has been expired...Please Upgrade your plan')
}


  }
})


}


 
  
    
})




router.get('/get_mart_product',(req,res)=>{
  pool.query(`select d.*,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.number = "${req.session.product_number}"`,(err,result)=>{
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







router.get('/lead-generation',(req,res)=>{
  pool.query(`select * from delomart_lead_generation where partner_number = "${req.session.product_number}" `,(err,result)=>{
    if(err) throw err;
    else res.render('lead_generation',{result:result})
  })
})



router.get('/promote-your-business',(req,res)=>{
  if(req.session.product_number){
    pool.query(`select * from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
      if(err) throw err;
      else res.render('manage_mart_campign',{result:result})
    })
    
  }
  else{
    res.send('You have not access...')
  }
})




router.post('/contact-information',upload.single('image'),(req,res)=>{
  let body = req.body;
    body['image'] = req.file.filename
    console.log(req.body)
   pool.query(`insert into delomart_lead_generation set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('services',{msg : 'Successfully Inserted'})
    })

})


router.get('/successfully',(req,res)=>{
 
  res.render('payment_success')
})











router.get('/send_mail',(req,res)=>{

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'deloservices.india@gmail.com',
    pass: 'Dialdelo@2020'
  }
});

var mailOptions = {
  from: 'deloservices.india@gmail.com',
  to: 'jnaman345@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
})



router.get('/get_brand',(req,res)=>{
  pool.query(`select subservicesid from mart_user where number = "${req.session.product_number}"`,(err,result)=>{
    if(err) throw err;
    else {
      pool.query(`select * from delomart_brand where subservicesid = "${result[0].subservicesid}"`,(err,result)=>{
        err ?  console.log(err) : res.json(result)
      })
    }
  })
})




router.post('/send_mail',upload.single('image'),(req,res)=>{
  let body = req.body
  if(req.file){
    body['image'] = req.file.filename
    body['created_date'] = today
    pool.query(`insert into delomart_lead_generation set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('success')
            })

  }
  else{
     body['created_date'] = today
     console.log(req.body)
 pool.query(`insert into delomart_lead_generation set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('success')
    })
  }
  
})



router.get('/login',(req,res)=>{
  res.render('product_login',{msg:''})
})



router.get('/logout',(req,res)=>{
  req.session.product_number = null;
  res.redirect('/');
})

module.exports = router;