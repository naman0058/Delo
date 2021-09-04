var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'booking_dashboard_login'


router.get('/',(req,res)=>{

    if(req.session.booking_dashboard_id){
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
            else  res.render('booking_dashboard',{msg : '',result: result});
        
        }) 
       
    }
    else res.render('booking_dashboard_login',{msg : 'Please Login'});
})



router.get('/booking_dashboard_login',(req,res)=> res.render(`booking_dashboard_login`,{msg : ''}))


router.post('/login',(req,res)=>{
    const{email,password,key} = req.body
    if(key == process.env.API_KEY ){
      var query =`select * from ${table} where email = "${email}" and password = "${password}"`
      pool.query(query,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
                 req.session.booking_dashboard_id = result[0].id;
                  
                   res.redirect('/booking_dashboard');
          }
             
                  else res.render('booking_dashboard_login',{msg : 'Incorrect Password'})
      })
        
    }
    else res.render('booking_dashboard_login',{msg : 'Incorrect Key'})
    
  
})



// Booking Summary Data
router.get('/booking_summary',(req,res)=>pool.query(`select count(id) as booking , month(booking_date) as month from booking where year(booking_date) = year(curdate()) group by month(booking_date)`,(err,result)=> err ? console.log(err) : res.json(result)));

// Booking BarGraph Data
router.get('/bargraph',(req,res)=> pool.query(`select sum(price) as totalprice, month(booking_date) as month from booking where year(booking_date) = year(curdate()) group by month(booking_date) `, (err,result)=>  err ? console.log(err) : res.json(result)));


// Booking details
router.get('/booking_details',(req,res)=>{
    if(req.session.booking_dashboard_id){
     pool.query(`select b.*,(select c.name from category c where c.id = b.categoryid ) as categoryname, (select s.name from subcategory s where s.id = b.subcategoryid) as subcategoryname from booking b  where b.status is null order  by id desc`,(err,result)=> err ? console.log(err) : res.render(`booking_details_information`,{result : result}))
    }
    else res.render('booking_dashboard_login',{msg : 'Please Login'});
    });


// Single Booking Data
router.get('/single_booking_data',(req,res)=>{
    if(req.session.booking_dashboard_id){

    pool.query(`select b.*,(select t.name from team t where t.number = b.service_agent)as teamname, (select t.image from team t where t.number = b.service_agent)as teamimage , (select c.name from category c where c.id = b.categoryid ) as categoryname, (select s.name from subcategory s where s.id = b.subcategoryid) as subcategoryname from booking b where b.id = "${req.query.id}"`,(err,result)=> err ? console.log(err) : res.render(`booking_single_details_information`,{result:result}))
    }
    else res.render('booking_dashboard_login',{msg : 'Please Login'});
});



router.get('/invoice',(req,res)=>{
   var query = `select a.*,(select r.name from rate_card r where r.id = a.serviceid) as servicename from addon_cart a where a.booking_id = '${req.query.bookingid}';`
       var query1 = `select count(id) as counter from addon_cart where booking_id = '${req.query.bookingid}';`
     var query2 = `select sum(price) as total_ammount from addon_cart  where booking_id = '${req.query.bookingid}'; `
     var query3 = `select service_charge from addon_cart where booking_id = '${req.query.bookingid}' order by service_charge desc limit 1;`
     var query4 = `select payment_mode,price,service_agent from booking where id = '${req.query.bookingid}';`
  var query5 = `select * from booking where id = '${req.query.bookingid}';`
 
   pool.query(query+query1+query2+query3+query4+query5,(err,result)=>{
     if(err) throw err;
     else if(result[0]){
 //     res.json(result)
 res.render('invoice-copy',{result:result})
     }
     else{
       res.json({
         msg :'no data'
       })
     }
   })
})








router.get('/partner-invoice',(req,res)=>{
   var query = `select a.*,(select r.name from rate_card r where r.id = a.serviceid) as servicename from addon_cart a where a.booking_id = '${req.query.bookingid}';`
       var query1 = `select count(id) as counter from addon_cart where booking_id = '${req.query.bookingid}';`
     var query2 = `select sum(price) as total_ammount from addon_cart  where booking_id = '${req.query.bookingid}'; `
     var query3 = `select service_charge from addon_cart where booking_id = '${req.query.bookingid}' order by service_charge desc limit 1;`
     var query4 = `select payment_mode,price,service_agent from booking where id = '${req.query.bookingid}';`
  var query5 = `select * from booking where id = '${req.query.bookingid}';`
 
   pool.query(query+query1+query2+query3+query4+query5,(err,result)=>{
     if(err) throw err;
     else if(result[0]){
 //     res.json(result)
 res.render('invoice-partner',{result:result})
     }
     else{
       res.json({
         msg :'no data'
       })
     }
   })
})









//Cancel Booking Data
router.get('/cancel_booking_details',(req,res)=>{
 if(req.session.booking_dashboard_id){

    pool.query(`select c.* , (select t.name from team t where t.number = c.service_agent)as teamname from cancel_booking c order by id desc`,(err,result)=> err ? console.log(err) : res.render(`cancel_booking_details`,{result:result}))
 }
 else res.render('booking_dashboard_login',{msg : 'Please Login'});
})

