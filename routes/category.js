var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');

router.get('/', (req, res) => {
    if(req.session.adminid ||    req.session.componentadminid) {
    res.render(`${table}`, { login: true , msg  : '' });
    }
    else
    {
         res.render(`admin`, { msg : 'please login' });
    }
})

router.post('/insert',upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    let body = req.body;
    var dirt = false
    var seo_variable = (body.name.split(' ').join('-')).toLowerCase()
    body['logo'] = req.files['logo'][0].filenamef
    body['image'] = req.files['image'][0].filename
    body['seo_name'] = seo_variable 
    pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('category',{msg : 'Successfully Inserted'})
    })
})


router.get('/service/:name',(req,res)=>{

     if(req.session.usernumber) {
        pool.query(`select * from category where seo_name = "${req.params.name}"`,(err,result)=>{
            if(err) throw err;
            else 
            {
                req.session.getcategoryid = result[0].id;
           
        var query = `select s.*,(select c.image from category c where c.id = "${req.session.getcategoryid}" ) as categoryimage,
        (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname 
        from subcategory s where s.categoryid = "${req.session.getcategoryid}";`
         pool.query(query,(err,result)=>{
            if(err) throw err;
            else if(result[0]) res.render(`bysubcategory`,{result:result,login:true});
            else res.render(`not_found`)
          
        })

    }
})

    }
    else{

        pool.query(`select * from category where seo_name = "${req.params.name}"`,(err,result)=>{
            if(err) throw err;
            else 
            {
                req.session.getcategoryid = result[0].id;
            
        var query = `select s.*,(select c.image from category c where c.id = "${req.session.getcategoryid}" ) as categoryimage,
        (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname 
        from subcategory s where s.categoryid = "${req.session.getcategoryid}";`
        pool.query(query,(err,result)=>{
            if(err) throw err;
            else if(result[0]) res.render(`bysubcategory`,{result:result,login:false});
            else res.render(`not_found`)
          
          
        })
    
    }
})
    }
    

})


router.get('/all', (req, res) => {
   
    pool.query(`select * from ${table}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})




router.get('/get',(req,res)=>{
    pool.query(`select * from ${table} limit 8`, (err, result) => {
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
    console.log(req.body)
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.post('/update_image',upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    let body = req.body;

    body['logo'] = req.files['logo'][0].filename
    body['image'] = req.files['image'][0].filename
   console.log(body)
   pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/category')
    })
})



router.get('/allcategory', (req, res) => {
    pool.query(`select * from ${table}`, (err, result) => {
        if(err) throw err;
        else res.render(`allcategory`,{result : result});
    })
})



router.post('/bysubcategory',(req,res)=>{
    console.log(req.body)
})



router.get('/all-lisiting', (req, res) => {
   
    pool.query(`select * from dial_category`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})



router.get('/city', (req, res) => {
    pool.query(`select name,id from city`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})



router.get('/locality', (req, res) => {
    pool.query(`select * from locality`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.get('/dial_categories', (req, res) => {
    pool.query(`select * from dial_category order by name`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})


router.get('/dial_subcategory', (req, res) => {
    pool.query(`select * from dial_subcategory order by name`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})




router.get('/dial_subservices', (req, res) => {
    pool.query(`select * from dial_subservices order by name`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})




router.get('/search',(req,res)=>{
     pool.query(`select * from category where name = "${req.session.search}"`,(err,result)=>{

if(err) throw err;
else if(result[0]){


 req.session.getcategoryid = result[0].id;
     var query = `select s.*,(select c.image from category c where c.id = "${req.session.getcategoryid}" ) as categoryimage,
     (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname,
     (select c.seo_name from category c where c.id = "${req.session.getcategoryid}") as seocategoryname,
     (select c.description from category c where c.id = "${req.session.getcategoryid}") as shortdescription,
     (select c.keywords from category c where c.id = "${req.session.getcategoryid}") as keyword,
     (select c.title from category c where c.id = "${req.session.getcategoryid}") as title
     from subcategory s where s.categoryid = "${req.session.getcategoryid}";`
      pool.query(query,(err,result)=>{
if(err) throw err;
else res.render(`bysubcategory`,{result:result,login:true,places : 'Delhi NCR',city:'New Delhi'});
      })


}
else{


  pool.query(`select * from subcategory where name = "${req.session.search}"`,(err,result)=>{


if(err) throw err;
else if(result[0]){

 req.session.getcategoryid = result[0].categoryid;
     var query = `select s.*,(select c.image from category c where c.id = "${req.session.getcategoryid}" ) as categoryimage,
     (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname,
     (select c.seo_name from category c where c.id = "${req.session.getcategoryid}") as seocategoryname,
     (select c.description from category c where c.id = "${req.session.getcategoryid}") as shortdescription,
     (select c.keywords from category c where c.id = "${req.session.getcategoryid}") as keyword,
     (select c.title from category c where c.id = "${req.session.getcategoryid}") as title
     from subcategory s where s.categoryid = "${req.session.getcategoryid}";`
      pool.query(query,(err,result)=>{
if(err) throw err;
else res.render(`bysubcategory`,{result:result,login:true,places : 'Delhi NCR',city:'New Delhi'});
      })

}
else{



  res.render('not_search',{msg:'Tell us what are you looking for?',search:'req.session.search'})
}
})


}

     })
})








module.exports = router;