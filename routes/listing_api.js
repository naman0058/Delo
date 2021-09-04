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




router.get('/dial_categories', (req, res) => {
    pool.query(`select * from dial_category order by name`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.post('/dial_subcategory', (req, res) => {
    pool.query(`select d.* , (select c.seo_name from dial_category c where c.id = "${req.body.categoryid}") as seocategoryname
     from dial_subcategory d where d.categoryid = "${req.body.categoryid}"`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})




router.post('/dial_subservices', (req, res) => {
  console.log(req.body)
    pool.query(`select d.* , 
    (select c.seo_name from dial_category c where c.id = "${req.body.categoryid}") as seocategoryname
    from dial_subservices d where d.subcategoryid = "${req.body.subcategoryid}"`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})




router.post('/dial_list',(req,res)=>{
  pool.query(`select * from listing where subservicedid ="${req.body.subservicedid}" and cityid = "${req.body.cityid}"`,(err,result)=>{
    err ? console.log(err) : res.json(result);
  })
})




router.post('/single_list',(req,res)=>{
  pool.query(`select * from listing where id = "${req.body.id}"`,(err,result)=>{
    err ? console.log(err) : res.json(result);
  })
})






router.post('/check',(req,res)=>{
   pool.query(`select * from listing where categoryid = "${req.body.categoryid}"`,(err,result)=>{
    if(err) throw err;
    else{
      res.json(result)
     
    }
  })
})






router.post('/get_product',(req,res)=>{

  pool.query(`select id from dial_category where seo_name = "${req.body.servicename}"`,(err,result)=>{
    if(err) throw err;
    else{
      let categoryid = result[0].id
      pool.query(`select name from dial_subcategory  where categoryid="${categoryid}"`,(err,result)=>{
        if(err) throw err;
        else if(result[0].name == "Nops"){
          pool.query(`select id from city where name = "${req.body.city}"`,(err,result)=>{
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
                 // else if(result[0][0]) res.render(`single_listing`, {result : result , login:false,date:today,msg:'single'});
                  else if(result[0]) res.json(result , {login:false,date:today,msg:'single'})
                  else res.json({msg:'error occured'})
              })
            }
          })
        
        }
        else{


pool.query(`select name from dial_subservices where categoryid = "${categoryid}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0].name=="Nops"){
  pool.query(`select id from city where name = "${req.body.city}"`,(err,result)=>{
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
                  //else if(result[0][0]) res.render(`listing`, {result : result , login:false,date:today});
                  else if(result[0]) res.json(result,{result : result , login:false,date:today,msg:'multiple'})
                 else res.json({msg:'error occured'})
              })

            }
  })
  }
  else{
 pool.query(`select id from city where name = "${req.body.city}"`,(err,result)=>{
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
                  //else if(result[0][0]) res.render(`multi_listing`, {result : result , login:false,date:today});
                  else if(result[0]) res.json(result,{result : result , login:false,date:today,msg:'double'})
                 else res.json({msg:'error occured'})
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





router.post('/send/sms', (req, res) => {
  let body = req.body
  let number =  req.body.number
  let partner_number =  req.body.partner_number
  let partnerid = []
  let randomid = []
   body['created_date'] = today
    body['created_time'] = todaytime
    body['counter'] = 0

pool.query(`select * from dial_user where number = "${req.body.number}"`,(err,result)=>{
if(err) throw err;

else{
  pool.query(`insert into dial_user set ?`,body,(err,result)=>{
    if(err) throw err;
    else {
pool.query(`select name,number,address1,address2 from listing where categoryid = "${req.body.categoryid}" and cityid = "${req.body.cityid}"`, (err, result) => {
      if (err) throw err;
      else {
        
 for(i=0;i<result.length;i++){
        let message = `\r\n ${result[i].name} - ${result[i].number} \r\n ${result[i].address} \r\n`
      partnerid.push(message)

    }
    console.log('partnerid',partnerid);

for(i=0;i<5;i++){
const randomElement = partnerid[Math.floor(Math.random() * partnerid.length)];
randomid.push(randomElement)
   }
   console.log("randomid",randomid);
  // let messages = `Hii ${req.body.name} \r\n ${randomid}`
  let messages = `Hii ${req.body.name} your enquiry is recieved successfully. Our Team Member will contact you as soon as`
           msg91.sendOne(authkey, number, messages, senderid, route, dialcode, function (response) {

          })

          res.json({msg:'success'})

      }
  })
    }
  })
}
})
})




router.post('/send_otp',(req,res)=>{
  let body = req.body;
  console.log('body data',req.body)
   var otp =   Math.floor(100000 + Math.random() * 9000);
   console.log("OTP",otp);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
     else res.json({otp:otp})
         })

})




router.post('/otp_verification',(req,res)=>{
  let body = req.body
  let number = req.session.listing_number1
  let message = 'Dial Delo gives an oppotunity for you.List your business in dial delo to get more success on your business'
    pool.query(`select * from listing where number = "${req.body.partner_number}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0])       res.json({msg:'success'})
      else {

            msg91.sendOne(authkey, number, message, senderid, route, dialcode, function (response) {

            })

            res.json({msg:'success'})

      }
      }) 

})






router.post('/rating_send_otp',(req,res)=>{
  let body = req.body;
  console.log('body data',req.body)
   var otp =   Math.floor(100000 + Math.random() * 9000);
   sendOtp.send(req.body.number, "DELOTM", otp,(err,result)=>{
     if(err) throw err;
   else res.json({otp:otp})

         })

})




router.post('/insert_rating',(req,res)=>{
  let body = req.body;

  console.log(req.body)
   pool.query(`insert into dial_rating set ? `,body,(err,result)=>{
    if(err) throw err;
    else {
pool.query(`select avg(rating)as avg_rating from dial_rating where userid = "${req.body.userid}"`,(err,result)=>{
  if(err) throw err;
  else{
    let get_rating = result[0].avg_rating
    pool.query(`update listing set rating = ${get_rating} where id = "${req.body.userid}"`,(err,result)=>{
      if(err) throw err;
      else       res.json({msg:'success'})
    })
  }
})
    }
   })
})




router.post('/search',(req,res)=>{
  pool.query(`select * from listing where categoryid = "${req.body.categoryid}" and cityid = "${req.body.cityid}"`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})

router.post('/get_locality',(req,res)=>{
  pool.query(`select * from locality where cityid = "${req.body.cityid}"`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})

router.post('/get_list',(req,res)=>{
  pool.query(`select l.* , (select c.name from dial_category c where c.id = "${req.body.categoryid}") as categoryname,
  (select ca.seo_name from dial_category ca where ca.id="${req.body.categoryid}") as categoryseoname ,
  (select ci.name from city ci where ci.id = "${req.body.city}") as cityname
  from listing l where l.localityid="${req.body.localityid}" and l.cityid="${req.body.cityid}" and categoryid = "${req.body.categoryid}" order by expiry_date desc;`,(err,result)=>{
err ? console.log(err) : res.json(result)
})
})



router.post('/listing',(req,res)=>{
  pool.query(`select l.* , (select c.name from dial_category c where c.id = "${req.body.categoryid}") as categoryname,
              (select ca.seo_name from dial_category ca where ca.id="${req.body.categoryid}") as categoryseoname ,
              (select ci.name from city ci where ci.id = "${req.body.city}") as cityname
              from listing l where l.subservicesid="${req.body.subservicesid}" and l.cityid="${req.body.city}" order by expiry_date desc;`,(err,result)=>{
      err ? console.log(err) : res.json(result)
    })
})


router.post('/dial_list_by_category',(req,res)=>{
  pool.query(`select l.* , (select c.name from dial_category c where c.id = "${req.body.categoryid}") as categoryname,
  (select ca.seo_name from dial_category ca where ca.id="${req.body.categoryid}") as categoryseoname ,
  (select ci.name from city ci where ci.id = "${req.body.city}") as cityname
  from listing l where l.categoryid="${req.body.categoryid}"  order by expiry_date desc;`,(err,result)=>{
err ? console.log(err) : res.json(result)
})
})



router.post('/dial_list_by_subcategory',(req,res)=>{
  pool.query(`select l.* , (select c.name from dial_category c where c.id = "${req.body.categoryid}") as categoryname,
  (select ca.seo_name from dial_category ca where ca.id="${req.body.categoryid}") as categoryseoname ,
  (select ci.name from city ci where ci.id = "${req.body.city}") as cityname
  from listing l where l.subcategoryid="${req.body.subcategoryid}" and l.cityid="${req.body.city}" order by expiry_date desc;`,(err,result)=>{
err ? console.log(err) : res.json(result)
})
})



router.post('/insert_business',upload.single('image'), (req, res) => {
  let body = req.body;
  console.log("body data",req.body)
  body['image'] = req.file.filename
  body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
  body['seo_address'] = (body.address1.split(' ').join('-')).toLowerCase()
  console.log("body data",req.body)
  pool.query(`insert into listing set ?`, body, (err, result) => {
      if(err) throw err;
      else res.json({msg:'success'})
  })
})



router.post('/signup',upload.single('image'), (req, res) => {
    let body = req.body;
    body['image'] = req.file.filename
    body['seo_name'] = (body.name.split(' ').join('-')).toLowerCase()
    body['seo_address'] = (body.address1.split(' ').join('-')).toLowerCase()
    body['status'] = "pending"
    body['created_date'] = today
    console.log("body data",req.body)
    pool.query(`insert into listing set ?`, body, (err, result) => {
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
   pool.query(`update listing  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json({
          msg:'success'
        })
    })
})








module.exports = router;