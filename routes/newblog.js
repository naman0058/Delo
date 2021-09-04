var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'blog_category'


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

router.get('/',(req,res)=>{
    if(req.session.adminid || req.session.blogadminid){
       res.render(`new-blog`,{msg : ''})
    }
    else{
        res.render(`admin`,{msg : 'Please Login'})
    }
})


router.post('/insert',upload.single('image'), (req, res) => {
    let body = req.body;
    body['image'] = req.file.filename
    body['date'] = today
  pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.json(result)
    })
})

router.get('/all',(req,res)=>pool.query(`select b.*,(select c.name from category c where c.id = b.categoryid) as categoryname from ${table} b`,(err,result)=>err ? console.log(err) : res.json(result)))


router.post('/update', (req, res) => {
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.post('/update_image',upload.single('image'), (req, res) => {
    let body = req.body;

    body['image'] = req.file.filename

    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/newblog')
    })
})


router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


module.exports = router;