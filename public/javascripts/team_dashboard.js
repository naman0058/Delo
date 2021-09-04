refresh()
ongoing()
//upcoming()
profile()
history()

function refresh(){
  $.getJSON('/team_dashboard/all',data=>{
    maketable(data);
   
  
  })
}

///////////////////Leads Show////////////////////////////////


function maketable(data){
let table=`  <div class="contact-area">
<div class="container">
    <div class="row">`
    $.each(data,(i,item)=>{
      if(data[0]){
      if(i>1 && i%4==0){
        table+=`
        </div>
         <div class="row">
         <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="contact-list mg-t-30">
                        <div class="contact-win">
                           
                            <div class="conct-sc-ic">`
                            if(item.service_agent == null || item.service_agent =="null" || item.service_agent == "" || item.service_agent == [] ){ 
                              table+=` <button type="button" class="btn btn-danger pick" id="${item.id}" price="${item.price}" usernumber = "${item.usernumber}" bookingid = '${item.booking_id}' date="${item.date}" time="${item.time}">Pick</button>`
                              } else { 
                              
                        table+=`<td><button type="button" class="btn btn-secondary">Already Picked</button></td>` }
                        table+=` </div>
                        </div>
                        <div class="contact-ctn">
							<div class="contact-ad-hd">
              <h2>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h2>
              <p class="ctn-ads">${item.address.charAt(0).toUpperCase() + item.address.slice(1)},${item.pincode}</p>
							</div>
              <b>Services</b> : <p>${item.booking_id}</p>
              <p>Add ON :${item.quantity}
                        </div>
                        <hr>
                        <div class="social-st-list">
                        <div class="social-sn">
                        <p>${item.time}</p>
                   </div>
                   <div class="social-sn">
                      <p>${item.date}</p>
                   </div>
                   <div class="social-sn">
                       <p>Rs.${item.price}</p>
                   </div>
                        </div>
                    </div>
                </div>
        `
      }
      else{
        
      
     table+= `  <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div class="contact-list sm-res-mg-t-30 tb-res-mg-t-30 dk-res-mg-t-30">
                <div class="contact-win">
                   
                    <div class="conct-sc-ic">
                       <button type="button" class="btn btn-danger pick" id="${item.id}" price="${item.price}" usernumber = "${item.usernumber}"  bookingid = '${item.booking_id}' date="${item.date}" time="${item.time}">Pick</button>
                    </div>
                </div>
                <div class="contact-ctn">
      <div class="contact-ad-hd">
        <h2>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h2>
        <p class="ctn-ads">${item.address.charAt(0).toUpperCase() + item.address.slice(1)},${item.pincode}</p>
      </div>
                   <b>Services</b> : <p>${item.booking_id}</p>
                   <b>Add ON</b> : ${item.quantity}
                </div>
                <hr>
                <div class="social-st-list">
                    <div class="social-sn">
                         <p>${item.time}</p>
                    </div>
                    <div class="social-sn">
                       <p>${item.date}</p>
                    </div>
                    <div class="social-sn">
                        <p>Rs.${item.price}</p>
                    </div>
                </div>
            </div>
        </div>`

      }
      }
      else{
        table+=` <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
      <div class="wb-traffic-inner notika-shadow sm-res-mg-t-30 tb-res-mg-t-30">
          <div class="website-traffic-ctn">
              <h2><span class="counter">No Current Leads</span></h2>
              <h2>No Cuurent Leads</h2>
            
          </div>
        
      </div>
  </div>`
      }
    })     

  
        
   table+=` </div>
    
</div>
</div>

`



         
        
$('#leads').html(table)
}    
     
   
   
       $('#leads').on('click', '.pick', function () {
      
     const id = $(this).attr('id');
     const price = $(this).attr('price');
     const bookingid = $(this).attr('bookingid');
     const usernumber = $(this).attr('usernumber');
     const date = $(this).attr('date');
     const time = $(this).attr('time');
     
     $.post('/booking/confirmation',{id,price,usernumber,bookingid,date,time},data=>{
       alert(data)
       refresh()
     })
   })


   ///////////////////////////////Leads Ends///////////////////////////////////////


   /////////////////////////////Ongoing Starts/////////////////////////////////////


function ongoing(){
    $.getJSON('/team_dashboard/ongoing',data=>{
        ongoingtable(data)
    })
}

