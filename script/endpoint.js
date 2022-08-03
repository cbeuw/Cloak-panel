var apiBase;

function setApiBase() {
  apiBase = $('#baseUrl').val();
}

function alertError(jqXHR, textStatus) {
  alert(textStatus + " " + jqXHR.responseText)
}

function listAllUsers() {
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

function deleteUser(UID) {
  var r = confirm("Do you really want to delete " + UID + "?")
  if (r) _deleteUser(UID);
}

function base64URLencode(x) {
  return x.replace(/\+/g, '-').replace(/\//g, '_')
}

function _deleteUser(UID) {
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

function generateUID() {
  var array = new Uint8Array(16)
  window.crypto.getRandomValues(array)
  bytes = String.fromCharCode.apply(null, array)
  return btoa(bytes)
}

function showAddUser() {
  $(".add-button-panel").replaceWith($("#info-panel-add-user-template").html())
  $("#UIDInput").val(generateUID())
}

function addUser() {
  var userinfo = new Object()
  userinfo.UID = $("#UIDInput").val()
  userinfo.SessionsCap = parseInt($('#SessionsCapInput').val())
  userinfo.UpRate = parseInt($('#UpRateInput').val()) * 1048576
  userinfo.DownRate = parseInt($('#DownRateInput').val()) * 1048576
  userinfo.UpCredit = parseInt($('#UpCreditInput').val()) * 1048576
  userinfo.DownCredit = parseInt($('#DownCreditInput').val()) * 1048576
  userinfo.ExpiryTime = parseInt($('#ExpiryTimeInput').val())

  var endpoint = "http://" + apiBase + "/admin/users/" + base64URLencode(userinfo.UID);

  $.ajax({
    url: endpoint,
    type: 'POST',
    data: JSON.stringify(userinfo),
    success: function () {
      listAllUsers()
      $(".add-user-panel").replaceWith($("#info-panel-add-button-template").html())
    },
    error: alertError
  })
}
