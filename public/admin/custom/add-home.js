$(document).ready(function () {

  $('#external_1').hide();

  $("input[name='choose_type_1']").on('change', function (e) {
    var type = $("input[name='choose_type_1']:checked").attr('id');
    // alert(type);
    if (type == 'internal1') {
      $('#internal_1').show();
      $('#external_1').hide();
    } else if (type == 'external1') {
      $('#external_1').show();
      $('#internal_1').hide();
    }
  });

});