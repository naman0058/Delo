
  /////////////////////////////////////Cancel Starts/////////////////////////
  $('.cancel').click(function(){

    if (document.getElementById('reason1').checked) {
        reason = document.getElementById('reason1').value;
      }
      else if(document.getElementById('reason2').checked)
{
       reason = document.getElementById('reason2').value;
}
else if(document.getElementById('reason3').checked)
{
       reason = document.getElementById('reason3').value;
}
else if(document.getElementById('reason4').checked)
{
       reason = document.getElementById('reason4').value;
}
else if(document.getElementById('reason5').checked)
{
       reason = document.getElementById('reason5').value;
}
     
    id = $(this).attr('id')
    name = $(this).attr('name')
    email = $(this).attr('email')
    usernumber = $(this).attr('usernumber')
    address = $(this).attr('address')
    booking_id = $(this).attr('booking_id')
    payment_mode = $(this).attr('payment_mode')
    date = $(this).attr('date')
    time = $(this).attr('time')
    booking_date = $(this).attr('booking_date')
    price = $(this).attr('price')
    booking_time = $(this).attr('cancel_time')
        var txt 
    if (confirm("Are you sure You want to cancel it")) {
      
     $.get('/booking/delete',{id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,reason,booking_time},data=>{
        alert('cancelled')
      window.location.href = "/booking"  
      })
      
    } 
  })






  
  /////////////////////////////////////////////Cancel Ends///////////////////////////


  /////////////////////////////////////////Finally Cancel Starts////////////////////

  
  $('.finally_cancel').click(function(){

    if (document.getElementById('reason1').checked) {
        reason = document.getElementById('reason1').value;
      }
      else if(document.getElementById('reason2').checked)
{
       reason = document.getElementById('reason2').value;
}
else if(document.getElementById('reason3').checked)
{
       reason = document.getElementById('reason3').value;
}
else if(document.getElementById('reason4').checked)
{
       reason = document.getElementById('reason4').value;
}
else if(document.getElementById('reason5').checked)
{
       reason = document.getElementById('reason5').value;
}
     
    id = $(this).attr('id')
    name = $(this).attr('name')
    email = $(this).attr('email')
    usernumber = $(this).attr('usernumber')
    address = $(this).attr('address')
    booking_id = $(this).attr('booking_id')
    payment_mode = $(this).attr('payment_mode')
    date = $(this).attr('date')
    time = $(this).attr('time')
    booking_date = $(this).attr('booking_date')
    price = $(this).attr('price')
    booking_time = $(this).attr('cancel_time')
        var txt 
    if (confirm("Are you sure You want to cancel it")) {
      
     $.get('/booking/nocharge',{id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,reason,booking_time},data=>{
        alert('cancelled')
      window.location.href = "/booking"  
      })
      
    } 
  })

  /*
  $('.finally_cancel').click(function(){
    if (document.getElementById('reason1').checked) {
        reason = document.getElementById('reason1').value;
      }
      else if(document.getElementById('reason2').checked)
{
       reason = document.getElementById('reason2').value;
}
else if(document.getElementById('reason3').checked)
{
       reason = document.getElementById('reason3').value;
}
else if(document.getElementById('reason4').checked)
{
       reason = document.getElementById('reason4').value;
}
else if(document.getElementById('reason5').checked)
{
       reason = document.getElementById('reason5').value;
}
    id = $(this).attr('id')
    name = $(this).attr('name')
    email = $(this).attr('email')
    usernumber = $(this).attr('usernumber')
    address = $(this).attr('address')
    booking_id = $(this).attr('booking_id')
    payment_mode = $(this).attr('payment_mode')
    date = $(this).attr('date')
    time = $(this).attr('time')
    booking_date = $(this).attr('booking_date')
    price = $(this).attr('price')
    service_agent = $(this).attr('service_agent')
    status = "cancelled"
    showDays(date,today)
 
     
  })
  
  
  //////////////////////////////////////////////////////Finally Cancel Ends//////////////////////
  

  /////////////////////////check time functions ////////////////////////////////
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

var dt = new Date();
var todaytime = dt.getHours() + ":" + dt.getMinutes();



function showDays(firstDate,secondDate){
 
var startDay = new Date(firstDate);
                  var endDay = new Date(secondDate);
                  var millisecondsPerDay = 1000 * 60 * 60 * 24;

                  var millisBetween = startDay.getTime() - endDay.getTime();
                  var days = millisBetween / millisecondsPerDay;

                  // Round down.
                  if(Math.floor(days)==1){
                    if (confirm("Are you sure You want to cancel it")) {
                    $.get('/booking/nocharge',{id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,service_agent,status,today,reason},data=>{
                        alert('cancelled')
                        window.location.href = "/booking"  
                    })
                    //alert('no charge')  Means abhi time h no cancellation charge
                  }
                }
                  else{
                    var timeStart = new Date("01/01/2007 " + time).getHours();
                    var timeEnd = new Date("01/01/2007 " + todaytime).getHours();
                    var hourDiff = timeEnd - timeStart;
                      //means check hour 
                  if(hourDiff==1){
                    var timeStart = new Date("01/01/2007 " + time).getMinutes();
                    var timeEnd = new Date("01/01/2007 " + todaytime).getMinutes();
                    var minDiff = timeEnd - timeStart;   //means check minutes 
                    alert(minDiff)
                    if(minDiff>0 || minDiff>=-1){
                        if (confirm("Cancellation Charges RS99")) {
                        $.get('/booking/charge',{id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,service_agent,status,today,reason},data=>{
                            alert('cancelled')
                            window.location.href = "/booking"  
                        })
                    }//alert('charge')
                    }
                    else{
                        if (confirm("Are you sure You want to cancel it")) {
                            $.get('/booking/nocharge',{id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,service_agent,status,today,reason},data=>{
                                alert('cancelled')
                                window.location.href = "/booking"  
                            })
                        }// alert('no charge')
                    }
                  }
                  else if(hourDiff==0 || hourDiff>=-1){
                    if (confirm("Cancellation Charges RS99")) {
                    $.get('/booking/charge',{id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,service_agent,status,today,reason},data=>{
                        alert('cancelled')
                        window.location.href = "/booking"  
                    })
                }
                    //alert('charge')
                  }
                  else{
                         
                    if (confirm("Are you sure You want to cancel it")) {
                        $.get('/booking/nocharge',{id,name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,service_agent,status,today,reason},data=>{
                            alert('cancelled')
                            window.location.href = "/booking"  
                        })
                    } // alert('no charge ')
                  }
                }

              }


*/