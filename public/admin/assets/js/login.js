"use strict";
var reg;

reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

function login(email, password) {
  var loginEmail = $('#login_email').val();
  var loginPassword = $('#login_password').val();

  if (reg.test(loginEmail) === false && loginEmail !== "") {
    $(".email_msg").text("Invalid Email Address!");
    $('.ld').removeClass('ld-ring ld-spin');
    setTimeout(() => {
      $(".email_msg").text("");
    }, 3000);
    return false;
  }

  if (loginEmail === "" || loginEmail === null && loginPassword === "" || loginPassword === null) {
    $(".email_msg").text("Email can't be blank");
    $(".password_msg").text("Password can't be blank");
    $('.ld').removeClass('ld-ring ld-spin');
    setTimeout(() => {
      $(".email_msg").text("");
      $(".password_msg").text("");
    }, 3000);
    return false;
  }
  if (loginEmail === "" || loginEmail === null) {
    $(".email_msg").text("Email can't be blank");
    $('.ld').removeClass('ld-ring ld-spin');
    setTimeout(() => {
      $(".email_msg").text("");
    }, 3000);
    return false;
  }
  if (loginPassword === "" || loginPassword === null) {
    $(".password_msg").text("Password can't be blank");
    $('.ld').removeClass('ld-ring ld-spin');
    setTimeout(() => {
      $(".password_msg").text("");
    }, 3000);
    return false;
  }
  if (loginEmail.toLowerCase() == email && loginPassword == password) {
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("login_form_reset").reset();
    $(".login_msg").text("Incorrect Email / Password.");
    $('.ld').removeClass('ld-ring ld-spin');
    setTimeout(() => {
      $(".login_msg").text("");
    }, 3000);
    return false;
  }
};

$("button").click(function (e) {
  e.preventDefault();
  $('.ld').addClass('ld-ring ld-spin');
  login("admin@admin.com", "admin@123");
});