//Single Cancel booking Data
router.get('/single_cancel_booking_data',(req,res)=>{
    if(req.session.booking_dashboard_id){

    pool.query(`select c.* , (select t.name from team t where t.number = c.service_agent)as teamname , (select t.image from team t where t.number = c.service_agent)as teamimage from cancel_booking c where c.id = "${req.query.id}" order by id desc`,(err,result)=> err ? console.log(err) : res.render(`single_cancel_booking_data`,{result:result}))
    }
    else res.render('booking_dashboard_login',{msg : 'Please Login'});    
})


// Failed paymeny details
router.get('/failed_payment_details',(req,res)=>{
    if(req.session.booking_dashboard_id){
    pool.query(`select f.*,(select c.name from category c where c.id = f.categoryid ) as categoryname, (select s.name from subcategory s where s.id = f.subcategoryid) as subcategoryname from failed_payment f order  by id desc`,(err,result)=> err ? console.log(err) : res.render(`failed_payment_details`,{result : result}))
}
else res.render('booking_dashboard_login',{msg : 'Please Login'});
});

// Single Payment Failed Details
router.get('/single_failed_payment_details',(req,res)=>{
    if(req.session.booking_dashboard_id){
    pool.query(`select f.*,(select c.name from category c where c.id = f.categoryid ) as categoryname, (select s.name from subcategory s where s.id = f.subcategoryid) as subcategoryname from failed_payment f where f.id = "${req.query.id}"`,(err,result)=> err ? console.log(err) : res.render(`single_failed_payment_details`,{result : result}))
    }
    else res.render('booking_dashboard_login',{msg : 'Please Login'});
});



router.get('/booking_calender',(req,res)=>{
    if(req.session.booking_dashboard_id) res.render(`booking_calendar`)
    else res.render('booking_dashboard_login',{msg : 'Please Login'});
})

router.get('/history',(req,res)=>{
    if(req.session.booking_dashboard_id){

    
    pool.query(`select * from booking where status = 'completed' order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render(`history_details_information`,{result:result})
    })
}
else res.render('booking_dashboard_login',{msg : 'Please Login'});
})




// Done Work


///*Checkout Details Successfully Start  *////

//Cehckout Details Data
router.get('/checkout_details_data',(req,res)=>{
    if(req.session.booking_dashboard_id){

       pool.query(`select c.*  from checkout_details c order by id desc`,(err,result)=> err ? console.log(err) : res.render(`checkout_details_data`,{result:result}))
    }
       else res.render('booking_dashboard_login',{msg : 'Please Login'});
})

//Single Checkout Details Data

router.get('/single_checkout_details_data',(req,res)=>{
    if(req.session.booking_dashboard_id){
    pool.query(`select c.*, (select ca.name from category ca where ca.id = c.categoryid ) as categoryname, (select s.name from subcategory s where s.id = c.subcategoryid ) as subcategoryname from checkout_details c where c.id = "${req.query.id}"`,(err,result)=>{
        if(err) throw err;
        else res.render(`single_checkout_details_data`,{result:result})
    })
}
else res.render('booking_dashboard_login',{msg : 'Please Login'});
})

///*Checkout Details Successfully Done *////


///* Add to Cart Detailse Successfully Start *////

//Add to cart Details Data
router.get('/cart_details_data',(req,res)=>{
    if(req.session.booking_dashboard_id){
    pool.query(`select c.*,(select s.name from services s where s.id = c.booking_id) as servicename,(select s.name from subcategory s where s.id = c.subcategoryid) as subcategoryname, (select ca.name from category ca where ca.id = c.categoryid) as categoryname from cart c order by id desc`,(err,result)=> err ? console.log(err) : res.render(`cart_details_data`,{result:result}))
}
else res.render('booking_dashboard_login',{msg : 'Please Login'});
})


///* Add to Cart Detailse Successfully Done *////


router.get('/logout',(req,res)=>{
    req.session.booking_dashboard_id = null
    res.redirect('/booking_dashboard/booking_dashboard_login')
})





// router.get('/details',(req,res)=>{
//     if(req.session.usernumber){
//     pool.query(`select * from file_rtr where number = "${req.session.usernumber}" and status is null `,(err,result)=>{
//         if(err) throw err;
//         //else res.json(result)
//        else res.render(`file-rtr-details`,{result:result})
//     })
// }
// else res.redirect('/login');
// })








router.get('/file_rtr_booking_details',(req,res)=>{
    pool.query(`select * from file_rtr where id = "${req.query.id}" and status is null `,(err,result)=>{
        if(err) throw err;
       //else res.json(result)
        else res.render(`filertr_single_details`,{result:result})
    })
  
  })
  

  router.get('/file_rtr_booking',(req,res)=>{
    pool.query(`select * from file_rtr where status is null order by id desc `,(err,result)=>{
        if(err) throw err;
        //else res.json(result)
        else res.render(`file-rtr-details_booking`,{result:result})
    })
  
  })
  



  router.get('/file_rtr_booking_history',(req,res)=>{
    pool.query(`select * from file_rtr where status is not null `,(err,result)=>{
        if(err) throw err;
        else res.json(result)
      //  else res.render(`file-rtr-details`,{result:result})
    })
  
  })


  router.post('/file_rtr_booking_update',(req,res)=>{
    pool.query(`update file_rtr set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
  
  })
  


module.exports = router;