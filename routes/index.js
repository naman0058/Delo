
var express = require('express');
var router = express.Router();
var mysql = require('mysql')
var pool = require('./pool')

  var d = new Date();
  var n = d.getDay();

//fp7x58


let r = Math.random().toString(36).substring(7);
console.log("random", r);

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


  console.log("aaj day hai",n)

router.get('/', (req, res) => {
 if(req.session.usernumber) {
   var query = `select * from category;`
  var query1 = `select id,name from services;`
  var query2 = `select * from dial_category order by name;`
  var query3 = `select * from delomart_category;`
  var query4 = `select * from delomart_subcategory where categoryid = "1";`
  var query5 = `select * from delomart_subcategory where categoryid = "2";`
  var query6 = `select * from delomart_subcategory where categoryid = "3";`
  var query7 = `select * from delomart_subcategory where categoryid = "4";`
  var query8 = `select * from delomart_subcategory where categoryid = "5";`
  var query9 = `select * from delomart_subcategory where categoryid = "6";`
  var query10 = `select * from delomart_subcategory where categoryid = "7";`
var query11 = `select * from delomart_subcategory where categoryid = "8";`
    var query12 = `select * from delomart_subcategory where categoryid = "10";`
     var query13 = `select * from delomart_subcategory where categoryid = "11";`
   var query14 = `select * from delomart_subcategory where categoryid = "13";`
        var query15 = `select * from delomart_subcategory where categoryid = "14";`
         var query16 = `select * from delomart_subcategory where categoryid = "15";`
          var query17 = `select * from delomart_subcategory where categoryid = "16";`
           var query18 = `select * from delomart_subcategory where categoryid = "17";`
  var query19 = `select * from delomart_subcategory where categoryid = "18";`
    var query20 = `select * from delomart_subcategory where categoryid = "19";`
    var query21 = `select * from delomart_subcategory where categoryid = "20";`
    var query22 = `select * from delomart_subcategory where categoryid = "21";`
    var query23 = `select * from delomart_subcategory where categoryid = "22";`
     pool.query(query+query1+query2+query3+query4+query5+query6+query7+query8+query9+query10+query11+query12+query13+query14+query15+query16+query17+query18+query19+query20+query21+query22+query23,(err,result)=>{
      if(err) throw err;
    else res.render(`index`, {result : result , login:true});
  })
}
else{
  var query = `select * from category;`
  var query1 = `select id,name from services;`
  var query2 = `select * from dial_category order by name;`
  var query3 = `select * from delomart_category;`
  var query4 = `select * from delomart_subcategory where categoryid = "1";`
  var query5 = `select * from delomart_subcategory where categoryid = "2";`
  var query6 = `select * from delomart_subcategory where categoryid = "3";`
  var query7 = `select * from delomart_subcategory where categoryid = "4";`
  var query8 = `select * from delomart_subcategory where categoryid = "5";`
  var query9 = `select * from delomart_subcategory where categoryid = "6";`
  var query10 = `select * from delomart_subcategory where categoryid = "7";`
var query11 = `select * from delomart_subcategory where categoryid = "8";`
    var query12 = `select * from delomart_subcategory where categoryid = "10";`
     var query13 = `select * from delomart_subcategory where categoryid = "11";`
   var query14 = `select * from delomart_subcategory where categoryid = "13";`
        var query15 = `select * from delomart_subcategory where categoryid = "14";`
         var query16 = `select * from delomart_subcategory where categoryid = "15";`
          var query17 = `select * from delomart_subcategory where categoryid = "16";`
           var query18 = `select * from delomart_subcategory where categoryid = "17";`
  var query19 = `select * from delomart_subcategory where categoryid = "18";`
    var query20 = `select * from delomart_subcategory where categoryid = "19";`
    var query21 = `select * from delomart_subcategory where categoryid = "20";`
    var query22 = `select * from delomart_subcategory where categoryid = "21";`
    var query23 = `select * from delomart_subcategory where categoryid = "22";`
     pool.query(query+query1+query2+query3+query4+query5+query6+query7+query8+query9+query10+query11+query12+query13+query14+query15+query16+query17+query18+query19+query20+query21+query22+query23,(err,result)=>{
      if(err) throw err;
    else res.render(`index`, {result : result , login:false});
  })
}
      

})





