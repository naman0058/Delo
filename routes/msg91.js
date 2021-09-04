var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'booking_dashboard_login'


router.get('/',(req,res)=>{

    if(req.session.booking_dashboard_id){
        var query = `select count(id) as total_users from otp_msg where date = CURDATE();`
        var query1 = `select count(id) as cancel_booking from normal_message;`
        var query2 = `select count(id) as total_booking from otp_msg;`
        var query3 = `select count(id) as completed_booking from promotional_message;`
        var query4 = `select count(id) as normal_message from normal_message where date = CURDATE();`
        var query5 = `select count(id) as promotional_message from promotional_message where date = CURDATE();`
        var query6 = `select count(id) as offline_booking from booking where payment_mode = 'cash';`
        var query7 = `SELECT count(distinct usernumber) as booking_customer FROM booking;`
        var query8 = `select * from users order by id desc limit 20;`
        var query9 = `select count(id) as monthly_otp_msg from otp_msg where year(date) = year(CURDATE()) group by month(date);`
        var query10 = `select count(id) as monthly_normal_message from normal_message where year(date) = year(curdate()) group by month(date);`
        var query11 = `select count(id) as monthly_promotional_message from promotional_message where year(date) = year(curdate()) group by month(date);`
        pool.query(query+query1+query2+query3+query4+query5+query6+query7+query8+query9+query10+query11,(err,result)=>{
            if(err) throw err;
            //else res.json(result);
            else  res.render('msg91_dashboard',{msg : '',result: result});
        
        }) 
       
    }
    else res.render('booking_dashboard_login',{msg : 'Please Login'});
})




router.get('/report',(req,res)=>{
    if(req.session.booking_dashboard_id)
    res.render(`msgreport`)
    else res.render('booking_dashboard_login',{msg : 'Please Login'});

})


router.get('/search',(req,res)=>{
    let query = req.query
    console.log(req.query)
    if(req.query.type == 'otp')
    {
        pool.query(`select * from otp_msg where date between "${req.query.from}" and "${req.query.to}"`,(err,result)=>{
            if(err) throw err;
            else res.json(result)
        })
    }
    else if(req.query.type=='normal'){
        pool.query(`select * from normal_message where date between "${req.query.from}" and "${req.query.to}"`,(err,result)=>{
            if(err) throw err;
            else res.json(result)
        })
    }
    else{
        pool.query(`select * from promotional_message where date between "${req.query.from}" and "${req.query.to}"`,(err,result)=>{
            if(err) throw err;
            else res.json(result)
        })
    }
   
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


module.exports = router;