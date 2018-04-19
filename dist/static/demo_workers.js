var i=0;

function timedCount()
{
  for(var i=0;i<1000000000;i++){
    ;
  }
  postMessage(i);

}

timedCount();
