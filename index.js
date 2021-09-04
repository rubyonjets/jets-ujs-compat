// It handles the delete action in an unobstrusive way and with API Gatewway compatibility.

(function() {
  function handleAll(e) {
    var target = $(e.target);
    if (target.is('a') && target.data("method") == "delete") {
      stopAll(e);
      return handleDelete(e);
    } else {
      return true;
    }
  }

  function handleDelete(e) {
    var link = $(e.target);
    var message = link.data("confirm");
    if (message) {
      var sure = confirm(message);
      if (sure) {
        deleteItem(link);
      }
    }
  }

  function deleteItem(link) {
    var resource = link.attr("href");
    var token = $('meta[name=csrf-token]').attr('content');
    var data = { authenticity_token: token };
    var request = $.ajax({
      url: resource,
      method: "DELETE",
      data: data,
      dataType: "json"
    });

    request.done(function(msg) {
      var location = add_stage(msg.location);
      window.location = location;
    });
  }

  function add_stage(url) {
    var host = window.location.host;
    // only add stage if on lambda, not on cloud9, and url starts with /
    if (host.match(/\.amazonaws\.com/) && !host.match(/\.cloud9\./) && url[0] == '/') {
      var stage = window.location.pathname.split('/')[1];
      return "/" + stage + url;
    } else {
      return url;
    }
  }

  function stopAll(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  var Jets = {};

  Jets.start = function() {
    $(function() {
      var linkClickSelector = 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]';
      $(linkClickSelector).click(handleAll);
    });
  }

  module.exports = Jets;
}).call(this);

