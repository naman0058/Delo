var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'team'



router.get('/',(req,res)=>{
    console.log(req.session.teamnumber)
    console.log(req.session.loginverify)
    if(req.session.teamnumber){
        var query = `select * from team where number = ${req.session.teamnumber} and approval is not null`
        pool.query(query,(err,result)=>{
            if(err) throw err;
            else if(result[0]){ 
                req.session.categoryid = result[0].categoryid
                req.session.subcategoryid = result[0].subcategoryid
                req.session.pincode = result[0].pincode
                req.session.pincode1 = result[0].pincode1
                req.session.pincode2 = result[0].pincode2
                req.session.pincode3 = result[0].pincode3
                req.session.pincode4 = result[0].pincode4
                req.session.pincode5 = result[0].pincode5
                req.session.pincode6 = result[0].pincode6
                req.session.pincode7 = result[0].pincode7
                req.session.pincode8 = result[0].pincode8
                req.session.servicesid = result[0].servicesid
                req.session.servicesid1 = result[0].servicesid1
                req.session.servicesid2 = result[0].servicesid2
                req.session.servicesid3 = result[0].servicesid3
                req.session.servicesid4 = result[0].servicesid4
                req.session.servicesid5 = result[0].servicesid5
                res.redirect('/team_dashboard');
        }
             else res.render('processing')
          
        })
    }
    else res.redirect('/team_login');
})



router.get('/login',(req,res)=>{
    if(req.session.loginverify){
        var query = `select * from team where  number = ${req.session.loginverify} and approval is not null`
        pool.query(query,(err,result)=>{
            if(err) throw err;
            else if(result[0]) { 
                req.session.categoryid = result[0].categoryid
                req.session.subcategoryid = result[0].subcategoryid
                req.session.pincode = result[0].pincode
                req.session.pincode1 = result[0].pincode1
                req.session.pincode2 = result[0].pincode2
                req.session.pincode3 = result[0].pincode3
                req.session.pincode4 = result[0].pincode4
                req.session.pincode5 = result[0].pincode5
                req.session.pincode6 = result[0].pincode6
                req.session.pincode7 = result[0].pincode7
                req.session.pincode8 = result[0].pincode8
                req.session.servicesid = result[0].servicesid
                req.session.servicesid1 = result[0].servicesid1
                req.session.servicesid2 = result[0].servicesid2
                req.session.servicesid3 = result[0].servicesid3
                req.session.servicesid4 = result[0].servicesid4
                req.session.servicesid5 = result[0].servicesid5
               
                res.redirect('/team_dashboard');
        }
             else res.render('processing')
          
        })
    }
    else res.redirect('/team_login');
})

module.exports = router