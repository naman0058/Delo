var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
var dialcode='91';
var request = require('request');


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

var dt = new Date();
var todaytime = dt.getHours() + ":" + dt.getMinutes();


router.post('/a',(req,res)=>{
  let body = req.body
  console.log(body)

  var dataString = `From=${body.from}&To=${body.to}&CallerId=01141183789`;
console.log('dattastring',dataString)
var options = {
    url: `https://30cf99154278c0295a01ffa04e00c36548998f82e27b9faa:c930c60b44c91ea22c25f5ee24cc943738ed22eb62e14831@api.exotel.com/v1/Accounts/deloservices1/Calls/connect?From=${body.from}&To=${body.to}`,
    method: 'POST',
   
};

var options1 = {
  url: `https://30cf99154278c0295a01ffa04e00c36548998f82e27b9faa:c930c60b44c91ea22c25f5ee24cc943738ed22eb62e14831@api.exotel.com/v1/Accounts/deloservices1/CustomerWhitelist?VirtualNumber=01141183789&Number=${body.to}`,
  method: 'POST',
  };



function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
    if(error) console.log('error');
    else if(response.statusCode == 200) console.log('perfect')
    else{
      request(options1,(error,response)=>{
          if (!error && response.statusCode == 200) {
          console.log(body);
      }
      if(error) console.log('error1');
      else if(response.statusCode == 200) {
        request(options,(error,response)=>{
          if (!error && response.statusCode == 200) {
            console.log(body);
        }
        else console.log(response.statusCode)
        })
      }
     
      })
    }
}
request(options,callback)

})







router.get('/', (req, res) => {
  if(req.session.usernumber){  
    console.log(req.session.usernumber)
    var query1 = `select b.*,t.name as service_agent_details , t.image as service_agent_image from booking b left join team t on b.service_agent = t.number
    where b.usernumber = "${req.session.usernumber}" and b.cancellation_charge is null and b.status is null 
    || b.usernumber = "${req.session.usernumber}" and b.cancellation_charge is null and b.status is null 
    || b.usernumber = "${req.session.usernumber}" and b.cancellation_charge is null and b.status = '' 
    ||  b.usernumber = "${req.session.usernumber}" and b.cancellation_charge is null and b.status = '' 
    ||  b.usernumber = "${req.session.usernumber}" and b.cancellation_charge is null and b.status != 'completed' 
    ||  b.usernumber = "${req.session.usernumber}" and b.cancellation_charge = '' and b.status != 'completed' 
     order by id desc;`
    var query2 = `select * from file_rtr where number = "${req.session.usernumber}" and status is null;`
   
    /*pool.query(`select b.*,
    (select t.name from team t where t.number = b.service_agent) as service_agent_details,
    (select t.image from team t where t.number = b.service_agent) as service_agent_image
    from booking b where b.usernumber = "${req.session.usernumber}" and b.cancellation_charge is null and b.status is null and b.date = CURDATE() order by id desc`,(err,result)=>{*/
      pool.query(query1+query2,(err,result)=>{
        if(err) throw err;
     // else res.json(result)
      else  res.render(`booking`, { msg  : '', result:result });
    })  
   
  }
  else{
    res.redirect('login')
  }
  
})




router.get('/history', (req, res) => {
     pool.query(`select b.*,
    (select s.name from services s where s.id = b.booking_id) as service_name,
    (select t.name from team t where t.number = b.service_agent) as service_agent_details,
    (select t.image from team t where t.number = b.service_agent) as service_agent_image
    from booking b where b.usernumber = "${req.session.usernumber}" and b.cancellation_charge is null and b.status ='completed' `,(err,result)=>{
        if(err) throw err;
        else res.json(result)
      
    })  
  
})




router.post('/updaterating', (req, res) => {
  console.log(req.body)
  pool.query(`update ${table} set  ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) throw err;
      else res.redirect('/booking');
  })
})



router.post('/update', (req, res) => {
  console.log(req.body)
  pool.query(`update ${table} set  ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) throw err;
      else {
        pool.query(`update booking set cancellation_charge = '0' where usernumber = '${req.body.usernumber}'`, (err, result) => {
          if(err) throw err;
          else res.json(result)
        })
      }
  })
})




