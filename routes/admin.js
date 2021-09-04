
var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'admin'

const dotenv = require('dotenv');
dotenv.config();


router.get('/',(req,res)=> res.render('admin',{msg : ''}))



router.post('/login',(req,res)=>{
    const{email,password,key} = req.body
    if(key == process.env.API_KEY ){
      var query =`select * from ${table} where email = "${email}" and password = "${password}"`
      pool.query(query,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
                 req.session.adminid = result[0].id;
                   req.session.adminname = result[0].username;
                   res.redirect('/adminhome');
          }
             
                  else res.render('admin',{msg : 'Incorrect Password'})
      })
        
    }
    else res.render('admin',{msg : 'Incorrect Key'})
    
  
})



router.post('/blog_login',(req,res)=>{
  const{email,password,key} = req.body
  if(key == process.env.API_KEY ){
    var query =`select * from blog_admin where email = "${email}" and password = "${password}"`
    pool.query(query,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
                 req.session.blogadminid = result[0].id;
                 req.session.blogadminname = result[0].username;
                 res.redirect('/newblog');
        }
           
                else res.render('admin',{msg : 'Incorrect Password'})
    })
      
  }
  else res.render('admin',{msg : 'Incorrect Key'})
  
  
})



router.post('/inhouse_login',(req,res)=>{
  const{email,password,key} = req.body
  if(key == process.env.API_KEY ){
    var query =`select * from inhouse_admin where email = "${email}" and password = "${password}"`
    pool.query(query,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
                 req.session.inhouseadminid = result[0].id;
                 req.session.inhouseadminname = result[0].username;
                 res.redirect('/adminhome/inhouse');
        }
           
                else res.render('admin',{msg : 'Incorrect Password'})
    })
      
  }
  else res.render('admin',{msg : 'Incorrect Key'})
  
  
   
})



router.post('/component_login',(req,res)=>{
  const{email,password,key} = req.body
  if(key == process.env.API_KEY ){
    var query =`select * from component_admin where email = "${email}" and password = "${password}"`
    pool.query(query,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
                 req.session.componentadminid = result[0].id;
                 req.session.componentadminname = result[0].username;
                 res.redirect('/category');
        }
           
                else res.render('admin',{msg : 'Incorrect Password'})
    })
      
  }
  else res.render('admin',{msg : 'Incorrect Key'})
  
  
   
})



router.post('/team_approval_login',(req,res)=>{
  const{email,password,key} = req.body
  if(key == process.env.API_KEY ){
    var query =`select * from team_approval_login where email = "${email}" and password = "${password}"`
    pool.query(query,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
                 req.session.teamapprovalid = result[0].id;
                  res.redirect('/adminhome/teamverification');
        }
           
                else res.render('admin',{msg : 'Incorrect Password'})
    })
      
  }
  else res.render('admin',{msg : 'Incorrect Key'})
  
  
   
})




router.get('/chargesheet',(req,res)=>{
  pool.query(`select * from booking where payment_mode = 'online'`,(err,result)=>{
    if(err) throw err;
    else res.render('chargesheet',{result:result})
  })
})






router.get('/logout',(req,res)=>{
    req.session.adminid = null;
    req.session.adminname = null;
    req.session.inhouseadminid = null;
    req.session.blogadminid = null;
    req.session.componentadminid = null;
    req.session.teamapprovalid = null;
    res.redirect('/deloservices-login')})






router.get('/chartsheet',(req,res)=>{
  pool.query(`select b.* , t.account_holder_name , t.ifsc_code , t.account_number from booking b left join team t on b.service_agent = t.number where b.payment_mode = 'online' && b.refund_status is null && b.booking_date < curdate();;`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.render('chargesheet',{result:result})
    }
    else{
   res.send('no data')
    }
  })
})




module.exports = router;