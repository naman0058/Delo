
var express = require('express');
var router = express.Router();
var pool = require('./pool')

var msg91=require('msg91-sms');
var authkey='300563AFuzfOZn9ESb5db12f8f';
var number='9716460730';
var message='hii';
var senderid='smsind';
var route='4';
var dialcode='91';
const { Expo } = require('expo-server-sdk')







var today = new Date();
var newdate = new Date();
    newdate.setDate(today.getDate()+30);

    var dt = new Date();
    var todaytime = dt.getHours() + ":" + dt.getMinutes();


var dd = today.getDate();

var futuretime = today.getHours()+2 + ":" + today.getMinutes();


var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
var a = newdate.getDate()
var b = newdate.getMonth()+1;
if(dd<10) 
{
    dd='0'+dd;
  
} 

if(a<10){
  a='0'+a;
}


if(mm<10) 
{
    mm='0'+mm;
} 


if(b<10) 
{
    b='0'+b;
} 
today = yyyy+'-'+mm+'-'+dd;






router.post("/send",(req,res)=>{
  let body = req.body
  body['date'] = today;
  body['time'] = todaytime;
    console.log(req.body)
    msg91.sendOne(authkey,req.body.number,req.body.message,senderid,route,dialcode,function(response){
console.log(response)
      res.send(response)

        //Returns Message ID, If Sent Successfully or the appropriate Error Message
      
         
        })
         
})








router.post("/dowanload_app",(req,res)=>{
  let body = req.body
  body['date'] = today;
  body['time'] = todaytime;
  body['message'] = 'Welcome to Delo Services.Dowanload the app and get Rs. 1800 cashback. Download the app now : https://tinyurl.com/Deloservices'
    console.log(req.body)
    msg91.sendOne(authkey,req.body.number,req.body.message,senderid,route,dialcode,function(response){

pool.query(`insert into normal_message set ?`, body , (err,result)=>{
  if(err) throw err;
  else res.send(result)
})

        //Returns Message ID, If Sent Successfully or the appropriate Error Message
      
         
        })
         
})









router.post("/updatemessage",(req,res)=>{
  let body = req.body
    console.log(req.body)
    pool.query(`select number from promotional_number`,(err,result)=>{
      if(err) throw err;
      else{
        
        for(i=0;i<result.length;i++){
          console.log(result[i].number)
          msg91.sendOne(authkey,result[i].number,req.body.updatemessage,senderid,route,dialcode,function(response){
 
            //Returns Message ID, If Sent Successfully or the appropriate Error Message
          
             
            })


   pool.query(`insert into promotional_message (number,date,time,updatemessage) values('${result[i].number}' , '${today}' , '${todaytime}' , '${req.body.updatemessage}')`,(err,result)=>{
     
   })

            
          }
            res.send('response');
        
      }
    })
  
})




router.get('/sitemap',(req,res)=>{
  res.render('hidden')
})








router.get('/table',(Req,res)=>{
  var query = `select b.teamprice,b.date , b.service_agent,(select t.name from team t where t.number = b.service_agent) as team_name ,
  (select t.bank_name from team t where t.number = b.service_agent) as bank_name,
  (select t.ifsc_code from team t where t.number = b.service_agent) as ifsc_code,
  (select t.account_number from team t where t.number = b.service_agent) as account_number
  from booking b where b.status = 'completed' and b.payment_mode = 'online' and b.payment is null`
  pool.query(query,(err,result)=>{
    err ? console.log(err) :  res.render('table',{result : result})
  })
 
})



router.post('/update_payment',(req,res)=>{
  let body = req.body
pool.query(`update booking SET payment = 'success'`,(err,result)=>{
  if(err) throw err;
  else res.send('success')
})
})

/*

router.get('/', (req, res) => {

    var query = `select * from blog_category`
    pool.query(query,(err,result)=>{
        if(err) throw err;
        else if(result[0]) res.render('blogs')
        else res.render('not_found')
       })
})*/


router.get('/promotion',(req,res)=>{
    res.render(`promotion`)
})



