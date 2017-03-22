var DataSync = function () {
};

/**
 *
 * Download data to APP from WEBSITE
 *
 * @param cb
 */
DataSync.prototype.download = function (cb) {
  var login = window.localStorage['username'];
  var password = window.localStorage['password'];
  var loader = showLoading('Downloading data...');
  $.ajax({
    type: 'POST',
    url: web_server_equipment + 'get-equipments',
    crossDomain: true,
    data: "start=0&end=100",
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", make_base_auth(login, password));
    },
    success: function (data, status) {
      // loader.hide();
      if (data) {
        saveDataIntoDB(data, cb);
      } else {
        myAlert('noDataFound');
      }
    },
    error: function (jqXHR, status, throwerror) {
      // loader.hide();
      myAlert("appError", [throwerror]);

    }
  });

  function saveDataIntoDB(data, callback) {
    var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
    db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS cardInfor(product,serial,user,prod,start,sav1,sav2,sav3,sav4,sav5,ifFirst,ifDelete,equipmentId)');

      async.every(data, function (item, cb) {
          console.log('equipmentId ' + item.equipmentId + ' serial id: ' + item.lotnumber);
          // var item = data[i];
          tx.executeSql('SELECT * FROM cardInfor WHERE serial = ?', [item.lotnumber], function (tx, re) {
            if (re.rows.length == 0) {
              try {
                tx.executeSql('INSERT INTO cardInfor VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [item.reference,
                    item.lotnumber,
                    item.username,
                    getFullDate(item.manufacturingdate),
                    getFullDate(item.firstcommissioningdate),
                    getFullDate(item.controlDate1),
                    getFullDate(item.controlDate2),
                    getFullDate(item.controlDate3),
                    getFullDate(item.controlDate4),
                    getFullDate(item.controlDate5),
                    1,
                    "0",
                    item.equipmentId
                  ], function (transaction, results) {
                    // resultArray.push(true);
                    cb(null);
                  }, function (transaction, error) {
                    cb(error);
                  });
              } catch (err) {
                console.log(err);
                cb(err);
              }
            } else {
              tx.executeSql('UPDATE cardInfor SET ifDelete="0", '
                + ' product=?,user=?,prod=?,start=?,sav1=?,sav2=?,sav3=?,sav4=?,sav5=? '
                + ' WHERE serial = ?',
                [item.reference,
                  item.username,
                  getFullDate(item.manufacturingdate),
                  getFullDate(item.firstcommissioningdate),
                  getFullDate(item.controlDate1),
                  getFullDate(item.controlDate2),
                  getFullDate(item.controlDate3),
                  getFullDate(item.controlDate4),
                  getFullDate(item.controlDate5),
                  item.lotnumber
                ], function (transaction, results) {
                  // resultArray.push(true);
                  cb(null);
                }, function (transaction, error) {
                  cb(error);
                });
            }
          });
        }, function (err, result) {
          loader.hide();

          if (err || result.length > 0) {
            // myAlert(JSON.stringify(resultArray));
            var error = new Error('Failure during saving data into DB');
            callback(err)
          } else {
            // myAlert('uploadSuccessfully');
            callback(null);
          }
        });
    })
  }

};


/**
 *
 * Upload data from APP to WEBSITE
 *
 * @param cb
 */
