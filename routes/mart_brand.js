var express = require('express')
var mysql = require('mysql')
var router = express.Router()
var pool = require('./pool')
var table = 'delomart_brand';
var upload = require('./multer');


router.get('/', (req, res) => {
    res.render(`mart_brand`, { login: true , msg : '' });
    // if(req.session.adminid ||    req.session.componentadminid) {
    // res.render(`${table}`, { login: true , msg : '' });
    // }
    // else
    // {
    //      res.render(`admin`, { msg : 'please log in' });
    // }
})

router.post('/insert' , (req, res) => {
    let body = req.body;
    var seo_variable = (body.name.split(' ').join('-')).toLowerCase()
    body['seo_name'] = seo_variable 
    pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('success')
    })
})


router.get('/all', (req, res) => {
     pool.query(`select s.* ,
        (select c.name from delomart_category c where c.id=s.categoryid)  as categoryname,
        (select sub.name from delomart_subcategory sub where sub.id=s.subcategoryid)  as subcategoryname,
        (select subs.name from delomart_subservices subs where subs.id=s.subservicesid)  as subservicesname
        
        
         from ${table} s 
                `, (err, result) => {
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
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})





router.post('/update_image',upload.single('image'), (req, res) => {
    let body = req.body;

     body['image'] = req.file.filename
   console.log(body)
   pool.query(`update ${table}  set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/mart_subcategory')
    })
})




router.get('/get_all_category',(req,res)=>{
    pool.query(`select * from delomart_category`,(err,result)=>{
        err ? console.log(err) : res.json(result)
    })
})




module.exports = router;