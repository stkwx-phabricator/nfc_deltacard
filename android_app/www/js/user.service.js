var User = function () {
};
/**
 *
 * persistUserInfo
 *
 * @param username
 * @param password
 * @param cb
 */
User.prototype.saveUser = function (userId, username, password, cb) {
  "use strict";
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS userInfo(userId, username, password)');
    tx.executeSql('SELECT * FROM userInfo WHERE username = ?', [username], function (tx, re) {
      if (re.rows.length == 0) {
        tx.executeSql('INSERT INTO userInfo VALUES(?, ?, ?)', [userId, username, password], function (tx, re) {
          console.log('save user info : ' + userId)
          cb(null, username);
        }, function (transaction, error) {
          console.log('save user info with error: ' + JSON.stringify(error))
          cb(error);
        });
      } else {
        tx.executeSql('UPDATE userInfo SET password =? WHERE username = ?', [password, username], function (tx, re) {
        }, function (transaction, error) {
          console.log('updated user info with error: ' + JSON.stringify(error))
          cb(error);
        });
      }
    });
  });
};

User.prototype.readUser = function (cb) {
  "use strict";
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS userInfo(userId, username, password)');
    tx.executeSql('SELECT userId, username, password FROM userInfo', [], function (tx, re) {
      if (re.rows.length > 0) {
        cb(re.rows.item(0));
      } else {
        cb(null)
      }
    });
  });
};

User.prototype.clearUser = function (cb) {
  "use strict";
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS userInfo(userId, username, password)');
    tx.executeSql('DELETE FROM userInfo ', [], function (tx, re) {
      cb();
    }), function (err) {
      console.log('error: ' + JSON.stringify(err))
    };
  });
};

User.prototype.autoLogin = function (callback) {
  if (!checkConnection()) {
    return callback(new Error('No network.'));
  }
  var loader = showLoading('Sign in ...');
  var username = window.localStorage['username'];
  var password = window.localStorage['password'];
  $.ajax({
    type: 'GET',
    url: web_server_delta + 'get-annual-check-account',
    crossDomain: true,
    data: {
      userId: -1
    },
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", make_base_auth(username, password));
    },
    success: function (data, status) {
      loader.hide();
      if (typeof data.userId !== 'undefined') {
        $.mobile.navigate('#product_manager_center');
        callback(null);
      } else {
        myAlert('loginfailed');
        $("#product_manager input[name='login']").val(window.localStorage['username']);
        $("#product_manager input[name='password']").val("");
        window.localStorage['userId'] = null;
        window.localStorage['username'] = null;
        window.localStorage['password'] = null;
        callback(err);
      }
    },
    error: function (jqXHR, status, throwerror) {
      loader.hide();
      myAlert("appError", [throwerror]);
      callback(throwerror);
    }
  });
};

// module.exports = {User};