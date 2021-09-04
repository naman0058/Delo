$(document).ready(function() {
  



  $("#comment_section").hide();

  $("#commentbtn").click(function() {
    $("#comment_section").show();
    $("#commentbtn").hide();
  });

  refresh();

  $(".withoutimage").click(function() {
    if ($("#post").val() == "" || $("#post").val() == []) {
      alert("Please enter post");
    } else {
      let insertobj = {
        post: $("#post").val()
      };
      $.post("/dentist_post/insertwithoutimage", insertobj, function data() {
       
        refresh();
      });
    }
  });

  function refresh() {
    $.getJSON(`dentist_post/all`, data => {
      console.log(data)
      makeTimeline(data);
    });
  }

  function makeTimeline(data) {
    let timeline = `
    <h4 class="mb-xlg">Timeline</h4>

    <div class="timeline timeline-simple mt-xlg mb-md">
      <div class="tm-body">
        <ol class="tm-items">`;
    $.each(data, function(i, item) {
       
      timeline += `<li>
        
          <div class="tm-box">
              <p class="text-muted mb-none">${item.name}</p>`
              if(!item.favourite == null || !item.favourite == "null" || !item.favourite == ""){
           timeline +=`   <i class="fa fa-heart favourite" id= "${item.id}" style = "color:#ff0066;float:right;position:relative;bottom:10px;"></i>`
              }else{
                timeline += `<i class="fa fa-heart-o favourite" id= "${item.id}" style = "float:right;position:relative;bottom:10px;"></i>`
              } 
         timeline += `
              <p>
               ${item.post}`
             
               if( !item.image==[]){

             timeline +=`  <div class="thumbnail-gallery">
               <a class="img-thumbnail lightbox" href="/images/${item.image}" data-plugin-options='{ "type":"image" }'>
                 <img class="img-responsive" width="215" src="/images/${item.image}">
                 <span class="zoom">
                   <i class="fa fa-search"></i>
                 </span>
               </a>
             </div>`
            }
            if(!item.status == null || !item.status == "null" || !item.status == ""){
timeline += `<i class="fa fa-thumbs-up like" id=${item.id} "  style="color:#33ccff;float:right;position:relative;right:45px;bottom:10px"></i>` 
            }else{
          timeline +=` 
        <i class="fa fa-thumbs-up like" id=${item.id} "  style="float:right;position:relative;right:45px;bottom:10px"></i>`
            }
             timeline +=` 
           
              
                 <a href="/dentist_post/comment?id=${item.id} "  class=" btn-xs" style="float:right;position:relative;bottom:15px;" ><i class="fa fa-comment"></i></a>
              </p>
            </div>
          </li>`;
    });
    timeline += `

        </ol>
      </div>
    </div> `    
   
    $("#result").html(timeline);
  }


  $("#result").on("click", ".like", function() {
    const postid = $(this).attr("id");
    const status = "like";
    $(this).toggleClass("likes");
    $.post('/dentist_post/insertlike',{postid,status},function data(){
      refresh()
    })
  })

  
 



  $('.withimage').hide()
   
  $('#file1').change(function(){
   if( $('#file1').val()==[] || $('#file1').val()=="" ){
     $('.withimage').hide()
     $('.withoutimage').show()
     
   }
   else{
     $('.withimage').show()
     $('.withoutimage').hide()
     
   }
  })
    
 $("#result").on("click", ".favourite", function() {
  const postid = $(this).attr("id");
  const favourite = "favourite"
$.post('/dentist_post/favourite',{postid,favourite},function data(){
  refresh()
})

})
  
})


 
