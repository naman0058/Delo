
start()



    $.getJSON(`/category/all-lisiting`, data => {
    categories = data
    fillDropDown('categoryid', data, 'Choose Category', 0)
  
})


  $.getJSON(`/category/dial_subcategory`, data => {
      subcategories = data
    fillDropDown('subcategoryid', [], 'Choose Subcategoy', 0)
})


    $.getJSON(`/category/dial_subservices`, data => {
      subservices = data
    fillDropDown('subservicesid', [], 'Choose Model / Brand / Product / Services', 0)
})




$('#categoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#categoryid').val())
    fillDropDown('subcategoryid', filteredData, 'Choose Sub Category', 0)
})


$('#subcategoryid').change(() => {
    const filteredData = subservices.filter(item => item.subcategoryid == $('#subcategoryid').val())
    fillDropDown('subservicesid', filteredData, 'Choose Model / Brand / Product / Services', 0)
})


$.getJSON(`/category/city`, data => {
    cities = data
    fillDropDown('getcityid', data, 'Choose City of Services', 0)
  
})


    $.getJSON(`/category/locality`, data => {
      localities = data
    fillDropDown('localityid', [], 'Choose Locality of Services', 0)
  
})

$('#getcityid').change(() => {
    const filteredData = localities.filter(item => item.cityid == $('#getcityid').val())
    fillDropDown('localityid', filteredData, 'Choose Locality of Services', 0)
})



function fillDropDown(id, data, label, selectedid = 0) {
    $(`#${id}`).empty()
    $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
        if (item.id == selectedid) {
            $(`#${id}`).append($('<option selected>').val(item.id).text(item.name))
        } else {
            $(`#${id}`).append($('<option>').val(item.id).text(item.name))
        }
    })
}



$('#show').click(function(){
$.getJSON(`/free-listing/all`, data => {
    console.log(data)
    listings = data
    makeTable(data)
})

})


function makeTable(services){
    let table = ` <div class="row">
    <div class="col-xl-12">
    <!-- Sorting -->
    <div class="form-group row d-flex align-items-center mb-5">
                                                         
    <div class="col-lg-12">
    <button type="button" id="back" class="btn btn-outline-secondary">BacK</button>
      </div>
</div>
        <div class="widget has-shadow">
       
    
       
            <div class="widget-body">
                <div class="table-responsive">
                    <table id="sorting-table" class="table mb-0">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Subcategory Name</th>
                                <th>Subservices Name</th>
                                <th>Username</th>
                                <th>Mobile Number</th>
                              <th><span style="width:100px;">Banner Image</span></th>
                              <th>Edit Banner Image</th>
                              <th>Edit Image</th>
                                <th>Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>`
                        $.each(services,(i,item)=>{

                      
                         table+=`<tr>
                         <td><span class="text-primary">${item.categoryname}</span></td>
                                <td><span class="text-primary">${item.subcategoryname}</span></td>
                                <td><span class="text-primary">${item.subservicesname}</span></td>
                               <td><span class="text-primary">${item.name}</span></td>
                               <td><span class="text-primary">${item.number}</span></td>
                                <td><img src="/images/${item.banner_image}" class="img img-circle" style="width:25px"></td>
                                <td> <button class=" btn btn-outline-success updateimage" id="${item.id}">Edit Banner Image</button></td>
                                 <td> <button class=" btn btn-outline-success updateimage1" id="${item.id}">Edit Image</button></td>
                               <td class="td-actions">
                                    <a class="edits" id="${item.id}"><i class="la la-edit edit"></i></a>
                                    <a class="deleted" id="${item.id}"><i class="la la-close delete"></i></a>
                                </td>
                            </tr>`
                          
                        })
                          
                     table+=` </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- End Sorting -->
      
    </div>
</div>
<!-- End Row -->`
    $('#result').html(table)
    $('#insertdiv').hide()
    $('#result').show()
}



$('#result').on('click', '.deleted', function () {
    const id = $(this).attr('id')
    $.get(`/free-listing/delete`, { id }, data => {
        refresh()
    })
})





