var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'advertise';
var upload = require('./multer');

router.get('/',(req,res)=>{
    res.render('advertise',{msg : ''})
    })


router.post('/insert', (req, res) => {
    let body = req.body;
     pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('advertise',{msg : 'Your Request is successfully submitted..Our team will contact you within 24-48 hours'})
    })
})








module.exports = router
