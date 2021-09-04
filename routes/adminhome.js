var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'partners'

router.get('/',(req,res)=>{
    if(req.session.adminid){
        var query = `select  b.*,(select s.name from services s where s.id = b.booking_id) as servicesname,
        (select t.name from team t where t.number = b.service_agent) as service_agent_details,
        (select t.image from team t where t.number = b.service_agent) as service_agent_image
        from booking b where b.booking_date = CURDATE();`
        var query1 = `select t.*,(select c.name from category c where t.categoryid = c.id) as categoryname from team1 t order by id desc;`
        var query2 = `select count(id) as total_users from users;`
        var query3 = `select count(id) as total_team from team;`
        var query4 = `select count(id) as total_booking from booking;`
        var query5= `select count(id) as inhouse_booking from booking where categoryid = '26' || categoryid = '28';`
        var query6 = `select count(id) as ca_cs_service from file_rtr;`
        var query7 = `select sum(price) as total_income from booking;`
        var query8 = `select count(b.id) as count ,(select c.name from category c where c.id = b.categoryid) as categoryname from booking b group by b.categoryid order by count desc;`
        var query9 = `select count(b.id) as count , booking_id from booking b group by b.booking_id order by count desc;`
        pool.query(query+query1+query2+query3+query4+query5+query6+query7+query8+query9,(err,result)=>{
            if(err) throw err;
            else  res.render('adminhome',{msg : '',result: result});
        
        }) 
       
    }
    else res.render('admin',{msg : 'Please Login'});
})




router.get('/bargraph',(req,res)=>
pool.query(`select sum(price) as totalprice, month(booking_date) as month from booking where year(booking_date) = year(curdate()) group by month(booking_date) `,(err,result)=>  err ? console.log(err) : res.json(result)))


router.get('/teamverificationcheck',(req,res)=>
pool.query(`select t.*,(select c.name from category c where t.categoryid = c.id) as categoryname from team1 t where approval is null order by id desc `,(err,result)=>err ? console.log(err) : res.json(result)))




    
router.get('/teamverification',(req,res)=>{
if(req.session.adminid || req.session.teamapprovalid) res.render('teamverification')
else res.redirect('/deloservices-login')})









router.get('/singleteamdeatils',(req,res)=>{
const {id} = req.query
pool.query(`select t.*,(select c.name from category c where t.categoryid = c.id) as categoryname from team1 t where id = "${id}"`,(err,result)=> err ? console.log(err) : res.json(result))})


router.get('/inhouse',(req,res)=>{
if(req.session.adminid || req.session.inhouseadminid) res.render('inhouse-service')
else res.redirect('/deloservices-login')})




router.get('/inhouseservice',(req,res)=> pool.query(`select b.*,(select c.name from category c where c.id = b.categoryid) as categoryname from booking b where b.categoryid = "26" and service_agent is null  || b.categoryid = "28" and service_agent is null`,(err,result)=> err ? console.log(err) : res.json(result)))






router.get('/liveservices',(req,res)=> pool.query(`select b.*,(select c.name from category c where c.id = b.categoryid) as categoryname from booking b where b.categoryid = "26" and status is null  || b.categoryid = "28" and status is null`,(err,result)=> err ? console.log(err) :   res.render('liverservices',{result:result})))


router.get('/ca-cs-services',(req,res)=> pool.query(`select * from file_rtr where status is null`,(err,result)=> err ? console.log(err) : res.json(result)))







/* Recharge Details */
router.get('/recharge_dashboard_details',(req,res)=>{
    pool.query(`select * from recharge order by id desc`,(err,result)=>{
    err ? console.log(err) : res.json(result)
    })
})

router.get('/reachrge_dashboard',(req,res)=>{
    if(req.session.adminid || req.session.teamapprovalid) res.render('recharge_dashboard')
    else res.redirect('/deloservices-login')})
    
/* Recharge Details End */




/* Booking Details */
router.get('/today',(req,res)=>
pool.query(`select * from booking`,(err,result)=> err ? console.log(err) : res.json(result)))


router.get('/booking-dashboard',(req,res)=>{
    res.render(`booking_dashboard`)
})
    
/* Booking Details End */




router.get('/chargesheet',(req,res)=>{
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


router.post('/refund-done', (req, res) => {
    console.log(req.body)
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})



module.exports = router;