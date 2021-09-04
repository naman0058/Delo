let categories = []
let subcategories = []
let subservices = []
let brand = []

    $.getJSON(`/free-listing/get_mart_category`, data => {
    categories = data
    fillDropDown('categoryid', data, 'Choose Category', 0)
  
})


  $.getJSON(`/free-listing/get_mart_subcategory`, data => {
      subcategories = data
    fillDropDown('subcategoryid', [], 'Choose Subcategoy', 0)
})


    $.getJSON(`/free-listing/get_mart_subservices`, data => {
      subservices = data
    fillDropDown('subservicesid', [], 'Choose Sub Services', 0)
})





$('#categoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#categoryid').val())
    fillDropDown('subcategoryid', filteredData, 'Choose Subcategory', 0)
})


$('#subcategoryid').change(() => {
    const filteredData = subservices.filter(item => item.subcategoryid == $('#subcategoryid').val())
    fillDropDown('subservicesid', filteredData, 'Choose Sub Services', 0)
})



$('#save').click(function(){
    if($('#name').val() == null || $('#name').val() == [] || $('#name').val() == "null" || $('#name').val() == "" ) alert('Enter Brand Name...');
    else if( $('#subservicesid').val() == null || $('#subservicesid').val() == [] || $('#subservicesid').val() == "" || $('#subservicesid').val() == "null") {
        alert("Choose Subservices Name...")
    }
    else{

  
    let insertobj = {
        name : $('#name').val(),
        categoryid : $('#categoryid').val(),
        subcategoryid : $('#subcategoryid').val(),
        subservicesid : $('#subservicesid').val()
    }
    $.post('/mart_brand/insert',insertobj,data=>{
        alert('Succesfully inserted')
    })
}
})

$('#show').click(function(){
$.getJSON(`/mart_brand/all`, data => {
    brand = data
    makeTable(data)
  
})
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



function makeTable(subcategories){
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
                                <th> Name</th>
                                <th>Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>`
                        $.each(subcategories,(i,item)=>{

                      
                         table+=`<tr>
                         <td><span class="text-primary">${item.categoryname}</span></td>
                                <td><span class="text-primary">${item.name}</span></td>
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


$('#result').on('click', '.deleted', function() {
    const id = $(this).attr('id')
    $.get(`/mart_brand/delete`,  { id }, data => {
        refresh()
    })
})

$('#pcategoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#pcategoryid').val())
    fillDropDown('psubcategoryid', filteredData, 'Choose Sub-Category', 0)
})




$('#psubcategoryid').change(() => {
    const filteredData = subservices.filter(item => item.subcategoryid == $('#psubcategoryid').val())
    fillDropDown('psubservicesid', filteredData, 'Choose Subservices', 0)
})




$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = subcategories.find(item => item.id == id);
    fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
       $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
          $('#psubservicesid').append($('<option>').val(result.subservicesid).text(result.subservicesname))
 
    $('#editdiv').show()
    $('#insertdiv').hide() 
    $('#result').hide()
    $('#pid').val(result.id)
    $('#pcategoryid').val(result.categoryid)
    $('#psubcategoryid').val(result.subcategoryid)
      $('#psubservicesid').val(result.subservicesid)
    $('#pname').val(result.name)

 })


 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        categoryid:$('#pcategoryid').val(),
           subcategoryid: $('#psubcategoryid').val(),
            subservicesid : $('#psubservicesid').val(),
        name: $('#pname').val(),
        seo_name :  ($('#pname').val().split(' ').join('-')).toLowerCase()
      
    }

    $.post(`/mart_brand/update`, updateobj , function(data) {
       update()
    })
})



function refresh() 
{
    $.getJSON(`/mart_brand/all`, data => makeTable(data))
}
function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').show() 
    refresh()
    refresh()
}

//================================Page Functionality=============================//
$('#editdiv').hide()
$('#updateimagediv').hide()

$('#result').on('click', '#back', function() {
    $('#result').hide()
    $('#insertdiv').show()
})

$('#back1').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()

})

$('#back2').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
})

$('#result').on('click', '.updateimage', function() {


 const id = $(this).attr('id')
    const result = subcategories.find(item => item.id == id);
    $('#peid').val(result.id)

    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})
