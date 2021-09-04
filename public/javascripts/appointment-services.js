let categories = []
let subcategories = []

let services = []
start()





$.getJSON(`/appointment-service/appointment-category`, data => {
    categories = data.result
    console.log(data.result)
    fillDropDown('subcategoryid', data.result, 'Choose Category', 0)
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
$.getJSON(`/appointment-service/all`, data => {
    console.log(data)
    services = data
    makeTable(data)
})

})


$('#save').click(function(){
    if($('#name').val()=='' || $('#name').val()==[]) alert('Enter Service Name')
   else if($('#total_price').val()=='' || $('#total_price').val()==[]) alert('Enter Service Charge')
   else if($('#discount').val()=='' || $('#discount').val()==[]) alert('Enter Discount')
   else{
       let insertObj = {
           name : $('#name').val(),
           total_price : $('#total_price').val(),
           discount: $('#discount').val(),
           time : $('#time').val(),
           specification1:$('#specification1').val(),
           specification2:$('#specification2').val(),
           specification3:$('#specification3').val(),
           specification4:$('#specification4').val(),
           specification5:$('#specification5').val(),
           specification6:$('#specification6').val(),
           subcategoryid:$('#subcategoryid').val()
       }
       $.post('/appointment-service/insert',insertObj,data=>{
           alert('Successfully Added')
       })
   }
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
                                <th>Services Name</th>
                                <th>Total Amount</th>
                                <th>Discount</th>
                                <th>Net Amount</th>
                                <th>Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>`
                        $.each(services,(i,item)=>{

                      
                         table+=`<tr>
                         <td><span class="text-primary">${item.categoryname}</span></td>
                                <td><span class="text-primary">${item.name}</span></td>
                                <td><span class="text-primary">${item.total_price}</span></td>
                               <td><span class="text-primary">${item.discount}</span></td>
                               <td><span class="text-primary">${item.price}</span></td>
                                
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
    $.get(`/appointment-service/delete`, { id }, data => {
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

    fillDropDown('psubcategoryid', categories, 'Choose Category', result.subcategoryid)
  //  $('#psubcategoryid').append($('<option>').val(result.subcategoryid).text(result.subcategoryname))
 

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

    $.post(`/appointment-service/update`, updateobj, function (data) {
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
     $.getJSON(`/appointment-service/all`, data => {
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