var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'team_dashboard_login'


//Team Verification Dashboard Starts

router.get('/',(req,res)=>{

    if( req.session.team_verification_dashboard_id){
        var query = `select count(id) as total_users from team where approval = 'approved';`
        var query1 = `select count(id) as cancel_booking from team1;`
        var query2 = `select count(id) as total_booking from booking;`
        var query3 = `select count(id) as completed_booking from team where recharge_value>0;`
        var query4 = `select sum(price) as total_income from booking;`
        var query5 = `select count(id) as online_booking from booking where payment_mode = 'online';`
        var query6 = `select count(id) as offline_booking from booking where payment_mode = 'cash';`
        var query7 = `SELECT count(distinct usernumber) as booking_customer FROM booking;`
        var query8 = `select t.*, (select c.name from category c where c.id = t.categoryid) as categoryname from team t where t.approval = 'pending'  order by id desc limit 20;`
        pool.query(query+query1+query2+query3+query4+query5+query6+query7+query8,(err,result)=>{
            if(err) throw err;
            else  res.render('team_verification_dashboard',{msg : '',result: result});
        
        }) 
       
    }
    else res.render('team_dashboard_login',{msg : 'Please Login'});
})







router.post('/update_data',upload.fields([{ name: 'aadhar_front_number', maxCount: 1 }, { name: 'aadhar_back_number', maxCount: 1 },{name:'pan_number', maxCount : 1}, { name: 'licence_number', maxCount: 1 }, { name: 'pan_back_side', maxCount: 1 }]),(req,res)=>{
    
    let body = req.body
    body['aadhar_front_number'] = req.files['aadhar_front_number'][0].filename
    body['aadhar_back_number'] = req.files['aadhar_back_number'][0].filename
    body['pan_number'] = req.files['pan_number'][0].filename
    body['licence_number'] = req.files['licence_number'][0].filename
    body['id'] = req.body.id
    body['recharge_value'] = 0
    body['pincode1'] = 110067
    body['pincode2'] = 110067
    body['pincode3'] = 110067
    body['pincode4'] = 110067
    body['pincode5'] = 110067
    body['pincode6'] = 110067
    body['pincode7'] = 110067
    body['pincode8'] = 110067
      body['approval'] =  'completed'


    console.log(body)
    pool.query(`update team set ? where id = ?`, [req.body, req.body.id], (err, result) => {
      if(err) throw err;
      else if(result) res.redirect('/team-verification-dashboard')
    
    })
   

  })



router.get('/report',(req,res)=>{
    pool.query(`select name,id from category`,(err,result)=>{
        if(err) console.log(err)
        else res.render(`member_report`,{result:result})
    })
})




router.get('/search',(req,res)=>{
    console.log(req.query)
    pool.query(`select * from team where categoryid = "${req.query.type}" and recharge_value > 0 order by id desc ` ,(err,result)=>{
        if(err) console.log(err)
        else res.json(result)
    })
})



router.get('/searching',(req,res)=>{
    console.log(req.query)
    pool.query(`
    select * from team where categoryid = "${req.query.type}" and pincode = "${req.query.pincode}" and recharge_value > 0 
    ||  categoryid = "${req.query.type}" and pincode1 = "${req.query.pincode}" and recharge_value > 0 
    ||  categoryid = "${req.query.type}" and pincode2 = "${req.query.pincode}" and recharge_value > 0
    ||  categoryid = "${req.query.type}" and pincode3 = "${req.query.pincode}" and recharge_value > 0  
    ||  categoryid = "${req.query.type}" and pincode4 = "${req.query.pincode}" and recharge_value > 0  
    ||  categoryid = "${req.query.type}" and pincode5 = "${req.query.pincode}" and recharge_value > 0  
    ||  categoryid = "${req.query.type}" and pincode6 = "${req.query.pincode}" and recharge_value > 0 
    ||  categoryid = "${req.query.type}" and pincode7 = "${req.query.pincode}" and recharge_value > 0 
    ||  categoryid = "${req.query.type}" and pincode8 = "${req.query.pincode}" and recharge_value > 0 
      ` ,(err,result)=>{
        if(err) console.log(err)
        else res.json(result)
    })
})


// Team verification Dashboard Ends



router.get('/team_dashboard_login',(req,res)=> res.render(`team_dashboard_login`,{msg : ''}))


router.post('/login',(req,res)=>{
    const{email,password,key} = req.body
    if(key == process.env.API_KEY ){
      var query =`select * from ${table} where email = "${email}" and password = "${password}"`
      pool.query(query,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
                 req.session.team_verification_dashboard_id = result[0].id;
                  
                   res.redirect('/team-verification-dashboard');
          }
             
                  else res.render('team_dashboard_login',{msg : 'Incorrect Password'})
      })
        
    }
    else res.render('team_dashboard_login',{msg : 'Incorrect Key'})
    
  
})