router.get('/index1', (req, res) => {
  if(req.session.usernumber) {
   var query = `select * from category;`
   var query1 = `select id,name from services;`
    pool.query(query+query1,(err,result)=>{
     if(err) throw err;
     else res.render(`index1`, {result : result , login:true});
   })
 }
 else{
   var query = `select * from category;`
   var query1 = `select id,name from services;`
  pool.query(query+query1,(err,result)=>{
     if(err) throw err;
     else res.render(`index1`, {result : result , login:false});
   })
 }
  
 })



router.get('/delhi-ncr-:name/:places/:city',(req,res)=>{
  var places = (req.params.places.split('-').join(' ')).toLowerCase()
  var city = (req.params.city.split('-').join(' ')).toLowerCase()
  //res.send(places)
  if(req.session.usernumber) {
    pool.query(`select * from category where seo_name = "${req.params.name}"`,(err,result)=>{
        if(err) throw err;
        else 
        {
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
       
        else if(result[0]) res.render(`bysubcategory`,{result:result,login:true,places : places,city:city});
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
    (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname ,
    (select c.seo_name from category c where c.id = "${req.session.getcategoryid}") as seocategoryname,
    (select c.description from category c where c.id = "${req.session.getcategoryid}") as shortdescription ,
    (select c.keywords from category c where c.id = "${req.session.getcategoryid}") as keyword,
    (select c.title from category c where c.id = "${req.session.getcategoryid}") as title 
    from subcategory s where s.categoryid = "${req.session.getcategoryid}";`
    pool.query(query,(err,result)=>{
        if(err) throw err;
        else if(result[0]) res.render(`bysubcategory`,{result:result,login:false,places : places,city:city});
        else res.render(`not_found`)
      
      
    })

}
})
}


  //res.send(req.params.places)
  //res.send('aa')
})


 router.get('/delhi-ncr-:name',(req,res)=>{
  console.log(req.params.name)
  console.log(req.query.name)
 var name = "beauty-services"
 if(req.session.usernumber) {
     pool.query(`select * from category where seo_name = "${req.params.name}"`,(err,result)=>{
         if(err) throw err;
         else 
         {
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
        
         else if(result[0]) res.render(`bysubcategory`,{result:result,login:true,places : 'Delhi NCR',city:'New Delhi'});
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
     (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname ,
     (select c.seo_name from category c where c.id = "${req.session.getcategoryid}") as seocategoryname,
     (select c.description from category c where c.id = "${req.session.getcategoryid}") as shortdescription ,
     (select c.keywords from category c where c.id = "${req.session.getcategoryid}") as keyword ,
     (select c.title from category c where c.id = "${req.session.getcategoryid}") as title
     from subcategory s where s.categoryid = "${req.session.getcategoryid}";`
     pool.query(query,(err,result)=>{
         if(err) throw err;
         else if(result[0]) res.render(`bysubcategory`,{result:result,login:false,places : 'Delhi NCR',city:'New Delhi'});
         else res.render(`not_found`)
       
       
     })
 
 }
})
 }
 

})

 

router.get('/service/:name',(req,res)=>{
  console.log(req.params.name)
  console.log(req.query.name)

 if(req.session.usernumber) {
     pool.query(`select * from category where seo_name = "${req.params.name}"`,(err,result)=>{
         if(err) throw err;
         else 
         {
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
        
         else if(result[0]) res.render(`bysubcategory`,{result:result,login:true,places :'Delhi NCR',city:'New Delhi'});
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
     (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname ,
     (select c.seo_name from category c where c.id = "${req.session.getcategoryid}") as seocategoryname,
     (select c.description from category c where c.id = "${req.session.getcategoryid}") as shortdescription,
     (select c.keywords from category c where c.id = "${req.session.getcategoryid}") as keyword,
     (select c.title from category c where c.id = "${req.session.getcategoryid}") as title  
     from subcategory s where s.categoryid = "${req.session.getcategoryid}";`
     pool.query(query,(err,result)=>{
         if(err) throw err;
         else if(result[0]) res.render(`bysubcategory`,{result:result,login:false,places : 'Delhi NCR',city:'New Delhi'});
         else res.render(`not_found`)
       
       
     })
 
 }
})
 }
 

})





 

router.get('/subcategory/services/:seo_name/',(req,res)=>{
   
  if(req.session.getcategoryid=='14' || req.session.getcategoryid == '29' || req.session.getcategoryid=='28' || req.session.getcategoryid=='31'){
      var query = `select s.*,(select sub.logo from subcategory sub where sub.id = s.subcategoryid) as subcategorylogo,
      (select sub.image from subcategory sub where sub.id = s.subcategoryid) as subcategoryimage,
      (select sub.name from subcategory sub where sub.id = s.subcategoryid) as subcategoryname 
      from services s where s.subcategoryid = "${req.session.getsubcategoryid}";`
      var query1 = `select * from subcategory where categoryid = "${req.session.getcategoryid}";`
      var query2 = `select b.service_agent,b.name,b.date,b.rating,b.review,t.name as team_name ,t.image as team_image from booking b left join team t on b.service_agent = t.number where b.categoryid ="${req.session.getcategoryid}" and status is not null and rating!='get_rating' and rating!='get_review' and review!='get_rating' and review != 'get_review' and rating is not null and review is not null and service_agent = '988088879880';`
      var query3 = `select * from category limit 5;`
      var query4 = `select keywords from subcategory where id = "${req.session.getsubcategoryid}";`
  pool.query(query+query1+query2+query3+query4,(err,result)=>{
      if(err) throw err;
   else if(result[0][0]) res.render(`ourlaundry`,{result : result, login:true,places : 'Delhi NCR',city:'New Delhi'});
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
          var query3 = `select * from category limit 5;`
          var query4 = `select keywords from subcategory where id = "${req.session.getsubcategoryid}";`
          pool.query(query+query1+query2+query3+query4,(err,result)=>{
          if(err) throw err;
       else if(result[0][0]) res.render(`byservices`,{result : result, login:true,places : 'Delhi NCR',city:'New Delhi'});
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
      var query3 = `select * from category limit 5;`
      var query4 = `select keywords from subcategory where id = "${req.session.getsubcategoryid}";`
      pool.query(query+query1+query2+query3+query4,(err,result)=>{
      if(err) throw err;
   else if(result[0][0]) res.render(`byservices`,{result : result, login:true,places : 'Delhi NCR',city:'New Delhi'});
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
      var query3 = `select * from category limit 5;`
      var query4 = `select keywords from subcategory where id = "${req.session.getsubcategoryid}";`
      pool.query(query+query1+query2+query3+query4,(err,result)=>{
      if(err) throw err;
   else if(result[0][0]) res.render(`byservices`,{result : result, login:true,places : 'Delhi NCR',city:'New Delhi'});
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
      var query3 = `select * from category limit 5;`
      var query4 = `select keywords from subcategory where id = "${req.session.getsubcategoryid}";`
      pool.query(query+query1+query2+query3+query4,(err,result)=>{
      if(err) throw err;
  else if(result[0][0]) res.render(`byservices`,{result : result,login:false});
 // else if(result[0][0]) res.json(result)
    else res.render(`not_found`)
  })

  }
}
  }
})

















router.post('/searching',(req,res)=>{
  let body =  req.body;
  let request_name = req.body.seo_name;
  console.log('body hai',body)
  var seo_variable = (body.seo_name.split(' ').join('-')).toLowerCase();
  body['seo_name'] = seo_variable 
 

console.log("searching-data",req.body)

 if(body.seo_name==null || body.seo_name=='null' || body.seo_name==[] || body.seo_name==''){
 res.render('not_found')
}
else {
 
pool.query(`select id from dial_category where seo_name = "${req.body.seo_name}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0]){
    let categoryid = result[0].id
    
      pool.query(`select id from city where name = "${req.body.city}"`,(err,result)=>{
          if(err) throw err;
          else{
              let city = result[0].id
              console.log("result",result[0].id)
              var query = `select l.* , (select c.name from dial_category c where c.id = "${categoryid}") as categoryname
              , (select ci.name from city ci where ci.id = "${city}") as cityname
              from listing l where l.categoryid="${categoryid}" and l.cityid="${city}";`
             var query1 = `select * from dial_category order by name;`
             var query2 = `select * from dial_subcategory where categoryid = "${categoryid}";`
              pool.query(query+query1+query2,(err,result)=>{
                  if(err) throw err;
                  else if(result[0][0]) res.render(`listing`, {result : result , login:false,date:today});
                  //else if(result[0]) res.json(result)
                  else res.render('not_found')
              })
              
          }
      })
  }
  else{
  res.render('not_search',{msg:'Tell us what are you looking for?',search:request_name})
  }
})

}
})



router.get('/:city-:servicename/dial-delo',(req,res)=>{

  pool.query(`select id from dial_category where seo_name = "${req.params.servicename}"`,(err,result)=>{
    if(err) throw err;
    else{
      let categoryid = result[0].id
      pool.query(`select name from dial_subcategory  where categoryid="${categoryid}"`,(err,result)=>{
        if(err) throw err;
        else if(result[0].name == "Nops"){
          pool.query(`select id from city where name = "${req.params.city}"`,(err,result)=>{
            if(err) throw err;
            else{
              let city = result[0].id
              console.log("result",result[0].id)
           var query = `select l.* , (select c.name from dial_category c where c.id = "${categoryid}") as categoryname,
              (select ca.seo_name from dial_category ca where ca.id="${categoryid}") as categoryseoname ,
              (select ci.name from city ci where ci.id = "${city}") as cityname
              from listing l where l.categoryid="${categoryid}" and l.cityid="${city}" order by expiry_date desc;`
              var query1 = `select * from dial_category order by name; `
              var query2 = `select * from dial_subcategory where categoryid = "${categoryid}";`
              var query3 = `select * from dial_category where seo_name = "${req.params.servicename}";`
              pool.query(query+query1+query2+query3,(err,result)=>{
                  if(err) throw err;
                  else if(result[0][0]) res.render(`single_listing`, {result : result , login:false,date:today});
                  //else if(result[0]) res.json(result)
                  else res.render('not_found')
              })
            }
          })
        
        }
        else{


pool.query(`select name from dial_subservices where categoryid = "${categoryid}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0].name=="Nops"){
  pool.query(`select id from city where name = "${req.params.city}"`,(err,result)=>{
 if(err) throw err;
            else{
              let city = result[0].id
              console.log("result",result[0].id)
              var query = `select l.* , (select c.name from dial_category c where c.id = "${categoryid}") as categoryname,
              (select ca.seo_name from dial_category ca where ca.id="${categoryid}") as categoryseoname ,
              (select ci.name from city ci where ci.id = "${city}") as cityname
              from listing l where l.categoryid="${categoryid}" and l.cityid="${city}" order by expiry_date desc;`
              var query1 = `select * from dial_category order by name;`
              var query2 = `select * from dial_subcategory where categoryid = "${categoryid}";`
              var query3 = `select * from dial_category where seo_name = "${req.params.servicename}";`
              pool.query(query+query1+query2+query3,(err,result)=>{
                  if(err) throw err;
                  else if(result[0][0]) res.render(`listing`, {result : result , login:false,date:today});
                  //else if(result[0]) res.json(result)
                  else res.render('not_found')
              })

            }
  })
  }
  else{
 pool.query(`select id from city where name = "${req.params.city}"`,(err,result)=>{
 if(err) throw err;
            else{
              let city = result[0].id
              console.log("result",result[0].id)
                var query = `select l.* , (select c.name from dial_category c where c.id = "${categoryid}") as categoryname,
              (select ca.seo_name from dial_category ca where ca.id="${categoryid}") as categoryseoname ,
              (select ci.name from city ci where ci.id = "${city}") as cityname
              from listing l where l.categoryid="${categoryid}" and l.cityid="${city}" order by expiry_date desc ;`
              var query1 = `select * from dial_category order by name;`
              var query2 = `select * from dial_subcategory where categoryid = "${categoryid}";`
              var query3 = `select * from dial_category where seo_name = "${req.params.servicename}";`
              pool.query(query+query1+query2+query3,(err,result)=>{
                  if(err) throw err;
                  else if(result[0][0]) res.render(`multi_listing`, {result : result , login:false,date:today});
                  //else if(result[0]) res.json(result)
                  else res.render('not_found')
              })

            }
  })
  }
})

        
        }
      })
    }
  })

})







router.get('/:city/:services/:listingname/dial-delo',(req,res)=>{
  let seo_name = req.params.listingname
  //let seo_address = req.params.listingaddress
  let cityname = req.params.city
  let services_seo_name = req.params.services
pool.query(`select id from dial_category where seo_name = "${req.params.services}"`,(err,result)=>{
  if(err) throw err;
  else {
    console.log("id aayi",result[0].id)
    let categoryid  = result[0].id
 
  console.log("seo_name",seo_name);
 // console.log("seo_address",seo_address);
  pool.query(`select id from listing where seo_name ="${seo_name}" `,(err,result)=>{
    if(err) throw err;
    else{
      let userid = result[0].id
      console.log("userid",userid);
      var query1 = `select * from listing where seo_name ="${seo_name}";`
      var query2 = `select * from also_listing where userid = "${userid}";`
      var query3 = `select * from dial_rating where userid = "${userid}";`
      var query4 = `select avg(rating) as avg_rating from dial_rating where userid = "${userid}";`
      var query5 = `select * from dial_category order by name;`
      var query6 = `select seo_name , seo_address , banner_image from listing where categoryid = "${categoryid}" and id!= "${userid}" limit 10;`
    
    pool.query(query1+query2+query3+query4+query5+query6,(err,result)=>{
      if(err) throw err;
        else res.render('listing_detail',{result:result,msg:n,date:today,city:cityname,services:services_seo_name})

    })
  }

})
   }
})


})





router.get('/delo-mart-:name',(req,res)=>{
  pool.query(`select id from delomart_category where seo_name = "${req.params.name}"`,(err,result)=>{
    if(err) throw err;
    else{
let query = `select d.* , 
              (select c.name from delomart_category c where c.id = d.categoryid) as categoryname,
              (select c.seo_name from delomart_category c where c.id = d.categoryid) as seocategoryname,
               (select c.image from delomart_category c where c.id = d.categoryid) as categoryimage,
               (select c.another_name from delomart_category c where c.id = d.categoryid) as anothercategoryname
from delomart_subcategory d where d.categoryid="${result[0].id}" order by id;`
let query1 = `   SELECT name, id
   FROM
     (SELECT name,id,
                  @subcategoryid_rank := IF(@current_subcategoryid = subcategoryid, @subcategoryid_rank + 1, 1) AS subcategoryid_rank,
                  @current_subcategoryid := subcategoryid
       FROM delomart_subservices
       ORDER BY subcategoryid
     ) ranked
   WHERE subcategoryid_rank <= 5;`
 let query2 = `select d.*,
              (select c.seo_name from delomart_category c where c.id=d.categoryid) as seocategoryname, 
              (select sub.seo_name from delomart_subcategory sub where sub.id = d.subcategoryid) as seosubcategoryname
               from delomart_subservices d ;`  
 let query3 = `select * from delomart_category where seo_name = "${req.params.name}";`              
  pool.query(query+query1+query2+query3,(err,result)=>{
    err ? console.log(err) : res.render('mart_subcategory_show',{result:result})
  })            

    }
  })
 
})




router.get('/delo-mart-:category/:subcategory',(req,res)=>{
  pool.query(`select id from delomart_subcategory where seo_name = "${req.params.subcategory}"`,(err,result)=>{
    if(err) throw err;
    else{
      console.log("id aayi h",result[0].id)
      let query = `select d.*,
                   (select s.name from delomart_subcategory s where s.id = d.subcategoryid) as subcategoryname,
                    (select c.seo_name from delomart_category c where c.id = d.categoryid) as seocategoryname,
                     (select sub.seo_name from delomart_subcategory sub where sub.id = d.subcategoryid) as seosubcategoryname
                  from delomart_subservices d where d.subcategoryid = "${result[0].id}";`
                   let query1 = `select d.*,
              (select c.seo_name from delomart_category c where c.id=d.categoryid) as seocategoryname, 
              (select sub.seo_name from delomart_subcategory sub where sub.id = d.subcategoryid) as seosubcategoryname
               from delomart_subservices d ;`
               let query2 = `select * from delomart_subcategory where seo_name = "${req.params.subcategory}";` 
      pool.query(query+query1+query2,(err,result)=>{
        if(err) throw err;
        else if(result[0]) res.render('mart_subservices_show',{result:result})
          else res.send('data not available')
      })
    }
  })
})




router.get('/delo-mart-:category/:subcategory/:subservices',(req,res)=>{

pool.query(`select id from delomart_subcategory where seo_name = "${req.params.subcategory}"`,(err,result)=>{
  if(err) throw err;
  else {
    let subcategoryid = result[0].id

  pool.query(`select id , seo_name from delomart_subservices where seo_name = "${req.params.subservices}"`,(err,result)=>{
    if(err) throw err;
    else{
      let subservices_seo_name = result[0].seo_name
      console.log('subservicesid',result[0].id)
      let query = `select p.*,c.name as companyname , c.address as companyaddress , ci.name as cityname , l.name as localityname , b.name as brandname
       from delomart_product p
       left join mart_user c on p.number = c.number
       left join city ci on c.cityid = ci.id
       left join locality l on c.localityid = l.id
       left join delomart_brand b on p.brand = b.id  where p.subservicesid = "${result[0].id}";`
        var query1 = `select * from delomart_subservices order by name;`
        var query2 = `select * from city order by name;`
        var query3 = `select * from delomart_brand where subservicesid = "${result[0].id}";`
        var query4 = `select d.*,  
        (select s.seo_name from delomart_subcategory s where s.id = d.subcategoryid) as seosubcategoryname,
        (select c.seo_name from delomart_category c where c.id = d.categoryid) as seocategoryname
 from delomart_subservices d where d.subcategoryid = "${subcategoryid}";`
       pool.query(query+query1+query2+query3+query4,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) res.render('product_show',{result:result,name:subservices_seo_name})
                else res.send("data not available")
      })
    }
  })
    }
})

})






router.get('/delo-mart-:category/:subcategory/:subservices/brand/:brand',(req,res)=>{
console.log('first')
pool.query(`select id from delomart_subcategory where seo_name = "${req.params.subcategory}"`,(err,result)=>{
  if(err) throw err;
  else {
    console.log('second', result[0].id)
    let subcategoryid = result[0].id

  pool.query(`select id,seo_name from delomart_subservices where seo_name = "${req.params.subservices}"`,(err,result)=>{
    if(err) throw err;
    else{
      console.log('third')
     let subservices_seo_name = result[0].seo_name
     let subservices_id = result[0].id
pool.query(`select id from delomart_brand where seo_name = "${req.params.brand}"`,(err,result)=>{
  if(err) throw err;
  else {
    console.log('brand id',result[0].id)
  let query = `select p.*,c.name as companyname , c.address as companyaddress , ci.name as cityname , l.name as localityname , b.name as brandname
       from delomart_product p
       left join mart_user c on p.number = c.number
       left join city ci on c.cityid = ci.id
       left join locality l on c.localityid = l.id
       left join delomart_brand b on p.brand = b.id  where p.brand = "${result[0].id}" and p.subservicesid = "${subservices_id}";`
        var query1 = `select * from delomart_subservices order by name;`
        var query2 = `select * from city order by name;`
        var query3 = `select * from delomart_brand where subservicesid = "${subservices_id}";`
        var query4 = `select d.*,  
        (select s.seo_name from delomart_subcategory s where s.id = d.subcategoryid) as seosubcategoryname,
        (select c.seo_name from delomart_category c where c.id = d.categoryid) as seocategoryname
 from delomart_subservices d where d.subcategoryid = "${subcategoryid}";`
       pool.query(query+query1+query2+query3+query4,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) res.render('product_show',{result:result,name:subservices_seo_name})
                 else res.send("data not available")
      })
  }
})
    
    }
  })
    }
})

})















router.get('/delo-mart-:category/:subcategory/:subservices/IN/India/city',(req,res)=>{
console.log('first')
pool.query(`select id from delomart_subcategory where seo_name = "${req.params.subcategory}"`,(err,result)=>{
  if(err) throw err;
  else {
    console.log('second', result[0].id)
    let subcategoryid = result[0].id

  pool.query(`select id,seo_name from delomart_subservices where seo_name = "${req.params.subservices}"`,(err,result)=>{
    if(err) throw err;
    else{
      console.log('third')
     let subservices_seo_name = result[0].seo_name
     let subservices_id = result[0].id
pool.query(`select id from city where name = "${req.query.city}"`,(err,result)=>{
  if(err) throw err;
  else {
    console.log('brand id',result[0].id)
  let query = `select p.*,c.name as companyname , c.address as companyaddress , ci.name as cityname , l.name as localityname , b.name as brandname
       from delomart_product p
       left join mart_user c on p.number = c.number
       left join city ci on c.cityid = ci.id
       left join locality l on c.localityid = l.id
       left join delomart_brand b on p.brand = b.id  where p.cityid = "${result[0].id}" and p.subservicesid = "${subservices_id}";`
        var query1 = `select * from delomart_subservices order by name;`
        var query2 = `select * from city order by name;`
        var query3 = `select * from delomart_brand where subservicesid = "${subservices_id}";`
        var query4 = `select d.*,  
        (select s.seo_name from delomart_subcategory s where s.id = d.subcategoryid) as seosubcategoryname,
        (select c.seo_name from delomart_category c where c.id = d.categoryid) as seocategoryname
 from delomart_subservices d where d.subcategoryid = "${subcategoryid}";`
       pool.query(query+query1+query2+query3+query4,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) res.render('product_show',{result:result,name:subservices_seo_name})
                 else res.send("data not available")
      })
  }
})
    
    }
  })
    }
})

})






router.get('/delo-mart-:category/:subcategory/:subservices/IN/India/Business-Type/:businesstype',(req,res)=>{
console.log('first')
pool.query(`select id from delomart_subcategory where seo_name = "${req.params.subcategory}"`,(err,result)=>{
  if(err) throw err;
  else {
    console.log('second', result[0].id)
    let subcategoryid = result[0].id

  pool.query(`select id,seo_name from delomart_subservices where seo_name = "${req.params.subservices}"`,(err,result)=>{
    if(err) throw err;
    else{
      console.log('third')
     let subservices_seo_name = result[0].seo_name
     let subservices_id = result[0].id
  let query = `select p.*,c.name as companyname , c.address as companyaddress , ci.name as cityname , l.name as localityname , b.name as brandname
       from delomart_product p
       left join mart_user c on p.number = c.number
       left join city ci on c.cityid = ci.id
       left join locality l on c.localityid = l.id
       left join delomart_brand b on p.brand = b.id  where p.business_type = "${req.params.businesstype}" and p.subservicesid = "${subservices_id}";`
        var query1 = `select * from delomart_subservices order by name;`
        var query2 = `select * from city order by name;`
        var query3 = `select * from delomart_brand where subservicesid = "${subservices_id}";`
        var query4 = `select d.*,  
        (select s.seo_name from delomart_subcategory s where s.id = d.subcategoryid) as seosubcategoryname,
        (select c.seo_name from delomart_category c where c.id = d.categoryid) as seocategoryname
 from delomart_subservices d where d.subcategoryid = "${subcategoryid}";`
       pool.query(query+query1+query2+query3+query4,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) res.render('product_show',{result:result,name:subservices_seo_name})
                 else res.send("data not available")
      })
  

    
    }
  })
    }
})

})










router.get('/delo-mart/user/:name/:id/IN/India/Product/Full-Details',(req,res)=>{
  console.log("id",req.params.id)
  pool.query(`select subservicesid , number from delomart_product where id = "${req.params.id}"`,(err,result)=>{
    if(err) throw err;
    else {

var query = `select * from delomart_product where id="${req.params.id}";`
var query1 = `select m.* , 
(select c.name from city c where c.id = m.cityid) as cityname,
(select l.name from locality  l where l.id = m.localityid) as localityname,
(select ca.seo_name from delomart_category ca where ca.id = m.categoryid) as seocategoryname,
(select sub.seo_name from delomart_subcategory sub  where sub.id = m.subcategoryid) as seosubcategoryname
from mart_user m where m.number = "${result[0].number}";`
var query2 = `select * from delomart_product  where subservicesid = "${result[0].subservicesid}" limit 5;`
var query3 = `select * from delomart_subservices order by name;`
pool.query(query+query1+query2+query3,(err,result)=>{
  if(err) throw err;
  else res.render('single_product_show',{result:result})
})
    }
  })
  // res.render('single_product_show')
})






router.get('/delhi-ncr/all-category',(req,res)=>{
  pool.query(`select * from category where status!='approved' `,(err,result)=>{
    err ? console.log(err) : res.render('allcategory',{result:result})
  })
})




router.get('/delo-mart/user/:name/:id/IN/India/Product/Send/Enquiry/Details',(req,res)=>{
pool.query(`select number from delomart_product where id="${req.params.id}"`,(err,result)=>{
    if(err) throw err;
    else{
      res.render('send_enquiry',{result:result[0].number})
    }
  })


})





//Searching


router.get('/Delo-Mart-:category/:subcategory/Search-Query/India/Best/Product/With/Best/Price/In/All/Over/The/World/Just/One/Click',(req,res)=>{



pool.query(`select id from delomart_subcategory where seo_name = "${req.params.subcategory}"`,(err,result)=>{
  if(err) throw err;
  else {
    let subcategoryid = result[0].id

  pool.query(`select id , seo_name from delomart_subservices where name = "${req.query.name}"`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
 let subservices_seo_name = result[0].seo_name
      console.log('subservicesid',result[0].id)
      let query = `select p.*,c.name as companyname , c.address as companyaddress , ci.name as cityname , l.name as localityname , b.name as brandname
       from delomart_product p
       left join mart_user c on p.number = c.number
       left join city ci on c.cityid = ci.id
       left join locality l on c.localityid = l.id
       left join delomart_brand b on p.brand = b.id  where p.subservicesid = "${result[0].id}";`
        var query1 = `select * from delomart_subservices order by name;`
        var query2 = `select * from city order by name;`
        var query3 = `select * from delomart_brand where subservicesid = "${result[0].id}";`
        var query4 = `select d.*,  
        (select s.seo_name from delomart_subcategory s where s.id = d.subcategoryid) as seosubcategoryname,
        (select c.seo_name from delomart_category c where c.id = d.categoryid) as seocategoryname
 from delomart_subservices d where d.subcategoryid = "${subcategoryid}";`
       pool.query(query+query1+query2+query3+query4,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) res.render('product_show',{result:result,name:subservices_seo_name})
                else res.send("data not available")
      })
    }
    else{
  res.render('not_search',{msg:'Tell us what are you looking for?',search:''})
    }
  })
    }
})




})






router.post('/searchhai',(req,res)=>{
  let body= req.body
  req.session.search = req.body.search
  req.session.citysearch = req.body.city
  console.log("data search krna h",body)



  pool.query(`select * from dial_category where name = "${req.body.search}"`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
           
   let categoryid = result[0].id

   pool.query(`select * from listing where categoryid = "${categoryid}"`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
     
      //listing with category 

res.redirect('/free-listing/search')
    }

// Data Not Available in Delo Listing

    else{
        res.render('not_search',{msg:'Tell us what are you looking for?',search:req.session.search})
    }
   })

    }
    // Data Available in Delo Mart
    else{
    pool.query(`select * from delomart_subservices where name = "${req.body.search}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0]){
let subservicesid = result[0].id
pool.query(`select * from delomart_product where subservicesid = "${subservicesid}"`,(err,result)=>{
  if(err) throw err;
  else if(result[0]){


//listing_with_mart

    res.redirect('mart_category/search')
  }

//Data Not Available in Delo Mart

  else{
   res.redirect('/searching-keyboard')
  }
})
      }
      // Data Avaialble In Delo Services
      else{
 pool.query(`select id from subcategory where name = "${req.body.search}"`,(err,result)=>{
       if(err) throw err;
       else if(result[0]){
        let subcategoryid = result[0].id
       res.redirect('/category/search')

       }
       else{
        pool.query(`select id from category where name = "${req.body.search}"`,(err,result)=>{
          if(err) throw err;
          else if(result[0]){
 res.redirect('/category/search')
       }
       // Data Available Only in Lsiting
       else{
        
 var query = `select * from listing where name like "${req.body.search}%"`
 pool.query(query,(err,result)=>{
  if(err) throw err;
  else if(result[0]){

  res.redirect('/searching-keyboard')
  }
  // Finally Data Not Found
  else{
     
    var query1 = `select * from delomart_product where name like "${req.body.search}%";`
    pool.query(query1,(err,result)=>{
      if(err) throw err;
      else if(result[0]){
     res.redirect('/searching-keyboard')
      }
      else{
    res.redirect('/searching-keyboard')
      }
    })


  }
 }) 
       }
          
        })
       }         
 })
      }

    })
    }
  })
})







//listing_with_category






router.get('/searching-keyboard',(req,res)=>{
    res.render('not_search',{msg:'Tell us what are you looking for?',search:req.session.search})
})




router.get('/commingSoon',(req,res)=>{
  res.render('cooming-soon')
})


module.exports = router;