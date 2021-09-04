let categories = []
let subcategories = []

$.getJSON(`category/all`, data => {
    categories = data
    fillDropDown('categoryid', data, 'Choose Category', 0)
  
})

$('#show').click(function(){
$.getJSON(`newblog/all`, data => {
    subcategories = data
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
    let table = `<div class="row">
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
                                <th>Heading</th>
                                <th>Description</th>
                                <th>Image</th>
                              <th><span style="width:100px;">Edit Image</span></th>
                                <th>Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>`
                        $.each(subcategories,(i,item)=>{

                      
                         table+=`<tr>
                                <td><span class="text-primary">${item.categoryname}</span></td>
                                <td><span class="text-primary">${item.name}</span></td>
                                <td><span class="text-primary">${item.description}</span></td>
                                <td><img src="/images/${item.image}" class="img img-circle" style="width:25px"></td>

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
    $.get(`newblog/delete`,  { id }, data => {
        refresh()
    })
})



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = subcategories.find(item => item.id == id);
    fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
    $('#editdiv').show()
    $('#insertdiv').hide() 
    $('#result').hide()
    $('#pid').val(result.id)
    $('#pdescription').val(result.description)
    $('#pname').val(result.name)
  
 })

 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        categoryid:$('#pcategoryid').val(),
        description: $('#pdescription').val(),
        name : $('#pname').val()
    }

    $.post(`newblog/update`, updateobj , function(data) {
       update()
    })
})


$('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    const result = subcategories.find(item => item.id == id);
    $('#peid').val(result.id)
})


function refresh() 
{
    $.getJSON(`newblog/all`, data => makeTable(data))
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
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})