// Booking Summary Data
router.get('/booking_summary',(req,res)=>pool.query(`select count(id) as booking , month(booking_date) as month from booking where year(booking_date) = year(curdate()) group by month(booking_date)`,(err,result)=> err ? console.log(err) : res.json(result)));

// Booking BarGraph Data
router.get('/bargraph',(req,res)=> pool.query(`select sum(price) as totalprice, month(booking_date) as month from booking where year(booking_date) = year(curdate()) group by month(booking_date) `, (err,result)=>  err ? console.log(err) : res.json(result)));


// Booking details




//////////////////////////for team insert//////////////////////////




// Single Booking Data
router.get('/update_details',(req,res)=>{
    if( req.session.team_verification_dashboard_id){

    pool.query(`select t.*, (select c.name from category c where c.id = t.categoryid ) as categoryname from team t where t.id = "${req.query.id}"`,(err,result)=> err ? console.log(err) :res.render(`update_details_data`,{result:result}))
    }
    else res.render('team_dashboard_login',{msg : 'Please Login'});
});









//Cancel Booking Data
router.get('/cancel_booking_details',(req,res)=>{
 if( req.session.team_verification_dashboard_id){

    pool.query(`select c.* , (select t.name from team t where t.number = c.service_agent)as teamname from cancel_booking c order by id desc`,(err,result)=> err ? console.log(err) : res.render(`cancel_booking_details`,{result:result}))
 }
 else res.render('team_dashboard_login',{msg : 'Please Login'});
})

//Single Cancel booking Data
router.get('/single_cancel_booking_data',(req,res)=>{
    if( req.session.team_verification_dashboard_id){

    pool.query(`select c.* , (select t.name from team t where t.number = c.service_agent)as teamname , (select t.image from team t where t.number = c.service_agent)as teamimage from cancel_booking c where c.id = "${req.query.id}" order by id desc`,(err,result)=> err ? console.log(err) : res.render(`single_cancel_booking_data`,{result:result}))
    }
    else res.render('team_dashboard_login',{msg : 'Please Login'});    
})


// Failed paymeny details
router.get('/failed_payment_details',(req,res)=>{
    if( req.session.team_verification_dashboard_id){
    pool.query(`select f.*,(select c.name from category c where c.id = f.categoryid ) as categoryname, (select s.name from subcategory s where s.id = f.subcategoryid) as subcategoryname from failed_payment f order  by id desc`,(err,result)=> err ? console.log(err) : res.render(`failed_payment_details`,{result : result}))
}
else res.render('team_dashboard_login',{msg : 'Please Login'});
});

// Single Payment Failed Details
router.get('/single_failed_payment_details',(req,res)=>{
    if( req.session.team_verification_dashboard_id){
    pool.query(`select f.*,(select c.name from category c where c.id = f.categoryid ) as categoryname, (select s.name from subcategory s where s.id = f.subcategoryid) as subcategoryname from failed_payment f where f.id = "${req.query.id}"`,(err,result)=> err ? console.log(err) : res.render(`single_failed_payment_details`,{result : result}))
    }
    else res.render('team_dashboard_login',{msg : 'Please Login'});
});



router.get('/booking_calender',(req,res)=>{
    if( req.session.team_verification_dashboard_id) res.render(`booking_calendar`)
    else res.render('team_dashboard_login',{msg : 'Please Login'});
})

