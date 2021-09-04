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



router.get('/get_mart_category',(req,res)=>{
  pool.query(`select * from delomart_category`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})



router.post('/get_mart_subcategory',(req,res)=>{
  pool.query(`select s.* , 
    (select c.name from delomart_category c where c.id = s.categoryid) as categoryname
     from delomart_subcategory s where s.categoryid="${req.body.categoryid}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})


router.post('/get_mart_subservices',(req,res)=>{
  pool.query(`select s.* ,
      (select c.name from delomart_subcategory c where c.id = s.subcategoryid) as subcategoryname
   from delomart_subservices s where s.subcategoryid="${req.body.subcategoryid}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})


router.post('/get_mart_product',(req,res)=>{
  pool.query(`select d.*,
(select c.name from mart_user c where c.number = d.number) as companyname,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select ci.name as cityname from city ci where ci.id = (select lis.cityid from mart_user lis where lis.number = d.number)) as cityname,
 (select lo.name as localityname from locality lo where lo.id = (select list.localityid from mart_user list where list.number = d.number)) as localityname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.subservicesid = "${req.body.subservicesid}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})


router.post(`/get_mart_single_product`,(req,res)=>{
  pool.query(`select d.* , (select name from delomart_brand b where b.id = d.brand) as brandname
   from delomart_product d where d.id="${req.body.id}"`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})




router.post('/send_mail',upload.single('image'),(req,res)=>{
  let body = req.body
  console.log(req.body)
  if(req.file){
    body['image'] = req.file.filename
    body['created_date'] = today
    pool.query(`insert into delomart_lead_generation set ?`, body, (err, result) => {
        if(err){
          console.log(err)
          res.json(
        {
          msg : 'error occured'
        })
        } 
        
        else res.json({
          msg : 'success'
        })
            })

  }
  else{
     body['created_date'] = today
     console.log(req.body)
 pool.query(`insert into delomart_lead_generation set ?`, body, (err, result) => {
          if(err){
            console.log(err)
res.json({msg : 'error occured'})
          } 
        else res.json({msg : 'success'})
            
    })
  }
  
})


router.get('/get_all_subservices',(req,res)=>{
  pool.query(`select * from delomart_subservices`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})






router.post('/get_brand',(req,res)=>{
  pool.query(`select * from delomart_brand where subservicesid = "${req.body.subservicesid}"`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})






router.post('/get_mart_product_by_brand',(req,res)=>{
  let body = req.body
  console.log("recieving data",req.body)

  pool.query(`select d.*,
(select c.name from mart_user c where c.number = d.number) as companyname,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select ci.name as cityname from city ci where ci.id = (select lis.cityid from mart_user lis where lis.number = d.number)) as cityname,
 (select lo.name as localityname from locality lo where lo.id = (select list.localityid from mart_user list where list.number = d.number)) as localityname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.subservicesid = "${req.body.subservicesid}" and d.brand = "${req.body.brandid}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})




router.post('/get_mart_product_by_city',(req,res)=>{
  let body = req.body
  console.log("recieving data",req.body)

  pool.query(`select d.*,
(select c.name from mart_user c where c.number = d.number) as companyname,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select ci.name as cityname from city ci where ci.id = (select lis.cityid from mart_user lis where lis.number = d.number)) as cityname,
 (select lo.name as localityname from locality lo where lo.id = (select list.localityid from mart_user list where list.number = d.number)) as localityname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.subservicesid = "${req.body.subservicesid}" and d.cityid = "${req.body.cityid}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})



router.post('/get_mart_product_by_businesstype',(req,res)=>{
  let body = req.body
  console.log("recieving data",req.body)
  pool.query(`select d.*,
(select c.name from mart_user c where c.number = d.number) as companyname,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select ci.name as cityname from city ci where ci.id = (select lis.cityid from mart_user lis where lis.number = d.number)) as cityname,
 (select lo.name as localityname from locality lo where lo.id = (select list.localityid from mart_user list where list.number = d.number)) as localityname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.subservicesid = "${req.body.subservicesid}" and d.business_type = "${req.body.businesstype}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})




router.post('/get_mart_product_by_brand',(req,res)=>{
  let body = req.body
  console.log("recieving data",req.body)

  pool.query(`select d.*,
(select c.name from mart_user c where c.number = d.number) as companyname,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select ci.name as cityname from city ci where ci.id = (select lis.cityid from mart_user lis where lis.number = d.number)) as cityname,
 (select lo.name as localityname from locality lo where lo.id = (select list.localityid from mart_user list where list.number = d.number)) as localityname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.subservicesid = "${req.body.subservicesid}" and d.brand = "${req.body.brandid}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})




router.post('/get_mart_product_by_city',(req,res)=>{
  let body = req.body
  console.log("recieving data",req.body)

  pool.query(`select d.*,
(select c.name from mart_user c where c.number = d.number) as companyname,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select ci.name as cityname from city ci where ci.id = (select lis.cityid from mart_user lis where lis.number = d.number)) as cityname,
 (select lo.name as localityname from locality lo where lo.id = (select list.localityid from mart_user list where list.number = d.number)) as localityname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.subservicesid = "${req.body.subservicesid}" and d.cityid = "${req.body.cityid}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})






router.post('/get_mart_product_by_businesstype',(req,res)=>{
  let body = req.body
  console.log("recieving data",req.body)
  pool.query(`select d.*,
(select c.name from mart_user c where c.number = d.number) as companyname,
(select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
(select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
(select ci.name as cityname from city ci where ci.id = (select lis.cityid from mart_user lis where lis.number = d.number)) as cityname,
 (select lo.name as localityname from locality lo where lo.id = (select list.localityid from mart_user list where list.number = d.number)) as localityname,
(select sub.name from delomart_subservices sub where sub.id = d.subservicesid) as subservicesname
   from delomart_product d where d.subservicesid = "${req.body.subservicesid}" and d.business_type = "${req.body.businesstype}"`,(err,result)=>{
    err ? console.log(err) :res.json(result);
  })
})




router.post(`/get_mart_subservices_by_subcategory`,(req,res)=>{
  pool.query(`select * from delomart_subservices where subcategoryid = "${req.body.subcategoryid}"`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})



router.post('/request-quote',(req,res)=>{
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
  else if(result[0]){
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

    res.json({msg:'success'})
    
  }
  else{
    res.json({msg:'nodata'})
  }
})
  }
  else{

  }
    }
  })
})



router.post('/search',(req,res)=>{
  let body= req.body
  console.log("data search krna h",body)
  pool.query(`select * from listing where name = "${req.body.search}" and cityid = "${req.body.cityid}"`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
    res.json(result)

    }
    // Listing m found ni h
    else{
      pool.query(`select * from delomart_product where name = "${req.body.search}"and cityid = "${req.body.cityid}"`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
pool.query(`select * from services where name = "${req.body.search}"`,(err,result)=>{

if(err) throw err;
else if(result[0]){

var query = `select * from delomart_product where name = "${req.body.search}"and cityid = "${req.body.cityid}";`
var query1 = `select * from services where name = "${req.body.search}";`
pool.query(query+query1,(err,result)=>{
  if(err) throw err;
  else res.json(result)
})


}




else{
  pool.query(`select * from delomart_product where name = "${req.body.search}"and cityid = "${req.body.cityid}"`,(err,result)=>{
     if(err) throw err;
     else res.json(result)
  })
}

})



        }


// listing k saath saath mart m v data ni h

        else{
          pool.query(`select * from services where name = "${req.body.search}"`,(err,result)=>{
            if(err) throw err;
            else if(result[0]){

            }
            else{
              res.json({msg:'sorry no data found'})
            }
          })
        }
      })
    }
  })
})



router.post('/get_product_by_id',(req,res)=>{
  pool.query(`select * from delomart_product where id = "${req.body.id}"`,(err,result)=>{
    err ? console.log(err) : res.json(result)
  })
})

module.exports = router;