let categories = []

$('#show').click(function(){
  
$.getJSON(`category/all`, data => {
    categories = data
    makeTable(data)
    
  
})

})

function makeTable(categories){
      let table = `   <div class="row">
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
                                  <th>Logo</th>
                                  <th>Image</th>
                                <th><span style="width:100px;">Edit Image</span></th>
                                  <th>Actions</th>
                                 
                              </tr>
                          </thead>
                          <tbody>`
                          $.each(categories,(i,item)=>{

                        
                           table+=`<tr>
                                  <td><span class="text-primary">${item.name}</span></td>
                                  <td><img src="/images/${item.logo}" class="img img-circle" style="width:25px"></td>
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
     $.get(`category/delete`,  { id }, data => {
        refresh()
    })
})



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = categories.find(item => item.id == id);
  
    $('#editdiv').show()
    $('#result').hide()
    $('#insertdiv').hide() 
    $('#pid').val(result.id)
     $('#pname').val(result.name)
   
 })



 $('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    const result = categories.find(item => item.id == id);
    $('#peid').val(result.id)
})



 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        name: $('#pname').val(),
        seo_name :  ($('#pname').val().split(' ').join('-')).toLowerCase()
        }

    $.post(`category/update`, updateobj , function(data) {
       update()
    })
})






function refresh() 
{
    $.getJSON(`category/all`, data => makeTable(data))
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