router.post('/updateinhouse', (req, res) => {
  console.log(req.body)
  pool.query(`update ${table} set  ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) throw err;
     else res.json(result)
  })
})

router.get('/delete', (req, res) => {
 const {id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,reason} = req.query
 console.log(req.query)
 pool.query(`insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,reason,cancel_time,cancel_date,booking_time) values ("${name}","${email}","${usernumber}","${address}","${booking_id}","${payment_mode}","${date}","${time}","${booking_date}","${price}","${reason}","${todaytime}","${today}","${req.query.booking_time}")`,(err,result)=>{
   if(err) throw err;
   else {
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
      if(err) throw err;
      else res.json(result);
  })
   }
 })
 
})



router.get('/rating',(req,res)=>{
 pool.query(`select * from booking where usernumber = "${req.session.usernumber}" and rating ='get_rating' and review = 'get_review' order by id desc limit 1`,(err,result)=>{
   if(err) throw err;
   else res.json(result)
 })
})


router.get('/charge',(req,res)=>{
  const {id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,service_agent,status,today,reason} = req.query;
  let charges = req.query.price*12/100; // customer gst == team price
  let teamprice = req.query.price - charges  
  let gst = teamprice*20/100;  // our margin
  let tds = (teamprice-gst)*5/100; // team member tds
  console.log(req.query)

  if(req.price>10){
  console.log('if')
   var query = `select * from booking where date = ${today} and service_agent = "${service_agent}" || service_agent = "${service_agent}" and date = ${today} `
    pool.query(query,(err,result)=>{
      if(err) throw err;
      else if(result[0]) {
        var query1 = `update booking set cancellation_charge = ${cancellation_charge} where id = ${id}`
        pool.query(query1,(err,result)=>{
          if(err) throw err;
          else{
            pool.query(`update team set recharge_value = recharge_value+${gst}+${charges}+${tds} where number="${service_agent}"`,(err,result)=>{
              if(err) throw err;
              else {
                pool.query(`insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,status,service_agent,reason,cancel_time,cancel_date,booking_time) values ("${name}","${email}","${usernumber}","${address}","${booking_id}","${payment_mode}","${date}","${time}","${booking_date}","${price}" ,"${status}", "${service_agent}","${reason}","${todaytime}" , "${today}" , "${req.query.booking_time}")`,(err,result)=>{
                  if(err) throw err;
                  else res.send('Picked Successfully')
                })
              } 
            })
          }
        })
      }
      else{
        console.log('else')
       var query2 = `update booking set cancellation_charge = ${cancellation_charge} where id = ${id}`
        pool.query(query2,(err,result)=>{
          if(err) throw err;
          else{
            pool.query(`update team set recharge_value = recharge_value+${charges}+${gst}+${tds} where number="${service_agent}"`,(err,result)=>{
              if(err) throw err;
              else {
              pool.query(`insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,status,service_agent,reason,cancel_time,cancel_date,booking_time) values ("${name}","${email}","${usernumber}","${address}","${booking_id}","${payment_mode}","${date}","${time}","${booking_date}","${price}" ,"${status}", "${service_agent}","${reason}","${todaytime}" , "${today}" , "${req.query.booking_time}")`,(err,result)=>{
                  if(err) throw err;
                  else res.send('Picked Successfully')
                })
              } 
            })
          }
        })
      }
    })
  }
  else{
    console.log('err')
    var query3 = `update booking set cancellation_charge = ${cancellation_charge} where id = ${id}`
    pool.query(query3,(err,result)=>{
      if(err) throw err;
      else{
        pool.query(`update team set recharge_value = recharge_value+${charges}+${gst}+${charges} where number="${service_agent}"`,(err,result)=>{
          if(err) throw err;
          else {
          pool.query(`insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,status,service_agent,reason,cancel_time,cancel_date,booking_time) values ("${name}","${email}","${usernumber}","${address}","${booking_id}","${payment_mode}","${date}","${time}","${booking_date}","${price}" ,"${status}", "${service_agent}","${reason}","${todaytime}" , "${today}" , "${req.query.booking_time}")`,(err,result)=>{
              if(err) throw err;
              else res.send('Picked Successfully')
            })
          } 
        })
      }
    }) 
   
  }
})
  



router.get('/nocharge',(req,res)=>{
  const {id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,service_agent,status,today,reason} = req.query;

let charges = req.query.price*12/100; // customer gst == team price
  let teamprice = req.query.price - charges  
  let gst = teamprice*20/100;  // our margin
  let tds = (teamprice-gst)*5/100; // team member tds



  if(req.query.price>10){
    
    var query = `select * from booking where date = ${today} and service_agent = "${service_agent}" || service_agent = "${service_agent}" and date = ${today} `
    pool.query(query,(err,result)=>{
      if(err) throw err;
      else if(result[0]) {
        
        var query1 = `delete from booking  where id="${id}"`
        pool.query(query1,(err,result)=>{
          if(err) throw err;
          else{
            pool.query(`update team set recharge_value = recharge_value+${gst}+${charges}+${tds} where number="${service_agent}"`,(err,result)=>{
              if(err) throw err;
              else {
                pool.query(`insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,status,service_agent,reason,cancel_time,cancel_date,booking_time) values ("${name}","${email}","${usernumber}","${address}","${booking_id}","${payment_mode}","${date}","${time}","${booking_date}","${price}" ,"${status}", "${service_agent}","${reason}","${todaytime}","${today}","${booking_time}"`,(err,result)=>{
                  if(err) throw err;
                  else res.send('Picked Successfully')
                })
              } 
            })
          }
        })
      }
      else{
        var query2 = `delete from booking  where id="${id}"`
        pool.query(query2,(err,result)=>{
          if(err) throw err;
          else{
            pool.query(`update team set recharge_value = recharge_value+${charges}+${gst}+${tds} where number="${service_agent}"`,(err,result)=>{
              if(err) throw err;
              else {
              pool.query(`insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,status,service_agent,reason,cancel_time,cancel_date,booking_time) values ("${name}","${email}","${usernumber}","${address}","${booking_id}","${payment_mode}","${date}","${time}","${booking_date}","${price}" ,"${status}", "${service_agent}","${reason}","${todaytime}" , "${today}" , "${req.query.booking_time}")`,(err,result)=>{
                  if(err) throw err;
                  else res.send('Picked Successfully')
                })
              } 
            })
          }
        })
      }
    })
  }
  else{
    var query3 = `delete from booking  where id="${id}"`
    pool.query(query3,(err,result)=>{
      if(err) throw err;
      else{
        pool.query(`update team set recharge_value = recharge_value+${tds}+${gst}+${charges} where number="${service_agent}"`,(err,result)=>{
          if(err) throw err;
          else {
          pool.query(`insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,status,service_agent,reason,cancel_time,cancel_date,booking_time) values ("${name}","${email}","${usernumber}","${address}","${booking_id}","${payment_mode}","${date}","${time}","${booking_date}","${price}" ,"${status}", "${service_agent}","${reason}","${todaytime}" , "${today}" , "${req.query.booking_time}")`,(err,result)=>{
              if(err) throw err;
              else res.send('Picked Successfully')
            })
          } 
        })
      }
    }) 
   
  }
})
  


router.post('/confirmation',(req,res)=>{
  let body = req.body;
let charges = body.price*12/100; // customer gst == team price
  let teamprice = body.price - charges  
  let gst = teamprice*30/100;  // our margin
  let tds = (teamprice-gst)*5/100; // team member tds
console.log(req.body)

pool.query(`select name from team where number = "${req.session.teamnumber}" || number = "${req.session.loginverify}"`,(err,result)=>{
  if(err) throw err;
  else {
    req.session.teamname = result[0].name;

  if(req.session.teamnumber || req.session.loginverify ) {
      let body = req.body
pool.query(`select recharge_value from team where number = "${req.session.teamnumber}" || number = "${req.session.loginverify}"`,(err,result)=>{
  if(err) throw err;
  else if (result[0].recharge_value < a) res.send(`You Don't Accept this lead beacuse of low balance`)
  else{
pool.query(`select * from booking where id = "${body.id}" and service_agent is not null`,(err,result)=>{
  if(err) throw err;
  else if(result[0])  res.send('Picked Already')
  else {
    console.log(result)
     if(body.price >10){
        var query = `select * from booking where date = CURDATE() and service_agent = "${req.session.teamnumber}" || service_agent = "${req.session.loginverify}" and date = CURDATE()  `
        pool.query(query,(err,result)=>{
          if(err) throw err;
          else if(result[0]) {
            if(req.session.teamnumber){
              var query1 = `update booking set service_agent = "${req.session.teamnumber}" and color = "E74C3C" where id="${body.id}"`
            pool.query(query1,(err,result)=>{
              if(err) throw err;
              else {
                pool.query(`update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.session.teamnumber}"`,(err,result)=>{
                  if(err) throw err;
                  else{
                  msg91.sendOne(authkey,body.usernumber,`${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on http://deloservices.com/help`,senderid,route,dialcode,function(response){
                      err ? console.log(err) : res.send('Picked Successfully')
                    });
                  }
                  
                })
              }
              
            
            })
            }
                        else{

                          var query2 = `update booking set service_agent = "${req.session.loginverify}" and color = "E74C3C" where id="${body.id}"`
                          pool.query(query2,(err,result)=>{
                            if(err) throw err;
                            else {
                              pool.query(`update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.session.loginverify}"`,(err,result)=>{
                                if(err) throw err;
                                else{

                                

                                msg91.sendOne(authkey,body.usernumber,`${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on http://deloservices.com/help`,senderid,route,dialcode,function(response){
                                    err ? console.log(err) : res.send('Picked Successfully')
                                  });
                                }
                              })
                            }
                            
                          
                          })
                        }
          }
          else {
            if(req.session.teamnumber){
  var query3 = `update booking set service_agent = "${req.session.teamnumber}" and color = "E74C3C" where id="${body.id}"`
pool.query(query3,(err,result)=>{
  if(err) throw err;
  else {
    pool.query(`update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.session.teamnumber}"`,(err,result)=>{
      if(err) throw err;
      else{
      msg91.sendOne(authkey,body.usernumber,`${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on http://deloservices.com/help`,senderid,route,dialcode,function(response){
          err ? console.log(err) : res.send('Picked Successfully')
        });
      }
    })
  }
  

})
}
            else{
              var query4 = `update booking set service_agent = "${req.session.loginverify}" and color = "E74C3C" where id="${body.id}"`
              pool.query(query4,(err,result)=>{
                if(err) throw err;
                else {
                  pool.query(`update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.session.loginverify}"`,(err,result)=>{
                    if(err) throw err;
                    else{
                    msg91.sendOne(authkey,body.usernumber,`${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on http://deloservices.com/help`,senderid,route,dialcode,function(response){
                        err ? console.log(err) : res.send('Picked Successfully')
                      });
                    }
                  })
                }
                
              
              })
            }
          }
        })
      }
      else{
     
        if(req.session.teamnumber){
          var query5 = `update booking set service_agent = "${req.session.teamnumber}" and color = "E74C3C" where id="${body.id}"`
        pool.query(query5,(err,result)=>{
          if(err) throw err;
          else {
            pool.query(`update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.session.teamnumber}"`,(err,result)=>{
              if(err) throw err;
              else{
              msg91.sendOne(authkey,body.usernumber,`${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on http://deloservices.com/help`,senderid,route,dialcode,function(response){
                  err ? console.log(err) : res.send('Picked Successfully')
                });
              }
            })
          }
          
        
        })
        }
                    else{

                      var query6 = `update booking set service_agent = "${req.session.loginverify}" and color = "E74C3C" where id="${body.id}"`
                      pool.query(query6,(err,result)=>{
                        if(err) throw err;
                        else {
                          pool.query(`update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.session.loginverify}"`,(err,result)=>{
                            if(err) throw err;
                            else{
                            msg91.sendOne(authkey,body.usernumber,`${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on http://deloservices.com/help`,senderid,route,dialcode,function(response){
                                err ? console.log(err) : res.send('Picked Successfully')
                              });
                            }
                          })
                        }
                        
                      
                      })
                    }

      }
    }
  })
}
})   
  }
  
  
  
    else res.redirect('/team_login')
  }
})
})





