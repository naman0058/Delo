let categories = []
let subcategories = []

let services = []
start()





$.getJSON(`/category/all`, data => {
    categories = data
    fillDropDown('categoryid', data, 'Choose Category', 0)
})

$.getJSON(`/subcategory/all`, data => {
    subcategories = data
    fillDropDown('subcategoryid', [], 'Choose Subcategory', 0)
})

$('#categoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#categoryid').val())
    fillDropDown('subcategoryid', filteredData, 'Choose Subcategory', 0)
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
$.getJSON(`/services/all`, data => {
    console.log(data)
    services = data
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
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Services</th>
                                <th>Net Amount</th>
                              <th><span style="width:100px;">Edit Image</span></th>
                              <th>Edit Image</th>
                                <th>Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>`
                        $.each(services,(i,item)=>{

                      
                         table+=`<tr>
                         <td><span class="text-primary">${item.categoryname}</span></td>
                                <td><span class="text-primary">${item.subcategoryname}</span></td>
                                <td><span class="text-primary">${item.name}</span></td>
                               <td><span class="text-primary">${item.price}</span></td>
                                <td><img src="/images/${item.logo}" class="img img-circle" style="width:25px"></td>
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



$('#result').on('click', '.deleted', function () {
    const id = $(this).attr('id')
    $.get(`services/delete`, { id }, data => {
        refresh()
    })
})

let selectedSubcategory = 0


$('#pcategoryid').change(() => {
    const filteredData = subcategories.filter(item => item.categoryid == $('#pcategoryid').val())
    fillDropDown('psubcategoryid', filteredData, 'Choose Sub-Category', 0)
})



$('#result').on('click', '.edits', function () {
    
    const id = $(this).attr('id')
    const result = services.find(item => item.id == id);

    fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
    $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
 

    edit()
    $('#pid').val(result.id)
    $('#pname').val(result.name)
    $('#psubcategoryid').val(result.subcategoryid)
    $('#ptotal_price').val(result.total_price);
    $('#pdiscount').val(result.discount);
    $('#pspecification1').val(result.specification1);
    $('#pspecification2').val(result.specification2);
    $('#pspecification3').val(result.specification3);
    $('#pspecification4').val(result.specification4);
    $('#pspecification5').val(result.specification5);
    $('#pspecification6').val(result.specification6);
    $('#pextra').val(result.extra);
     //$('#peid').val(result.id)
    
})



$('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    const result = services.find(item => item.id == id);
    $('#peid').val(result.id)
})


$('#update').click(function () {  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        categoryid: $('#pcategoryid').val(),
        subcategoryid: $('#psubcategoryid').val(),
        name: $('#pname').val(),
        total_price:$('#ptotal_price').val(),
        discount : $('#pdiscount').val(),
        specification1 : $('#pspecification1').val(),
        specification2 : $('#pspecification2').val(),
        specification3 : $('#pspecification3').val(),
        specification4 : $('#pspecification4').val(),
        specification5 : $('#pspecification5').val(),
        specification6 : $('#pspecification6').val(),
        extra : $('#pextra').val(),
    }

    $.post(`services/update`, updateobj, function (data) {
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
     $.getJSON(`services/all`, data => {
         makeTable(data)
     })
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
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})