$('#pcategoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#pcategoryid').val())
    fillDropDown('psubcategoryid', filteredData, 'Choose Sub-Category', 0)
})


$('#psubcategoryid').change(() => {
    const filteredData = subservices.filter(item => item.subcategoryid == $('#psubcategoryid').val())
    fillDropDown('psubservicesid', filteredData, 'Choose Model / Brand / Product', 0)
})



$('#result').on('click', '.edits', function () {
    
    const id = $(this).attr('id')
    const result = listings.find(item => item.id == id);


console.log("result re",result);

    fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
    $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
     $('#psubservicesid').append($('<option>').val(result.subservicesid).text(result.subservicesname))
      $('#pcityid').append($('<option>').val(result.cityid).text(result.cityname))
       $('#plocalityid').append($('<option>').val(result.localityid).text(result.localityname))
     

    edit()
    $('#pid').val(result.id)
    $('#ppan_number').val(result.pan_number)
    $('#pgst_number').val(result.gst_number)
    $('#plandmark').val(result.landmark)
    $('#pwebsite').val(result.website)
    $('#pyoutube').val(result.youtube);
    $('#pyear').val(result.establishment_year);
    $('#pfacebook').val(result.facebook);
    $('#pdescription').val(result.description);
    // $('#paddress2').val(result.address2);
    // $('#pcash').val(result.cash);
    // $('#pmaster_card').val(result.master_card);
    // $('#pcredit_card').val(result.credit_card);
    // $('#pvisa_card').val(result.visa_card);
    // $('#pamerican_express_card').val(result.american_express_card);
    //  $('#pupi').val(result.upi);
    // $('#pcheques').val(result.cehques);
    // $('#pmonday').val(result.monday);
    // $('#ptuesday').val(result.tuesday);
    // $('#pwednesday').val(result.wednesday);
    // $('#pthrusday').val(result.thrusday);
    // $('#pfriday').val(result.friday);
    // $('#psaturday').val(result.saturday);
    //  $('#psunday').val(result.sunday);
    // $('#pfeature1').val(result.feature1);
    // $('#pfeature2').val(result.feature2);
    // $('#pfeature3').val(result.feature3);
    // $('#pfeature4').val(result.feature4);
    // $('#pfeature5').val(result.feature5);
    // $('#pfeature6').val(result.feature6);
    // $('#pgst_number').val(result.gst_number);
    // $('#ppan_number').val(result.pan_number);
    // $('#pdescription').val(result.description);
    //  //$('#peid').val(result.id)
    
})







$('#update').click(function () {  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        pan_number: $('#ppan_number').val(),
        gst_number: $('#pgst_number').val(),
        landmark : $('#plandmark').val(),
        website : $('#pwebsite').val(),
        youtube: $('#pyoutube').val(),
        establishment_year:$('#pyear').val(),
        facebook : $('#pfacebook').val(),
        description : $('#pdescription').val(),
        // monday : $('#pmonday').val(),
        // tuesday : $('#ptuesday').val(),
        // wednesday : $('#pwednesday').val(),
        // thrusday : $('#pthrusday').val(),
        // friday : $('#pfriday').val(),
        // saturday : $('#psaturday').val(),
        // sunday:$('#psunday').val(),
        // feature1 : $('#pfeature1').val(),
        // feature2 : $('#pfeature2').val(),
        // feature3 : $('#pfeature3').val(),
        // feature4 : $('#pfeature4').val(),
        // feature5 : $('#pfeature5').val(),
        // feature6 : $('#pfeature6').val(),
        // address2 : $('#paddress2').val(),
        // address1 : $('#paddress1').val(),
        // pan_number : $('#ppan_number').val(),
        // gst_number : $('#pgst_number').val(),
        // description : $('#pdescription').val(),
        // seo_name :  ($('#pname').val().split(' ').join('-')).toLowerCase(),
        // seo_address :  ($('#paddress1').val().split(' ').join('-')).toLowerCase()
    }

    $.post(`/list-your-product/update`, updateobj, function (data) {
      alert("Business Details Updated Successfully...")
    })
})