router.post('/inhouse-confirmation',(req,res)=>{
  let body = req.body
  console.log(body)
  var query1 = `update booking set service_agent = "8088879880" where id="${body.id}"`
  pool.query(query1,(err,result)=>{
    if(err) throw err;
    else{

      msg91.sendOne(authkey,body.usernumber,`Your ${body.bookingid} is assigned by our inhouse team. We have recieved your booking for ${body.date},${body.time}. For any help, click on http://deloservices.com/help`,senderid,route,dialcode,function(response){

        err ? console.log(err) : res.send('Picked Successfully')
      });
    }
  })
})



router.get('/invoice',(req,res)=>{
  const {id,service_agent,price} = req.query;
  let gst = req.query.price*15/1000;
  let charges = req.query.price*18/1000;
  console.log(req.query)

  if(price>10){
  
    var query = `select * from booking where date = ${today} and service_agent = "${service_agent}" || service_agent = "${service_agent}" and date = ${today} `
    pool.query(query,(err,result)=>{
      if(err) throw err;
      else if(result[0]) res.render(`invoice`,{result:result,gst:gst,charge:charges})
      else res.render(`invoice`,{result:result}) 
    })
  }
  else
  pool.query(`select * from booking where id= '${id}'`,(err,result)=>{
    if(err) throw err;
    //else res.render(`invoice`,{result:result,gst:gst,charge:charges})
    else res.json(result)
  })
    
  })


  router.post('/cart',(req,res)=>{
    let body = req.body
    console.log(req.body)
    console.log(req.session.usernumber)
    if(req.session.usernumber){
        body['usernumber'] = req.session.usernumber
        body['quantity'] = '1'
        body['oneprice'] = req.body.price
        var qua = '1'

 pool.query(`select categoryid from team where number = "${req.session.usernumber}" and categoryid = "${req.body.categoryid}"`,(err,result)=>{
   if(err) throw err;
   else if(result[0]){
     res.send('Beacuse you are a team member of this services, you can not book this service')
   }
   else{

 
pool.query(`select * from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {
    if(req.body.categoryid==result[0].categoryid){
      if(req.body.booking_id ==result[0].booking_id){
pool.query(`update cart set quantity = quantity+${qua} , price = price+${req.body.price} where booking_id = '${req.body.booking_id}' and usernumber = "${req.session.usernumber}"`,(err,result)=>{
  if(err) throw err;
  else{
    console.log('update')
    res.send('Success')}
})
      }
      else{
      pool.query(`insert into cart set ?`,body,(err,result)=>{
        if(err) throw err;
        else res.send('Success')
      })
    }
    }
    else{
      res.send('Can not book two different categories services simultaneously. Replace cart ?')
    }
  }
  else{
    pool.query(`insert into cart set ?`,body,(err,result)=>{
      if(err) throw err;
      else res.send('Success')
    })
  }
})
}
})       


    }
    else res.redirect('/login')
  })


  router.get('/cart/all',(req,res)=>{
    if(req.session.usernumber){
    pool.query(`select * from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })
  }
  else console.log('no data')
  })


  router.post('/cart/replace',(req,res)=>{
    let body = req.body
    console.log(req.body)
    body['usernumber'] = req.session.usernumber
    body['quantity'] = '1';
    body['oneprice'] = req.body.price
    pool.query(`delete from cart where usernumber = "${req.session.usernumber}"`,(err,result)=>{
      if(err) throw err;
      else{
        pool.query(`insert into cart set ?`,body,(err,result)=>{
          if(err) throw err;
          else res.send('Success')
        })
      }
    })
  })


  router.get('/mycart',(req,res)=>{
    if(req.session.usernumber){
      console.log(req.session.getcategoryid)
        var query = `select c.*,(select s.name from services s where s.id = c.booking_id) as servicename
        from cart c where c.usernumber = "${req.session.usernumber}";`
      var query1 = `select count(id) as counter from cart where usernumber = "${req.session.usernumber}";`
      var query2 = `select sum(price) as total_ammount from cart  where usernumber = "${req.session.usernumber}"; `
      var query3 = `select name,image from category where id = "${req.session.getcategoryid}";`
      var query4 = `select name,logo from subcategory where categoryid = "${req.session.getcategoryid}";`
      var query5 = `select * from membership where categoryid = "${req.session.getcategoryid}"; `
      var query6 = `select * from membership_cart where membershipid = "${req.session.getcategoryid}"`
      pool.query(query+query1+query2+query3+query4+query5+query6,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) { 
               req.session.counter = result[1][0].counter
          res.render(`mycart`,{result:result,msg:''}) 
       //  res.json(result);
        }
        else res.render('cart-empty')
      })
     
    }
    else res.redirect('/login')
  })






  router.get('/mycartwithmsg',(req,res)=>{
    if(req.session.usernumber){
      console.log(req.session.getcategoryid)
      var query = `select c.*,(select s.name from services s where s.id = c.booking_id) as servicename
      from cart c where c.usernumber = "${req.session.usernumber}";`
      var query1 = `select count(id) as counter from cart where usernumber = "${req.session.usernumber}";`
      var query2 = `select sum(price) as total_ammount from cart  where usernumber = "${req.session.usernumber}"; `
      var query3 = `select name,image from category where id = "${req.session.getcategoryid}";`
      var query4 = `select name,logo from subcategory where categoryid = "${req.session.getcategoryid}";`
      var query5 = `select * from membership where categoryid = "${req.session.getcategoryid}"; `
      var query6 = `select * from membership_cart where membershipid = "${req.session.getcategoryid}"`
      pool.query(query+query1+query2+query3+query4+query5+query6,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) { 
               req.session.counter = result[1][0].counter
          res.render(`mycart`,{result:result,msg:'Please Choose Date & Time Properly'}) 
       //  res.json(result);
        }
        else res.render('cart-empty')
      })
     
    }
    else res.redirect('/login')
  })




  router.get('/mycart-covid-19-self-declaration',(req,res)=>{
    if(req.session.usernumber){
      console.log(req.session.getcategoryid)
      var query = `select c.*,(select s.name from services s where s.id = c.booking_id) as servicename
      from cart c where c.usernumber = "${req.session.usernumber}";`
      var query1 = `select count(id) as counter from cart where usernumber = "${req.session.usernumber}";`
      var query2 = `select sum(price) as total_ammount from cart  where usernumber = "${req.session.usernumber}"; `
      var query3 = `select name,image from category where id = "${req.session.getcategoryid}";`
      var query4 = `select name,logo from subcategory where categoryid = "${req.session.getcategoryid}";`
      var query5 = `select * from membership where categoryid = "${req.session.getcategoryid}"; `
      var query6 = `select * from membership_cart where membershipid = "${req.session.getcategoryid}"`
      pool.query(query+query1+query2+query3+query4+query5+query6,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) { 
               req.session.counter = result[1][0].counter
          res.render(`mycart`,{result:result,msg:'Please Accept Covid-19 Self Declaration Terms & Conditions'}) 
       //  res.json(result);
        }
        else res.render('cart-empty')
      })
     
    }
    else res.redirect('/login')
  })




  router.get('/cartdelete',(req,res)=>{
    const {id} = req.query
    pool.query(`select id,price,quantity from cart where id = "${id}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0].quantity > 1 ){
        console.log(result[0])
        pool.query(`update cart set price = price - (price/quantity) , quantity = quantity-1  where id = "${id}"`,(err,result)=>{
          err ? console.log(err) : res.json(result)
        })
      }
      else{
        pool.query(`delete from cart where id = "${id}"`,(err,result)=>{
          err ? console.log(err) :  res.json(result)
        })
      }

    })
  })




  router.get('/cartupdate',(req,res)=>{
    const {id} = req.query
    pool.query(`select id,price,oneprice,quantity from cart where id = "${id}"`,(err,result)=>{
      if(err) throw err;
      else{
        console.log(result[0])
        pool.query(`update cart set price = price + oneprice , quantity = quantity+1  where id = "${id}"`,(err,result)=>{
          err ? console.log(err) : res.json(result)
        })
      }
     

    })
  })




  router.get('/ca-cs-service',(req,res)=>{
    res.render('ca-cs-service')
  })

  router.get('/information',(req,res)=>{
    const {id} = req.query
    console.log('a')
    if(req.session.usernumber){  
     pool.query(`select b.*,
      (select s.name from services s where s.id = b.booking_id) as service_name,
      (select t.name from team t where t.number = b.service_agent) as service_agent_details,
      (select t.image from team t where t.number = b.service_agent) as service_agent_image
      from booking b where b.id= "${id}"`,(err,result)=>{
          if(err) throw err;
        //else res.json(result)
       else  res.render(`fullinformation`, { msg  : '', result:result });
      })  
     
    }
    else{
      res.redirect('login')
    }

  })


  router.post('/reschedule',(req,res)=>{
    console.log(req.body)
    pool.query(`update booking set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else{
          pool.query(`select categoryid from bookingid where id = '${req.body.id}'`,(err,result)=>{
            if(err) throw err;
            else {
pool.query(`select name,number from team where categoryid = '${result[0].categoryid}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]){
  for(i=0;i<result.length;i++){
              msg91.sendOne(authkey,result[i].number,` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.body.date} , ${req.body.time}, To pick this lead, visit on https://tinyurl.com/r3hepww`,senderid,route,dialcode,function(response){
          })
          pool.query(`insert into normal_message (number,date,time,message) values('${result[i].number}','${today}','${todaytime}','Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.body.date} , ${req.body.time}, To pick this lead, visit on https://tinyurl.com/r3hepww ') ` , (err,result)=>{
          })
            }

res.json({
  msg:'send Successfully'
})

  }
  else{
    res.json({
      msg : 'no partner'
    })
  }
})
            }
          })
        }
        //else res.json(result);
    })
  })

module.exports = router;