var apiBase;

var setApiBase = function () {
  apiBase = $('#baseUrl').val();
}

var alertError = function (jqXHR, textStatus) {
  alert(textStatus + " " + jqXHR.responseText)
}

var listAllUsers = function () {
  setApiBase()

  var endpoint = "http://" + apiBase + "/admin/users";

  var panelSource = $("#info-panel-template").html();
  var panelTemplate = Handlebars.compile(panelSource)
  $.ajax({
    dataType: "json",
    url: endpoint,
    success: function (data) {
      $('.flex-container').empty();
      $.each(data, function (_, uinfo) {
        var div = panelTemplate(uinfo)
        $('.flex-container').append(div);
      });
      $('.flex-container').append($("#info-panel-add-button-template").html())
    },
    error: alertError
  });
}

var deleteUser = function (UID) {
  var r = confirm("Do you really want to delete " + UID + "?")
  if (r) _deleteUser(UID);
}

var base64URLencode = function (x) {
  return x.replace(/\+/g, '-').replace(/\//g, '_')
}

var _deleteUser = function (UID) {
  var endpoint = "http://" + apiBase + "/admin/users/" + base64URLencode(UID);
  $.ajax({
    url: endpoint,
    type: 'DELETE',
    success: function () {
      $("#info-panel-" + $.escapeSelector(UID)).remove()
    },
    error: alertError
  })
}

var generateUID = function () {
  var array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  bytes = String.fromCharCode.apply(null, array)
  return btoa(bytes)
}

var showAddUser = function () {
  $(".add-button-panel").replaceWith($("#info-panel-add-user-template").html())
  $("#UIDInput").val(generateUID())
}

var addUser = function () {
  var userinfo = new Object()
  userinfo.UID = $("#UIDInput").val()
  userinfo.SessionsCap = parseInt($('#SessionsCapInput').val())
  userinfo.UpRate = parseInt($('#UpRateInput').val()) * 1048576
  userinfo.DownRate = parseInt($('#DownRateInput').val()) * 1048576
  userinfo.UpCredit = parseInt($('#UpCreditInput').val()) * 1048576
  userinfo.DownCredit = parseInt($('#DownCreditInput').val()) * 1048576
  userinfo.ExpiryTime = parseInt($('#ExpiryTimeInput').val()) * 1048576

  var postVar = new Object()
  postVar.UserInfo = JSON.stringify(userinfo)

  var endpoint = "http://" + apiBase + "/admin/users/" + base64URLencode(userinfo.UID);

  $.ajax({
    url: endpoint,
    type: 'POST',
    data: postVar,
    success: function () {
      listAllUsers()
      $(".add-user-panel").replaceWith($("#info-panel-add-button-template").html())
    },
    error: alertError
  })
}