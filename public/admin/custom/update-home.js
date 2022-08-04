$(document).ready(function () {

  $("input[name='choose_type_1']").trigger("change");
  if (bannerObj.type == "link") {
    $("#external1").attr('checked', 'checked');
    $('#external_1').show();
    $('#internal_1').hide();
    $('#external_1').val(bannerObj.action);
  } else {
    $("#internal1").attr('checked', 'checked');
    $('#internal_1').show();
    $('#external_1').hide();
    var first = bannerObj.action;
    var second = bannerObj.type;
    var final = `${bannerObj.action}|${bannerObj.type}`;
    console.log(final);
    $('.js-example-basic-single').val(final);
  }

  $("input[name='choose_type_1']").on('change', function (e) {
    var type = $("input[name='choose_type_1']:checked").attr('id');
    if (type == 'internal1') {
      $('#internal_1').show();
      $('#external_1').hide();
    } else if (type == 'external1') {
      $('#external_1').show();
      $('#internal_1').hide();
    }
  });

});