router.post('/push',(req,res)=>{

let body = req.body;

pool.query(`select * from token where number = '${req.body.number}'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) { res.json('inserted successfully') }
  else{
    pool.query(`insert into token set ? `,body,(err,result)=>{
      if(err) throw err;
   else{
  res.json("inserted successfully") 
  }
})
  }
})

})




// router.post('/push',(req,res)=>{

//   let somePushTokens = []

//     let body = req.body

//     // pool.query(`insert into token set ? `,body,(err,result)=>{
//     //     if(err) throw err;
//     //     else{

//     pool.query(`select * from token`,(err,result)=>{
//       if(err) throw err;
//       else {

//           for(i=0;i<result.length;i++){
// somePushTokens.push(result[i].token)
//           }

       
//     // Create a new Expo SDK client
//     console.log("Push Data",req.body)
// let expo = new Expo();

// // Create the messages that you want to send to clents
// let messages = [];

// somePushTokens.push(req.body.token)
// console.log("Kuch to adbad hai",somePushTokens)
// for (let pushToken of somePushTokens) {
//   // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

//   // Check that all your push tokens appear to be valid Expo push tokens
//   if (!Expo.isExpoPushToken(pushToken)) {
//     console.error(`Push token ${pushToken} is not a valid Expo push token`);
//     continue;
//   }

//   // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
//   messages.push({
//     to: pushToken,
//     sound: 'default',
//     body: 'This is a test notification',
    
//     data: { withSome: 'data' },
//   })
// }

// // The Expo push notification service accepts batches of notifications so
// // that you don't need to send 1000 requests to send 1000 notifications. We
// // recommend you batch your notifications to reduce the number of requests
// // and to compress them (notifications with similar content will get
// // compressed).
// let chunks = expo.chunkPushNotifications(messages);
// let tickets = [];
// (async () => {
//   // Send the chunks to the Expo push notification service. There are
//   // different strategies you could use. A simple one is to send one chunk at a
//   // time, which nicely spreads the load out over time:
//   for (let chunk of chunks) {
//     try {
//       let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//       console.log(ticketChunk);
//       tickets.push(...ticketChunk);
//       // NOTE: If a ticket contains an error code in ticket.details.error, you
//       // must handle it appropriately. The error codes are listed in the Expo
//       // documentation:
//       // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();



// // Later, after the Expo push notification service has delivered the
// // notifications to Apple or Google (usually quickly, but allow the the service
// // up to 30 minutes when under load), a "receipt" for each notification is
// // created. The receipts will be available for at least a day; stale receipts
// // are deleted.
// //
// // The ID of each receipt is sent back in the response "ticket" for each
// // notification. In summary, sending a notification produces a ticket, which
// // contains a receipt ID you later use to get the receipt.
// //
// // The receipts may contain error codes to which you must respond. In
// // particular, Apple or Google may block apps that continue to send
// // notifications to devices that have blocked notifications or have uninstalled
// // your app. Expo does not control this policy and sends back the feedback from
// // Apple and Google so you can handle it appropriately.
// let receiptIds = [];
// for (let ticket of tickets) {
//   // NOTE: Not all tickets have IDs; for example, tickets for notifications
//   // that could not be enqueued will have error information and no receipt ID.
//   if (ticket.id) {
//     receiptIds.push(ticket.id);
//   }
// }

// let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
// (async () => {
//   // Like sending notifications, there are different strategies you could use
//   // to retrieve batches of receipts from the Expo service.
//   for (let chunk of receiptIdChunks) {
//     try {
//       let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//       console.log(receipts);

//       // The receipts specify whether Apple or Google successfully received the
//       // notification and information about an error, if one occurred.
//       for (let receipt of receipts) {
//         if (receipt.status === 'ok') {
//           continue;
//         } else if (receipt.status === 'error') {
//           console.error(`There was an error sending a notification: ${receipt.message}`);
//           if (receipt.details && receipt.details.error) {
//             // The error codes are listed in the Expo documentation:
//             // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
//             // You must handle the errors appropriately.
//             console.error(`The error code is ${receipt.details.error}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();
// }
// })
// // }
// // })
// })


// router.get('/getcount',(req,res)=>{
//     msg91.getBalance("1", function(err, msgCount){
//         console.log(err);
//        res.json(msgCount);
//     });
// })



router.get('/dc',(req,res)=>{
    res.send('s')
})



router.get('/',(req,res)=>{
  res.render('blogs')
})


 
router.get('/face',(req,res)=>{
  res.render('face')
})

module.exports = router;