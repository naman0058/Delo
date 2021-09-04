var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'membership';
var upload = require('./multer');



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


router.get('/', (req, res) => {
    if(req.session.adminid ||    req.session.componentadminid) {
    res.render(`${table}`, { login: true , msg  : '' });
    }
    else
    {
         res.render(`admin`, { msg : 'please login' });
    }
})

router.post('/insert', (req, res) => {
    let body = req.body;
     pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.json(result)
    })
})


router.get('/all', (req, res) => {
   
    pool.query(`select m.* , (select c.name from category c where c.id = m.categoryid) as categoryname  from ${table} m`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})



router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})

router.post('/update', (req, res) => {
    console.log(req.body)
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})




router.post('/cart',(req,res)=>{
    let body = req.body
 
    body['date'] = today    
    body['usernumber'] = req.session.usernumber
    console.log(body)
    pool.query(`insert into membership_cart set ?`,body, (err, result) => {
        if(err) throw err;
        else res.json('result')
    })
    
})


router.get('/checkcode',(req,res)=>{
    const {code} = req.query
    if(req.session.usernumber){

    
    pool.query(`select * from our_member where usernumber = "${req.session.usernumber}" and code = "${code}" and categoryid = "${req.session.getcategoryid}" `,(err,result)=>{
        if(err) throw err;
        else if(result[0]) res.send('applied')
        else res.send('Invalid Code')
    })
}
else{
    res.redirect('/login')
}
})

module.exports = router;