
start()

let categories = []
let subcategories =[]
let subservices = []
let brand = []


    $.getJSON(`/list-your-product/get_mart_category`, data => {
    categories = data
    fillDropDown('categoryid', data, 'Choose Category', 0)
  
})



    $.getJSON(`/list-your-product/get_brand`, data => {
    brand = data
    fillDropDown('brandid', data, 'Choose Brand', 0)
  
})


  $.getJSON(`/list-your-product/get_mart_subcategory`, data => {
      subcategories = data
    fillDropDown('subcategoryid', [], 'Choose Subcategoy', 0)
})


    $.getJSON(`/list-your-product/get_mart_subservices`, data => {
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
$.getJSON(`/list-your-product/get_mart_product`, data => {
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
                                <th>Product Name</th>
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
    $.get(`/list-your-product/delete_mart_product`, { id }, data => {
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
    fillDropDown('pbrandid', brand, 'Choose Brand', result.brand)
    $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
     $('#psubservicesid').append($('<option>').val(result.subservicesid).text(result.subservicesname))
      $('#pcityid').append($('<option>').val(result.cityid).text(result.cityname))
       $('#plocalityid').append($('<option>').val(result.localityid).text(result.localityname))
     

    edit()
    $('#pid').val(result.id)
    $('#pname').val(result.name)
    $('#psubcategoryid').val(result.subcategoryid)
    $('#psubservicesid').val(result.subcategoryid)
    $('#pbrandid').val(result.brand);
    $('#pusage').val(result.usage);
    $('#pdescription').val(result.description);
    $('#pdetails1').val(result.details1);
    $('#pdetails2').val(result.details2);
    $('#pdetails3').val(result.details3);
    $('#pprice').val(result.price);
    $('#psize').val(result.size);
    $('#pcolor').val(result.color);
    $('#pmodel_no').val(result.model_no);
    $('#ptrademark').val(result.trademark);
    $('#pspecification').val(result.specification);
    $('#pminimum_order').val(result.minimum_order);
    $('#pproduction_capacity').val(result.production_capacity);
    $('#ptransport_package').val(result.transport_package);
    $('#pcondition').val(result.condition);
    $('#pmade_in').val(result.made_in);








    $('#ppower').val(result.power);
    $('#pwarranty').val(result.warranty);
    $('#pingredients').val(result.ingredients);
    $('#pquantity_per_case').val(result.quantity_per_case);
    $('#ppackaging_size').val(result.packaging_size);
    $('#ppackaging_type').val(result.packaging_type);
    $('#pstorage_instructions').val(result.storage_instructions);
    $('#pfob_port').val(result.fob_port);
    $('#pcertifications').val(result.certifications);
    $('#psample_policy').val(result.sample_policy);


      $('#pemployee').val(result.employee);
    $('#pestablishment').val(result.establishment);
    $('#pannual_turnover').val(result.annual_turnover);
   

     //$('#peid').val(result.id)
    
})







$('#update').click(function () {  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        categoryid: $('#pcategoryid').val(),
        subcategoryid: $('#psubcategoryid').val(),
        subservicesid : $('#psubservicesid').val(),
        name: $('#pname').val(),
        brand:$('#pbrandid').val(),
        usage : $('#pusage').val(),
        description : $('#pdescription').val(),
        details1 : $('#pdetails1').val(),
        details2 : $('#pdetails2').val(),
        details3 : $('#pdetails3').val(),
        color : $('#pcolor').val(),
        price : $('#pprice').val(),
        size : $('#psize').val(),
        model_no : $('#pmodel_no').val(),
        trademark:$('#ptrademark').val(),
        specification : $('#pspecification').val(),
        minimum_order : $('#pminimum_order').val(),
        production_capacity : $('#pproduction_capacity').val(),
        transport_package : $('#ptransport_package').val(),
        condition : $('#pcondition').val(),
        made_in : $('#pmade_in').val(),

power : $('#ppower').val(),
        ingredients : $('#pingredients').val(),
        warranty : $('#pwarranty').val(),
        quantity_per_case : $('#pquantity_per_case').val(),
        packaging_type : $('#ppackaging_type').val(),
        packaging_size : $('#ppackaging_size').val(),
        storage_instructions : $('#pstorage_instructions').val(),
        certifications : $('#pcertifications').val(),
        sample_policy:$('#psample_policy').val(),
        employee : $('#pemployee').val(),
        establishment : $('#pestablishment').val(),
        annual_turnover : $('#pannual_turnover').val(),
       
        seo_name :  ($('#pname').val().split(' ').join('-')).toLowerCase()
    }

    $.post(`/list-your-product/update_mart_product`, updateobj, function (data) {
      update()
    })
})
































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
     $.getJSON(`/list-your-product/get_mart_product`, data => {
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


