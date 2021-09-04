


$.getJSON('/booking/rating',data=>{
  if(data[0])
    makerating(data)
  
})


function makerating(data){

  
  let rating = `
  <form action ="/booking/updaterating" method="post" id="myForm">
  
  <aside class="profile-card">
  <header>
    <!-- here’s the avatar -->
    <a target="_blank" href="#">
      <img src="http://lorempixel.com/150/150/people/" class="hoverZoomLink">
    </a>

    <h2>
  
   <div class="star-rating">
    <input type="radio" id="5-stars"  name="rating" value="5" />
    <label for="5-stars" class="star">&bigstar;</label>
    <input type="radio" id="4-stars"  name="rating" value="4" />
    <label for="4-stars" class="star">&bigstar;</label>
    <input type="radio" id="3-stars"  name="rating" value="3" />
    <label for="3-stars" class="star">&bigstar;</label>
    <input type="radio" id="2-stars"  name="rating" value="2" />
    <label for="2-stars" class="star">&bigstar;</label> 
    <input type="radio" id="1-star"  name="rating" value="1" />
    <label for="1-star" class="star">&bigstar;</label>
  </div>
          </h2>

  </header>

  <!-- bit of a bio; who are you? -->
  <div class="profile-bio">

     
      <input id="giverating" name="review" class="form-control" type="text" placeholder="Rating..." />
      <input type="hidden" name="id" value = "${data[0].id}">
      <br>
      <button type="button" class="btn btn-success submit" id="${data[0].id}" service_agent = "${data[0].service_agent}">Submit</button>
  
      </div>
      </form>

 
</aside>
`
$('#rating').html(rating)
}


$('#rating').on('click', '.submit', function() {
  
  /*var a = $('.a').val()
  alert(a)*/
      
    $("#myForm").submit(); // Submit the form

   /* const id = $(this).attr('id')
    const service_agent = $(this).attr('service_agent')
    var review = $('#review').val()
    var rating = $('#giverating').val()
    $.post('/booking/updaterating',{id,review,rating},data=>{
        window.location.href = '/booking'
    })*/
})
