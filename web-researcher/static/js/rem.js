/**
 * Created by ying on 2017/3/24.
 */
!function(){
  function remCompute(){
    if(document.documentElement.clientWidth>750){
      document.documentElement.style.fontSize = "100px";
    }else{
      document.documentElement.style.fontSize = document.documentElement.clientWidth/7.5 + "px";
    }
  };
  remCompute();
  window.onresize = remCompute;

}();

