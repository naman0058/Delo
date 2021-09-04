var express = require('express')
var pool = require('./pool')
var router = express.Router()


const Razorpay = require("razorpay");
var instance = new Razorpay({
    key_id: `${process.env.RAZORPAYKEYID}`,
    key_secret: `${process.env.RAZORPAYPAYSEVerKEY}`,
  });

 

  router.get('/',(req,res)=> res.render(`razorpay`));

  router.post('/order',(req,res)=>{

    var options = {
        amount: 50000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture: '0'
      };
      instance.orders.create(options, function(err, order) {
          console.log("error",err)
      console.log(order)
       res.send(order)
      });
 })


 module.exports = router;