function ongoingtable(data){
  let table=`
  <div class="notika-status-area">
  <div class="container">
      <div class="row">`
      if(data[0]){
      $.each(data,(i,item)=>{
        table+=`     <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div class="wb-traffic-inner notika-shadow sm-res-mg-t-30 tb-res-mg-t-30">
                  <div class="website-traffic-ctn">
                      <h2><span class="counter">${item.booking_id}</span>&nbsp;&nbsp;${item.time}</h2>
                     <p> <a href="/team_dashboard/single?id=${item.id}"><button type="button" class="btn btn-link">View Info</button></a></p>
                  </div>
                
              </div>
          </div>`
         
      })
    }
    else{
      table+=` <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
      <div class="wb-traffic-inner notika-shadow sm-res-mg-t-30 tb-res-mg-t-30">
          <div class="website-traffic-ctn">
              <h2><span class="counter">No Ongoing Leads</span></h2>
            
          </div>
        
      </div>
  </div>`
    }
         
        
     table+=` </div>
  </div>
</div>`
      $('#ongoing').html(table)
}



/////////////////////////////Ongoing Ends///////////////////////////////////////////


///////////////////////////Upcoming Starts//////////////////////////////////////////

$('#upcoming_div_mobile').click(function(){
  $.getJSON('/team_dashboard/upcoming',data=>{
    upcomingtable(data)
})
})


$('#upcoming_div').click(function(){
  $.getJSON('/team_dashboard/upcoming',data=>{
    upcomingtable(data)
})
})


/*
function upcomingtable(data){
    let table=`Upcoming <div class="container">
    <h2></h2>
    <p></p>
    <p><strong></strong></p>
    <div class="card-columns">`
       $.each(data,(i,item)=>{
      table+=`  <div class="card bg-success">
        <div class="card-body text-center">
              <p class="card-te<xt">${item.booking_id}</p>
          <p class="card-te<xt">${item.name}</p>
          <p class="card-te<xt">${item.address}</p>
          <p class="card-te<xt">${item.date} at ${item.time}</p>
          <p class="card-te<xt">Price : ${item.price}</p>`
        
      table+=`  </div>
      </div>`
    })
     
    table+=`</div>
  </div>`
  
       
       $('#upcoming').html(table)
  
      } */


 
function upcomingtable(data){
  let table=`
  <div class="notika-status-area">
  <div class="container">
      <div class="row">`
      if(data[0]){
      $.each(data,(i,item)=>{
        table+=`       <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
        <div class="wb-traffic-inner notika-shadow sm-res-mg-t-30 tb-res-mg-t-30">
            <div class="website-traffic-ctn">
                <h2><span class="counter">${item.booking_id}</span>&nbsp;&nbsp;${item.time}</h2>
               <p> <a href="/team_dashboard/single?id=${item.id}"><button type="button" class="btn btn-link">View Info</button></a></p>
            </div>
          
        </div>
    </div>`
         
      })
    }
    else{
      table+=` <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
      <div class="wb-traffic-inner notika-shadow sm-res-mg-t-30 tb-res-mg-t-30">
          <div class="website-traffic-ctn">
              <h2><span class="counter">No Upcoming Leads</span></h2>
            
          </div>
        
      </div>
  </div>`
    }
         
        
     table+=` </div>
  </div>
</div>`
      $('#upcoming').html(table)
      $('#ongoing').hide()
      $('#history').hide()
      $('#leads').hide()
      $('#walletdivhere').hide()
}   


///////////////////////////////////////////////////Upcoming Ends///////////////////////////////// 


/////////////////////////////////////////////////Profile Starts//////////////////////////////////

function profile(){
    $.getJSON('/team_dashboard/profile',data=>{
        profiletable(data)
    })
}

function profiletable(data){
    let table=`Profile <div class="container">
    <h2></h2>
    <p></p>
    <p><strong></strong></p>
    <div class="card-columns">`
       $.each(data,(i,item)=>{
      table+=`  <div class="card bg-info">
        <div class="card-body text-center">
        <p class="card-te<xt">Recharge : ${item.recharge_value}</p>
              <p class="card-te<xt">Name : ${item.name}</p>
          <p class="card-te<xt">Email : ${item.email}</p>
          <p class="card-te<xt">Date of Birth : ${item.dob}</p>
          <p class="card-te<xt">Local Address : ${item.local_address}</p>
          <p class="card-te<xt">Permanent Address : ${item.permanent_address}</p>
          <p class="card-te<xt">Image : <img src="/images/${item.image}" style="width:50px;height:50px;"></p>
          <p class="card-te<xt">Mobile Number : ${item.number}</p>`
        
      table+=`  </div>
      </div>`
    })
     
    table+=`</div>
  </div>`
  
       
       $('#profile').html(table)
  
      } 