router.get('/history',(req,res)=>{
    if( req.session.team_verification_dashboard_id){

    
    pool.query(`select * from booking where status = 'completed' order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render(`history_details_information`,{result:result})
    })
}
else res.render('team_dashboard_login',{msg : 'Please Login'});
})




router.get('/approved-professionals',(req,res)=>{
    if( req.session.team_verification_dashboard_id){
     pool.query(`select t.*, (select c.name from category c where c.id = t.categoryid) as categoryname from team t where t.approval = 'approved'  order by id desc;`,(err,result)=> err ? console.log(err) : res.render(`approved_professionals`,{result : result}))
    }
    else res.render('team_dashboard_login',{msg : 'Please Login'});
    });





    router.get('/unapproved-professionals',(req,res)=>{
        if( req.session.team_verification_dashboard_id){
         pool.query(`select t.*, (select c.name from category c where c.id = t.categoryid) as categoryname from team1 t order by id desc;`,(err,result)=> err ? console.log(err) : res.render(`unapproved_professionals`,{result : result}))
        }
        else res.render('team_dashboard_login',{msg : 'Please Login'});
        });

// Done Work


///*Checkout Details Successfully Start  *////

//Cehckout Details Data
router.get('/single_approval_details',(req,res)=>{
    if( req.session.team_verification_dashboard_id){

       pool.query(`select t.*, (select c.name from category c where c.id = t.categoryid) as categoryname from team t where t.id = "${req.query.id}"`,(err,result)=> err ? console.log(err) : res.render(`single_approval_details`,{result:result}))
    }
       else res.render('team_dashboard_login',{msg : 'Please Login'});
})



router.get('/work_history',(req,res)=>{
    pool.query(`select b.*,c.name as categoryname from booking b left join category c on b.categoryid = c.id where b.service_agent = "${req.query.number}" `,(err,result)=>{
        console.log('result',result)
        if(err) throw err;
        else if(result[0]){
            res.render('credit-history',{result:result})
        }
        else res.send('Data not found')
    })
})



router.get('/cancel_history',(req,res)=>{
    pool.query(`select b.* from cancel_booking b where service_agent = "${req.query.number}" `,(err,result)=>{
        console.log('result',result)
        if(err) throw err; 
        else if(result[0]){
            res.render('cancel-history',{result:result})
        }
        else res.send('Data not found')
    })
})


router.get('/activate',(req,res)=>{
    pool.query(`select * from team1 where id = "${req.query.id}"`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            pool.query(`insert into team(name,emailid,age,gender,birth_place,image,number,nationality,local_address,pincode,created_date,latitude,longitude,categoryid,approval,)
            values("${result[0].name}","${result[0].emailid}","${result[0].age}","${result[0].gender}","${result[0].birth_place}","${result[0].image}","${result[0].number}","${result[0].nationality}","${result[0].address}","${result[0].pincode}","${result[0].created_date}","${result[0].latitude}","${result[0].longitude}","${result[0].categoryid}",'pending')`,(err,result)=>{
                if(err) throw err;
               else{
                   pool.query(`delete from team1 where id = "${req.query.id}"`,(err,result)=>{
                       if(err) throw err;
                       else res.redirect(`/team-verification-dashboard/unapproved-professionals`);
                   })
               } 
               
            })
        }
    })
})









router.get('/reject',(req,res)=>{
    pool.query(`select * from team1 where id = "${req.query.id}"`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            pool.query(`insert into reject(name,emailid,age,gender,birth_place,image,number,nationality,local_address,pincode,created_date,latitude,longitude,categoryid)
            values("${result[0].name}","${result[0].emailid}","${result[0].age}","${result[0].gender}","${result[0].birth_place}","${result[0].image}","${result[0].number}","${result[0].nationality}","${result[0].address}","${result[0].pincode}","${result[0].created_date}","${result[0].latitude}","${result[0].longitude}","${result[0].categoryid}")`,(err,result)=>{
                if(err) throw err;
               else{
                   pool.query(`delete from team1 where id = "${req.query.id}"`,(err,result)=>{
                       if(err) throw err;
                       else res.send('success')
                   })
               } 
               
            })
        }
    })
})







router.get('/reject-professionals',(req,res)=>{
    if( req.session.team_verification_dashboard_id){
     pool.query(`select t.*, (select c.name from category c where c.id = t.categoryid) as categoryname from reject t order by id desc;`,(err,result)=> err ? console.log(err) : res.render(`reject_professionals`,{result : result}))
    }
    else res.render('team_dashboard_login',{msg : 'Please Login'});
    });



//Single Checkout Details Data

router.get('/single_checkout_details_data',(req,res)=>{
    if( req.session.team_verification_dashboard_id){
    pool.query(`select c.*, (select ca.name from category ca where ca.id = c.categoryid ) as categoryname, (select s.name from subcategory s where s.id = c.subcategoryid ) as subcategoryname from checkout_details c where c.id = "${req.query.id}"`,(err,result)=>{
        if(err) throw err;
        else res.render(`single_checkout_details_data`,{result:result})
    })
}
else res.render('team_dashboard_login',{msg : 'Please Login'});
})

///*Checkout Details Successfully Done *////


///* Add to Cart Detailse Successfully Start *////

//Add to cart Details Data
router.get('/cart_details_data',(req,res)=>{
    if( req.session.team_verification_dashboard_id){
    pool.query(`select c.*,(select s.name from services s where s.id = c.booking_id) as servicename,(select s.name from subcategory s where s.id = c.subcategoryid) as subcategoryname, (select ca.name from category ca where ca.id = c.categoryid) as categoryname from cart c order by id desc`,(err,result)=> err ? console.log(err) : res.render(`cart_details_data`,{result:result}))
}
else res.render('team_dashboard_login',{msg : 'Please Login'});
})


///* Add to Cart Detailse Successfully Done *////


router.get('/logout',(req,res)=>{
     req.session.team_verification_dashboard_id = null
    res.redirect('/team-verification-dashboard/team_dashboard_login')
})




router.get('/recharge_details',(req,res)=>{
    if(req.session.team_verification_dashboard_id){
    pool.query(`select * from recharge order by id desc`,(err,result)=>{
        if(err) throw err;
        else res.render(`recharge_details`,{result : result})
    })
}
else res.render('team_dashboard_login',{msg : 'Please Login'});
})







module.exports = router;