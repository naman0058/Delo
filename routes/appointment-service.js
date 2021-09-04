var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'appointment_service';
var upload = require('./multer');
var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var senderid='DELOTM';
var route='4';
var dialcode='91';
var payumoney = require('payumoney-node');
var checksum = require('../lib/checksum');
payumoney.setKeys(`${process.env.PAYUMONEYKEY1}`, `${process.env.PAYUMONEYKEY2}`,`${process.env.PAYUMONEYKEY3}`); 
payumoney.isProdMode(true);
const fetch = require('node-fetch');



router.get('/',(req,res)=>{
    req.session.appointment_number = req.query.number
    res.render(`appointment_service`,{login:false})
    
})


router.post('/insert', (req, res) => {
    let body = req.body;
    body['number'] = req.session.appointment_number
    body['categoryid'] = 62
    if(body.discount=="" || body.discount==[] || body.discount == null || body.discount == "null"){
        body['price'] = body.total_price
        body['our_price'] = ((body.total_price)*5)/100

    }
    else{
    var finalprice = +(body.total_price) - ((body.total_price) * (body.discount) )/100;
     body['price'] = finalprice
     body['our_price'] =(+finalprice)+(+(finalprice)*5)/100
    }
  
   pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.send('success')
   })
})


router.get('/all',(req,res)=>{
    pool.query(`select t.*, (select c.name from appointment_subcategory c where c.id = t.subcategoryid) as categoryname from ${table} t where t.number = '${req.session.appointment_number}'`,(err,result)=>{
        if(err) throw err;
        else {
            res.json(result)
        }
    })
})


router.get('/appointment-category',(req,res)=>{
    pool.query(`select * from appointment_subcategory`,(err,result)=>{
        if(err) throw err;
        else {
            res.json({
                result:result
            })
        }
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
    if(body.discount=="" || body.discount==[] || body.discount == null || body.discount == "null"){
        body['price'] = body.total_price
        body['our_price'] = ((body.total_price)*5)/100
    }
    else{
        var finalprice = +(body.total_price) - ((body.total_price) * (body.discount) )/100;
     body['price'] = finalprice
     body['our_price'] =(+finalprice)+(+(finalprice)*5)/100
    }
    console.log(req.body) 
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.post('/update_image',upload.single('logo'), (req, res) => {
    let body = req.body;

    body['logo'] = req.file.filename

    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/services')
    })
})




module.exports = router