/////////////////////////////////////////////////////profile ends////////////////////////   




 /////////////////////////////History Starts/////////////////////////////////////


 function history(){
  $.getJSON('/team_dashboard/leads_history',data=>{
  
      historytable(data)
  })
}
/*
function historytable(data){
  let table=`History <div class="container">
  <h2></h2>
  <p></p>
  <p><strong></strong></p>
  <div class="card-columns">`
  if(data[0]){
     $.each(data,(i,item)=>{
    table+=`  <div class="card border-info">
      <div class="card-body text-center">
            <p class="card-te<xt">${item.booking_id}</p>
        <p class="card-te<xt">${item.name}</p>
        <p class="card-te<xt">${item.address}</p>
        <p class="card-te<xt">${item.date} at ${item.time}</p>
        <p class="card-te<xt">Price : ${item.price}</p>`
      
    table+=`  </div>
    </div>`
  })
   
  table+=`</div>
</div>`
  }
  else{
    table+=`  <div class="card border-info">
    <div class="card-body text-center">
          <p class="card-te<xt">No data found</p>
      </div>
  </div>

</div>
</div>`
  }
     
     $('#history').html(table)

     
  }*/

 
function historytable(data){
  let table=`  <div class="contact-area">
  <div class="container">
      <div class="row">`
      $.each(data,(i,item)=>{
        if(data[0]){
        if(i>1 && i%4==0){
          table+=`
          </div>
           <div class="row">
           <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                      <div class="contact-list mg-t-30">
                          <div class="contact-win">
                             
                              <div class="conct-sc-ic">`
                           
                                
                              for(i=1;i<=item.rating;i++){
                                table+=`<img src="https://img.icons8.com/cotton/24/000000/filled-star.png">`
                                   }
                        
                          table+=` </div>
                          </div>
                          <div class="contact-ctn">
                <div class="contact-ad-hd">
                <h2>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h2>
                <p class="ctn-ads">${item.address.charAt(0).toUpperCase() + item.address.slice(1)},${item.pincode}</p>
                </div>
                <b>Services : </b> <p>${item.booking_id}</p>
                          </div>
                          <hr>
                          <div class="social-st-list">
                          <div class="social-sn">
                          <p>${item.time}</p>
                     </div>
                     <div class="social-sn">
                        <p>${item.date}</p>
                     </div>
                     <div class="social-sn">
                         <p>Rs.${item.price}</p>
                     </div>
                          </div>
                      </div>
                  </div>
          `
        }
        else{
          
        
       table+= `  <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <div class="contact-list sm-res-mg-t-30 tb-res-mg-t-30 dk-res-mg-t-30">
                  <div class="contact-win">
                     
                      <div class="conct-sc-ic">`
for(i=1;i<=item.rating;i++){
                     table+=`<img src="https://img.icons8.com/cotton/24/000000/filled-star.png">`
                        }
                     table+=`</div>
                  </div>
                  <div class="contact-ctn">
        <div class="contact-ad-hd">
          <h2>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h2>
          <p class="ctn-ads">${item.address.charAt(0).toUpperCase() + item.address.slice(1)},${item.pincode}</p>
        </div>
        <b>Services : </b>    <p>${item.booking_id}</p>
                  </div>
                  <hr>
                  <div class="social-st-list">
                      <div class="social-sn">
                           <p>${item.time}</p>
                      </div>
                      <div class="social-sn">
                         <p>${item.date}</p>
                      </div>
                      <div class="social-sn">
                          <p>Rs.${item.price}</p>
                      </div>
                  </div>
                  <hr>
                  <div class="social-st-list">
                  <div class="social-sn">
                  <h5>Review</h5>
                       <p>${item.review.charAt(0).toUpperCase() + item.review.slice(1)}</p>
                  </div>
                 
                 
              </div>
              </div>
          </div>`
  
        }
        }
        else{
          table+=` <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
        <div class="wb-traffic-inner notika-shadow sm-res-mg-t-30 tb-res-mg-t-30">
            <div class="website-traffic-ctn">
                <h2><span class="counter">No Data Leads</span></h2>
                <h2>No History</h2>
            </div>
          
        </div>
    </div>`
        }
      })     
  
    
          
     table+=` </div>
      
  </div>
  </div>
  
  `
  
  
  
           
          
  $('#history').html(table)
  }    



