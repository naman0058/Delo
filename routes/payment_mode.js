var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');


router.get('/', (req, res) => {
  if(req.session.usernumber){  
    res.render(`payment_mode`,{msg : '',servicename : req.session.reqbokkingid, price : req.session.previousprice , cancelationprice : req.session.previouscancellationcharge, finalprice : req.session.reqprice , quantity :   req.session.reqquantity, total_price : req.session.total_price , membershipprice : req.session.reqmembershipprice , username : req.session.reqname , email : req.session.reqemail , number : req.session.usernumber , address : req.session.reqaddress , categoryid : req.session.reqcategoryid});
}
  else{
    res.redirect('login')
  }
  
})


router.get('/delete', (req, res) => {
  const { id } = req.query
  pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
      if(err) throw err;
      else res.json(result);
  })
})

module.exports = router;