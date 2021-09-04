var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'dial_subservices';
var upload = require('./multer');


var dt = new Date();
var todaytime = dt.getHours() + ":" + dt.getMinutes();



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
  res.render('dial_subservices')
    // if(req.session.adminid ||    req.session.componentadminid) {
    // res.render(`${table}`, { login: true , msg : '' });
    // }
    // else
    // {
    //      res.render(`admin`, { msg : 'please login' });
    // }
})

router.post('/insert', (req, res) => {
    let body = req.body;
      var seo_variable = (body.name.split(' ').join('-')).toLowerCase()
    body['seo_name'] = seo_variable 
   
   pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('success')
    })
})

router.get('/single', (req, res) => {
    const { id} = req.query;
    if(req.session.id) {
     
    pool.query(`select * from answer where subjectid =${id}  `, (err, result) => {
        if(err) throw err;
        else res.render('unitbyid',{result:result,login : true} );
     //   else res.json(result);
    })
}
else {
    pool.query(`select * from answer where subjectid =${id}  `, (err, result) => {
        if(err) throw err;
  else  res.render('unitbyid',{result:result,login : false} );

    })
}
})






router.get('/all', (req, res) => {
 pool.query(`select s.* ,(select c.name from dial_category c where c.id=s.categoryid) as categoryname,
                (select sc.name from dial_subcategory sc where sc.id=s.subcategoryid) as subcategoryname
                 from ${table} s`
                , (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})




router.get('/single', (req, res) => {
    const { id } = req.query
    pool.query(`select * from ${table} where id = ${id}`, (err, result) => {
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
   let body = req.body
 
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})





module.exports = router;