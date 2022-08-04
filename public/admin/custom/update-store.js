$(document).ready(function () {
  $('#contact').hide();
  $('#open_hr').hide();
  $('#close_hr').hide();
  // console.log(storeObj);

  // $("#sel_tag").empty().trigger("change");

  var nearbyID = $('#nearby').find(":selected").text();
  // console.log(nearbyID);
  $('select#nearby').on('change', function () {
    // alert(this.value);
    if (this.value == 1) {
      $("#sel_tag").empty();
      $('#contact').show();
      $('#open_hr').show();
      $('#close_hr').show();
      $('#upcoming_events').hide();
      $('#image_gallery').hide();
      $('#type').hide();
      $.ajax({
        url: '/admin/store/nearby/tag',
        type: 'get',
        dataType: 'json',
        success: function (response) {
          console.log(response);
          // return;
          var len = response.data.length;
          for (var i = 0; i < len; i++) {
            var id = response.data[i]['_id'];
            var name = response.data[i]['name'];

            $("#sel_tag").append("<option value='" + id + "'>" + name + "</option>");
          }
          $("#sel_tag").select2("refresh");
        }
      });
    } else if (this.value == 0) {
      $("#sel_tag").empty();
      $('#contact').hide();
      $('#open_hr').hide();
      $('#close_hr').hide();
      $('#upcoming_events').show();
      $('#image_gallery').show();
      $('#type').show();
      $.ajax({
        url: '/admin/store/not/nearby/tag',
        type: 'get',
        dataType: 'json',
        success: function (response) {
          // console.log(response);
          // return;
          var len = response.data.length;
          for (var i = 0; i < len; i++) {
            var id = response.data[i]['_id'];
            var name = response.data[i]['name'];

            $("#sel_tag").append("<option value='" + id + "'>" + name + "</option>");
          }
          // $("#sel_tag").select2("refresh");
        }
      });
    }
  });
});