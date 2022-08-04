$('document').ready(function () {
  var banIdArr = bannObj.banner;
  var favIdArr = bannObj.fav;
  
  $("#ban").val(banIdArr);
  $("#ban").trigger('change');

  $("#fav").val(favIdArr);
  $("#fav").trigger('change');
});