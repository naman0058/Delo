var express = require('express')
var mysql = require('mysql')
var router = express.Router()
var pool = require('./pool')
var table = 'subcategory';
var upload = require('./multer');


router.get('/', (req, res) => {
    if(req.session.adminid ||    req.session.componentadminid) {
    res.render(`${table}`, { login: true , msg : '' });
    }
    else
    {
         res.render(`admin`, { msg : 'please log in' });
    }
})

router.post('/insert',upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    let body = req.body;
    var dirt = false
    var seo_variable = (body.name.split(' ').join('-')).toLowerCase()
    body['logo'] = req.files['logo'][0].filename
    body['image'] = req.files['image'][0].filename
    body['seo_name'] = seo_variable 
    pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('subcategory',{msg : 'Successfully Inserted'})
    })
})


router.get('/all', (req, res) => {
 
    pool.query(`select s.* ,(select c.name from category c where c.id=s.categoryid)  as categoryname from ${table} s `, (err, result) => {
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


router.post('/update_image',upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    let body = req.body;

    body['logo'] = req.files['logo'][0].filename
    body['image'] = req.files['image'][0].filename

    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/subcategory')
    })
})





router.get('/byservices',(req,res)=>{
   
    if(req.session.getcategoryid=='14' || req.session.getcategoryid == '29' || req.session.getcategoryid=='28'){
        var query = `select s.*,(select sub.logo from subcategory sub where sub.id = s.subcategoryid) as subcategorylogo,
        (select sub.image from subcategory sub where sub.id = s.subcategoryid) as subcategoryimage,
        (select sub.name from subcategory sub where sub.id = s.subcategoryid) as subcategoryname 
        from services s where s.subcategoryid = "${req.session.getsubcategoryid}";`
        var query1 = `select * from subcategory where categoryid = "${req.session.getcategoryid}";`
        var query2 = `select b.service_agent,b.name,b.date,b.rating,b.review,t.name as team_name ,t.image as team_image from booking b left join team t on b.service_agent = t.number where b.categoryid ="${req.session.getcategoryid}" and status is not null and rating!='get_rating' and rating!='get_review' and review!='get_rating' and review != 'get_review' and rating is not null and review is not null and service_agent = '988088879880';`
        var query3 = `select * from category limit 5;`
        pool.query(query+query1+query2+query3,(err,result)=>{
        if(err) throw err;
     else if(result[0][0]) res.render(`ourlaundry`,{result : result, login:true});
   // else if(result[0][0]) res.json(result)
      else res.render(`not_found`)
    })
    }
    else{

  

    if(req.session.usernumber) {

        if(req.session.getcategoryid =='21'){
            res.redirect('/file_rtr')
        }
        else if(req.session.getcategoryid=='9'){

            var query = `select s.*,(select sub.logo from subcategory sub where sub.id = s.subcategoryid) as subcategorylogo,
            (select sub.image from subcategory sub where sub.id = s.subcategoryid) as subcategoryimage,
            (select sub.name from subcategory sub where sub.id = s.subcategoryid) as subcategoryname 
            from services s where s.subcategoryid = "${req.session.getsubcategoryid}";`
            var query1 = `select * from subcategory where categoryid = "${req.session.getcategoryid}";`
            var query2 = `select b.service_agent,b.name,b.date,b.rating,b.review,t.name as team_name ,t.image as team_image from booking b left join team t on b.service_agent = t.number where b.categoryid ="${req.session.getcategoryid}" and  b.subcategoryid ="${req.session.getsubcategoryid}" and status is not null and rating!='get_rating' and rating!='get_review' and review!='get_rating' and review != 'get_review';`
        pool.query(query+query1+query2,(err,result)=>{
            if(err) throw err;
         else if(result[0][0]) res.render(`byservices`,{result : result, login:true});
       // else if(result[0][0]) res.json(result)
          else res.render(`not_found`)
        })

        }
        else{
            

          var query = `select s.*,(select sub.logo from subcategory sub where sub.id = s.subcategoryid) as subcategorylogo,
        (select sub.image from subcategory sub where sub.id = s.subcategoryid) as subcategoryimage,
        (select sub.name from subcategory sub where sub.id = s.subcategoryid) as subcategoryname 
        from services s where s.subcategoryid = "${req.session.getsubcategoryid}";`
        var query1 = `select * from subcategory where categoryid = "${req.session.getcategoryid}";`
        var query2 = `select b.service_agent,b.name,b.date,b.rating,b.review,t.name as team_name ,t.image as team_image from booking b left join team t on b.service_agent = t.number where b.categoryid ="${req.session.getcategoryid}" and status is not null and rating!='get_rating' and rating!='get_review' and review!='get_rating' and review != 'get_review';`
    pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
     else if(result[0][0]) res.render(`byservices`,{result : result, login:true});
   // else if(result[0][0]) res.json(result)
      else res.render(`not_found`)
    })
}
}
else{
    if(req.session.getcategoryid == "21"){
        res.redirect('/file_rtr')
    }
    else if(req.session.getcategoryid=='9'){

        var query = `select s.*,(select sub.logo from subcategory sub where sub.id = s.subcategoryid) as subcategorylogo,
        (select sub.image from subcategory sub where sub.id = s.subcategoryid) as subcategoryimage,
        (select sub.name from subcategory sub where sub.id = s.subcategoryid) as subcategoryname 
        from services s where s.subcategoryid = "${req.session.getsubcategoryid}";`
        var query1 = `select * from subcategory where categoryid = "${req.session.getcategoryid}";`
        var query2 = `select b.service_agent,b.name,b.date,b.rating,b.review,t.name as team_name ,t.image as team_image from booking b left join team t on b.service_agent = t.number where b.categoryid ="${req.session.getcategoryid}" and  b.subcategoryid ="${req.session.getsubcategoryid}" and status is not null and rating!='get_rating' and rating!='get_review' and review!='get_rating' and review != 'get_review';`
    pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
     else if(result[0][0]) res.render(`byservices`,{result : result, login:true});
   // else if(result[0][0]) res.json(result)
      else res.render(`not_found`)
    })

    }
    else{
    var query = `select s.*,(select sub.logo from subcategory sub where sub.id = s.subcategoryid) as subcategorylogo,
    (select sub.image from subcategory sub where sub.id = s.subcategoryid) as subcategoryimage,
    (select sub.name from subcategory sub where sub.id = s.subcategoryid) as subcategoryname 
    from services s where s.subcategoryid = "${req.session.getsubcategoryid}";`
        var query1 = `select * from subcategory where categoryid = "${req.session.getcategoryid}";`
        var query2 = `select b.service_agent,b.name,b.date,b.rating,b.review,t.name as team_name ,t.image as team_image from booking b left join team t on b.service_agent = t.number where b.categoryid ="${req.session.getcategoryid}" and status is not null and rating!='get_rating' and rating!='get_review' and review!='get_rating' and review != 'get_review' ;`
    pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
    else if(result[0][0]) res.render(`byservices`,{result : result,login:false});
   // else if(result[0][0]) res.json(result)
      else res.render(`not_found`)
    })

    }
}
    }
})


router.post('/getid',(req,res)=>{
    let body = req.body;
    req.session.getsubcategoryid = body.id;
    res.send('success');
})

module.exports = router;