DataSync.prototype.upload = function (callback) {
  var loader = showLoading('Uploading data....');
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
  var result = [];
  var liferaywsUser = window.localStorage['username'];
  var liferaywsPassword = window.localStorage['password'];
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS cardInfor(product,serial,user,prod,start,sav1,sav2,sav3,sav4,sav5,ifFirst,ifDelete,equipmentId)');
    tx.executeSql('SELECT * FROM cardInfor ', [], function (tx, re) {
      for (var i = 0; i < re.rows.length; i++) {
        result[i] = {};
        result[i].reference = re.rows.item(i).product;
        result[i].lotnumber = re.rows.item(i).serial;
        result[i].username = re.rows.item(i).user;
        result[i].manufacturingdate = re.rows.item(i).prod;
        result[i].firstcommissioningdate = re.rows.item(i).start;
        result[i].controlDate1 = re.rows.item(i).sav1;
        result[i].controlDate2 = re.rows.item(i).sav2;
        result[i].controlDate3 = re.rows.item(i).sav3;
        result[i].controlDate4 = re.rows.item(i).sav4;
        result[i].controlDate5 = re.rows.item(i).sav5;
        result[i].ifDelete = re.rows.item(i).ifDelete;
        result[i].equipmentId = re.rows.item(i).equipmentId;
        // console.log('equipmentId ' + result[i].equipmentId + ' serial id: ' + result[i].lotnumber)
        // myAlert('equipmentId ' + result[i].equipmentId + ' serial id: ' + result[i].lotnumber);
      }


      var resultArray = [];
      async.every(result, function (item, cb) {
        // myAlert('equipmentId ' + result[j].equipmentId + ' serial id: ' + result[j].lotnumber);
        if (item.equipmentId == null || item.equipmentId == '') {
          var manufactureDate = getDateFromStr(item.manufacturingdate);
          var firstcommissioningdate = getDateFromStr(item.firstcommissioningdate);
          var controlDate1 = getDateFromStr(item.controlDate1);
          var controlDate2 = getDateFromStr(item.controlDate2);
          var controlDate3 = getDateFromStr(item.controlDate3);
          var controlDate4 = getDateFromStr(item.controlDate4);
          var controlDate5 = getDateFromStr(item.controlDate5);

          var parameters = 'reference=' + item.reference +
            '&brand=' + 'DELTAPLUS' +
            '&designation=' + 'DeltaPlus' +
            '&description' +
            '&lotNumber=' + item.lotnumber +
            '&userName=' + item.username +
            '&retailerName=' + 'DELTAPLUS' +
            '&retailerParticulars=' + 'DELTAPLUS China' +
            '&observation' +
            '&manufacturingMonth=' + getMonth(manufactureDate) +
            '&manufacturingDay=' + getDate(manufactureDate) +
            '&manufacturingYear=' + getYear(manufactureDate) +
            '&firstUsageMonth=' + getMonth(firstcommissioningdate) +
            '&firstUsageDay=' + getDate(firstcommissioningdate) +
            '&firstUsageYear=' + getYear(firstcommissioningdate) +
            '&lastcontrolDateMonth=' + 0 +
            '&lastcontrolDateDay=' + 0 +
            '&lastcontrolDateYear=' + 0 +
            '&control1DateMonth=' + getMonth(controlDate1) +
            '&control1DateDay=' + getDate(controlDate1) +
            '&control1DateYear=' + getYear(controlDate1) +
            '&control2DateMonth=' + getMonth(controlDate2) +
            '&control2DateDay=' + getDate(controlDate2) +
            '&control2DateYear=' + getYear(controlDate2) +
            '&control3DateMonth=' + getMonth(controlDate3) +
            '&control3DateDay=' + getDate(controlDate3) +
            '&control3DateYear=' + getYear(controlDate3) +
            '&control4DateMonth=' + getMonth(controlDate4) +
            '&control4DateDay=' + getDate(controlDate4) +
            '&control4DateYear=' + getYear(controlDate4) +
            '&control5DateMonth=' + getMonth(controlDate5) +
            '&control5DateDay=' + getDate(controlDate5) +
            '&control5DateYear=' + getYear(controlDate5);

          $.ajax({
            type: 'POST',
            url: web_server_equipment + "create-equipment",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            dataType: 'json',
            data: parameters,
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", make_base_auth(liferaywsUser, liferaywsPassword));
            },
            success: function (data, status) {
              console.log('created one equipment successfully')
              if (typeof data.equipmentId !== 'undefined') {
                // TODO: Uncaught InvalidStateError: Failed to execute 'executeSql' on 'SQLTransaction': SQL execution is disallowed.
                /*
                 tx.executeSql('UPDATE cardInfor SET equipmentId=? WHERE product=? AND serial=? ',
                 [data.equipmentId,
                 data.reference,
                 data.lotnumber], transactionSuccess, errorHandler);
                 */

                // Workaround for above issue, to re-open db connection
                db.transaction(function (tx) {
                  tx.executeSql('UPDATE cardInfor SET equipmentId=? WHERE product=? AND serial=? ',
                    [data.equipmentId,
                      data.reference,
                      data.lotnumber],
                    function (transaction, results) {
                      // resultArray.push(true);
                      cb(null, true);
                    }, function (transaction, error) {
                      resultArray.push(error);
                      cb(null, false);
                    });
                });

              } else {
                cb(null, false);
              }
            },
            error: function (m1, m2, m3) {
              //myAlert("Error Web Services status " + m2 + " Exception "  + m3);
              // myAlert("appError", [m3]);
              cb(null, false);
            }
          });
        } else {
          var manufactureDate = getDateFromStr(item.manufacturingdate);
          var firstcommissioningdate = getDateFromStr(item.firstcommissioningdate);
          var controlDate1 = getDateFromStr(item.controlDate1);
          var controlDate2 = getDateFromStr(item.controlDate2);
          var controlDate3 = getDateFromStr(item.controlDate3);
          var controlDate4 = getDateFromStr(item.controlDate4);
          var controlDate5 = getDateFromStr(item.controlDate5);
          var deleteFlag = item.ifDelete == 1 ? true : false;

          var parameters = 'equipmentId=' + item.equipmentId +
            '&reference=' + item.reference +
            '&brand=' + 'DELTAPLUS' +
            '&designation=' + 'DeltaPlus' +
            '&description' +
            '&lotNumber=' + item.lotnumber +
            '&userName=' + item.username +
            '&retailerName=' + 'DELTAPLUS' +
            '&retailerParticulars=' + 'DELTAPLUS China' +
            '&observation' +
            '&manufacturingMonth=' + getMonth(manufactureDate) +
            '&manufacturingDay=' + getDate(manufactureDate) +
            '&manufacturingYear=' + getYear(manufactureDate) +
            '&firstUsageMonth=' + getMonth(firstcommissioningdate) +
            '&firstUsageDay=' + getDate(firstcommissioningdate) +
            '&firstUsageYear=' + getYear(firstcommissioningdate) +
            '&lastcontrolDateMonth=' + 0 +
            '&lastcontrolDateDay=' + 0 +
            '&lastcontrolDateYear=' + 0 +
            '&delete=' + deleteFlag.toString() +
            // '&delete=false' +
            '&control1DateMonth=' + getMonth(controlDate1) +
            '&control1DateDay=' + getDate(controlDate1) +
            '&control1DateYear=' + getYear(controlDate1) +
            '&control2DateMonth=' + getMonth(controlDate2) +
            '&control2DateDay=' + getDate(controlDate2) +
            '&control2DateYear=' + getYear(controlDate2) +
            '&control3DateMonth=' + getMonth(controlDate3) +
            '&control3DateDay=' + getDate(controlDate3) +
            '&control3DateYear=' + getYear(controlDate3) +
            '&control4DateMonth=' + getMonth(controlDate4) +
            '&control4DateDay=' + getDate(controlDate4) +
            '&control4DateYear=' + getYear(controlDate4) +
            '&control5DateMonth=' + getMonth(controlDate5) +
            '&control5DateDay=' + getDate(controlDate5) +
            '&control5DateYear=' + getYear(controlDate5);

          $.ajax({
            type: 'POST',
            url: web_server_equipment + "/update-equipment",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            dataType: 'json',
            data: parameters,
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", make_base_auth(liferaywsUser, liferaywsPassword));
            },
            success: function (data, status) {
              // myAlert(JSON.stringify(data) + ' status ' + status);
              if (typeof data.equipmentId !== 'undefined') {
                // myAlert('uploadSuccessfully');
                // resultArray.push(error);
                cb(null, true);
              } else {
                //todo: handle failed equipment creation.
                // myAlert('No success returns');

                resultArray.push(false);
                cb(null, false);
              }
            },
            error: function (m1, m2, m3) {
              // myAlert("Error Web Services status " + m2 + " Exception " + m3);
              // myAlert("appError", [m3]);

              resultArray.push(m3);
              cb(null, false);
            }
          });
        }
      }, function (err, result) {
        loader.hide();
        if (err || resultArray.length > 0) {
          // myAlert(JSON.stringify(resultArray));
          var error = new Error('Failure during sending data into website');
          callback(err)
        } else {
          // myAlert('uploadSuccessfully');
          callback(null);
        }
      });

    });

    /*remove the deleted records after sync from remote server*/
    tx.executeSql('DELETE FROM cardInfor WHERE ifDelete = ?', ["1"], function (tx, re) {
      console.log("delete row count is ", re.rows.length);
    });
  });
};

// module.exports = {User};