let testNumber = 0;
let random = 0;

$(document).ready (function (){

if(testNumber==0)
{
  launchTest();
}

  $('#nextTestButton').click(launchTest);




});

function launchTest()
{
  if(testNumber===10)
  {
    window.open('result.html', '_self');
  }
  else {
    testNumber++;
    document.getElementById("nextTestButton").disabled = true;



    var modelPicture = $("#divModel");
    random = Math.floor(Math.random()*6+1);
    modelPicture.attr("class","model");
    modelPicture.addClass("models_" + random);
console.log("random : " + random);




  }
}
