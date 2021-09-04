let categories = []
let subcategories = []
let allsubcategories = []

$.getJSON(`mart_subcategory/get_all_category`, data => {
    categories = data
    fillDropDown('categoryid', data, 'Choose Category', 0)
  
})


$.getJSON(`mart_subcategory/get_all_subcategory`, data => {
    subcategories = data
    fillDropDown('subcategoryid', [], 'Choose Subcategory', 0)
  
})





$('#categoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#categoryid').val())
    fillDropDown('subcategoryid', filteredData, 'Choose Subcategory', 0)
})



$('#submit').click(function(){
    if($('#name').val() == null || $('#name').val() == [] || $('#name').val() == "null" || $('#name').val() == "" ) alert('Enter Subcategory Name...');
    else if( $('#categoryid').val() == null || $('#categoryid').val() == [] || $('#categoryid').val() == "" || $('#categoryid').val() == "null") {
        alert("Choose Category Name...")
    }
    else{

  
    let insertobj = {
        name : $('#name').val(),
        categoryid : $('#categoryid').val()
    }
    $.post('/mart_subservices/insert',insertobj,data=>{
        alert('Succesfully inserted')
    })
}
})

$('#show').click(function(){
$.getJSON(`/mart_subservices/all`, data => {
    allsubcategories = data
    console.log("result",allsubcategories)
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
                                <th>Subcategory Name</th>
                                <th>Subservices Name</th>
                                <th>Image</th>
                                <th>Edit Image</th>
                               <th>Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>`
                        $.each(subcategories,(i,item)=>{

                      
                         table+=`<tr>
                         <td><span class="text-primary">${item.categoryname}</span></td>
                         <td><span class="text-primary">${item.subcategoryname}</span></td>
                                <td><span class="text-primary">${item.name}</span></td>
                                <td><img src="/images/${item.image}" style="with:100px;"></td>
       <td> <button class=" btn btn-outline-success updateimage" id="${item.id}">Edit Image</button></td>
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
    $.get(`/mart_subservices/delete`,  { id }, data => {
        refresh()
    })
})

$('#pcategoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#pcategoryid').val())
    fillDropDown('psubcategoryid', filteredData, 'Choose Sub-Category', 0)
})


$('#result').on('click', '.edits', function() {
    alert('hii..')
    const id = $(this).attr('id')
    const result = allsubcategories.find(item => item.id == id);
    console.log('result',result)

     fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
       $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
 
    $('#editdiv').show()
    $('#insertdiv').hide() 
    $('#result').hide()
    $('#pid').val(result.id)
    $('#pcategoryid').val(result.categoryid)
    $('#psubcategoryid').val(result.subcategoryid)

    $('#pname').val(result.name)

 })


 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        categoryid:$('#pcategoryid').val(),
           subcategoryid: $('#psubcategoryid').val(),
        name: $('#pname').val(),
        seo_name :  ($('#pname').val().split(' ').join('-')).toLowerCase()
      
    }

    $.post(`/mart_subservices/update`, updateobj , function(data) {
       update()
    })
})



function refresh() 
{
    $.getJSON(`/mart_subservices/all`, data => makeTable(data))
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