/////////////////////////////History Ends///////////////////////////////////////////



////////////////////////////////////////////////////Service Completed Starts///////////////////


$('#ongoing').on('click', '.service_completed', function() {
const id = $(this).attr('id');
const usernumber = $(this).attr('usernumber');
const status = 'Completed'
const review = 'no review'
const rating = '1'
if (confirm("Finally Services Complete ?")){
  $.post('/booking/update',{id,status,usernumber,review,rating},data=>{
    ongoing()
  })

}
})




/////////////////////////////////////////////////////Services Completed Ends////////////////////








/////////////////////////////////////////////////Wallet histroy Starts//////////////////////////


$('#mobile_wallet_div').click(function(){
  $.getJSON('/team_dashboard/wallet_history',data=>{
    makewallet(data)
  })
})



$('#wallet_history').click(function(){
  $.getJSON('/team_dashboard/wallet_history',data=>{
    makewallet(data)
  })
})


function makewallet(data){

  let table=`  <div class="contact-area">
  <div class="container">
      <div class="row">`
      $.each(data,(i,item)=>{
        if(data[0]){
        if(i>1 && i%4==0){
          table+=`
          </div>
           <div class="row">
           <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                      <div class="contact-list mg-t-30">
                          <div class="contact-win">
                             
                              <div class="conct-sc-ic">
                         </div>
                          </div>
                          <div class="contact-ctn">
                <div class="contact-ad-hd">
                <h2>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h2>
                <p class="ctn-ads">${item.address.charAt(0).toUpperCase() + item.address.slice(1)},${item.pincode}</p>
                </div>
               <b>Services : </b> <p>${item.booking_id}</p>
                          </div>
                          <hr>
                          <div class="social-st-list">
                          <div class="social-sn">
                          <p>${item.time}</p>
                     </div>
                     <div class="social-sn">
                        <p>${item.date}</p>
                     </div>
                     <div class="social-sn">
                         <p>Rs.${item.price}</p>
                     </div>
                          </div>
                      </div>
                  </div>
          `
        }
        else{
          
        
       table+= `  <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
              <div class="contact-list sm-res-mg-t-30 tb-res-mg-t-30 dk-res-mg-t-30">
                  <div class="contact-win">
                     
                      <div class="conct-sc-ic">
                      <img src="https://img.icons8.com/material-sharp/24/000000/rupee.png">${item.amount}
                     </div>
                  </div>
                  <div class="contact-ctn">
        <div class="contact-ad-hd">
          <h2>${item.createdOn}</h2>
        
        </div>
                     
                  </div>
                  <hr>
                  <div class="social-st-list">
                     
                  <div class="social-sn">
                  <h5>Credit Recieved</h5>
                       <p>${item.productinfo.charAt(0).toUpperCase() + item.productinfo.slice(1)}</p>
                  </div>
                 
                      
                     
                  </div>
                  <hr>
                  <div class="social-st-list">
                 
                  <div class="social-sn">
                  <h5>Message</h5>
                       <p>${item.mode.charAt(0).toUpperCase() + item.mode.slice(1)}</p>
                  </div>
                 
                 
              </div>
              </div>
          </div>`
  
        }
        }
        else{
          table+=` <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
        <div class="wb-traffic-inner notika-shadow sm-res-mg-t-30 tb-res-mg-t-30">
            <div class="website-traffic-ctn">
                <h2><span class="counter">No Data Leads</span></h2>
                <h2>No History</h2>
            </div>
          
        </div>
    </div>`
        }
      })     
  
    
          
     table+=` </div>
      
  </div>
  </div>
  
  `
  
  
  
           
          
  $('#wallet_history_show').html(table)
  $('#history').hide()
  $('#ongoing').hide()
  $('#upcoming').hide()
  $('#leads').hide()
    $('#walletdivhere').hide()
  
}