console.log("run")

function start()
{
$('#editdiv').hide()
$('#back').hide()
$('#insertdiv').show()
$('#updateimagediv').hide()
$('#result').hide()

}
function insert()
{
     $('#insertdiv').show(1000)
    $('#back').show()
    $('#refresh').hide()
    $('#result').hide()
    $('#editdiv').hide()
}
function back()
{
    $('#refresh').show()
    $('#editdiv').hide()
    $('#back').hide()
    $('#insertdiv').hide()
    $('#result').show(1000)
}
function insertdata()
{
    $('#editdiv').hide()
    $('#back').hide()
    $('#insertdiv').hide()
    $('#refresh').show()
    $('#result').show()
    refresh()
}
function edit()
{
    $('#back').show()
    $('#refresh').hide()
    $('#editdiv').show()
    $('#result').hide()
}
function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').hide()
    refresh()
}

$('#new').mouseenter(function () {
    insert()
 })
 
 $('#back').mouseenter(function () {
     back()
 })
 
 function refresh() {
     $.getJSON(`/free-listing/all`, data => {
         makeTable(data)
     })
 }

  //================================Page Functionality=============================//
$('#editdiv').hide()
$('#updateimagediv').hide()
$('#updateimagediv1').hide()

$('#result').on('click', '#back', function() {
    $('#result').hide()
    $('#insertdiv').show()
})

$('#back1').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
    $('#updateimagediv1').hide()

})

$('#back2').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
    $('#updateimagediv1').hide()
})

$('#result').on('click', '.updateimage', function() {
	   const id = $(this).attr('id')
    const result = listings.find(item => item.id == id);
$('#peid').val(result.id)
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})



$('#result').on('click', '.updateimage1', function() {
	   const id = $(this).attr('id')
    const result = listings.find(item => item.id == id);
$('#peid1').val(result.id)
 $('#updateimagediv').hide()
    $('#updateimagediv1').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})




$('.search').click(function(){
    let insertobj = {
        categoryid : $('#categoryid').val(),
        cityid : $('#getcityid').val(),
        pincode : $('#pincode').val(),
        localityid : $('#localityid').val()
    }


$.get('/delo_dial/call-center-dashboard/search',insertobj,data=>{
    console.log(data);
    makeSearchTable(data)
})

})

function makeSearchTable(data){
  let table = ` <div class="row">
    <div class="col-xl-12">
    <!-- Sorting -->
 
        <div class="widget has-shadow">
       
    
       
            <div class="widget-body">
                <div class="table-responsive">
                    <table id="sorting-table" class="table mb-0">
                        <thead>
                            <tr>
                                
                                <th>User Name</th>
                                <th>Mobile Number</th>
                               <th>Address</th>
                           
                               
                            </tr>
                        </thead>
                        <tbody>`
                        $.each(data,(i,item)=>{

                      
                         table+=`<tr>
                         <td><span class="text-primary">${item.name}</span></td>
                                <td><span class="text-primary">${item.number}</span></td>
                                <td><span class="text-primary">${item.address1}</span></td>
                             
                            </tr>`
                          
                        })
                          
                     table+=` </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- End Sorting -->
      
    </div>
</div>`
   $('#result1').html(table)

}



$('.send_message').click(function(){
    if($('#customername').val() == null || $('#customername').val() == "null" ||  $('#customername').val() == [] ||  $('#customername').val() == "")
    alert("Enter Customer Name...")
else if($('#customernumber').val() == null || $('#customernumber').val() == "null" ||  $('#customernumber').val() == [] ||  $('#customernumber').val() == "")
    alert("Enter Customer Number...")
else{
    let insertobj = {
        categoryid : $('#categoryid').val(),
        cityid : $('#getcityid').val(),
        pincode : $('#pincode').val(),
        localityid : $('#localityid').val(),
        customernumber : $('#customernumber').val(),
        customername : $('#customername').val()
    }

$.post('/delo_dial/call-center-dashboard/send_message',insertobj,data=>{
   alert("Message Sent Successfully")
   
})
}

})