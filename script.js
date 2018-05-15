var explication = false;

var explicationText = "This website is about looking at visualization method from Visualization ccg2lambda (description in about)."+
" You will pass many test where you will need to guess sentences or elements of the sentences by looking at differents visualization models.";

$(document).ready (function (){

  $('#explicationButton').click(explicationFunction);
  $('#startTestButton').click(startTest)
});

function explicationFunction() {
  var div = document.getElementById("explicationText");
  if(!explication)
  {
    div.textContent = explicationText;
    //    var text = div.textContent;
    explication = true;
  }
  else {
    div.textContent = " ";
    explication = false;
  }
}

  function startTest() {
    var r = confirm("You are going to start the tests, are you sure ?");
  if (r == true) {
      window.open('test.html', '_self');
  } else {
      console.log("You pressed Cancel!");
  }
}
