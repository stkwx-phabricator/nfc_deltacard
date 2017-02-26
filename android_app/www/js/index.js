//global setting
$.mobile.defaultPageTransition = 'flip';
// AWS Server
//var web_server = "http://52.74.123.208/nfc_deltaweb";
//var web_index = "http://52.74.123.208/nfc_deltaweb/mindex.php";
// Local Host
//var web_server = "http://localhost/nfc_deltaweb";
// var web_index = "https://www.deltaplus.eu/en_US/annual-check-service";
// var web_index = "https://www.deltaplus.eu/en_US";
var web_index = "https://www.deltaplus.eu/verification-antichute";
// Development Environment
//var web_server_delta = "http://172.17.17.140:8080/api/jsonws/deltaplus-deltaweb-annualCheck-portlet.annualcheckuseraccount";
//var web_server_delta = "https://www.deltaplus.eu/api/jsonws/deltaplus-deltaweb-annualCheck-portlet.annualcheckuseraccount";
//Production Environment
var web_server_delta = "https://www.deltaplus.eu/api/jsonws/deltaplus-deltaweb-annualCheck-portlet.annualcheckuseraccount/";
var web_server_equipment = "https://www.deltaplus.eu/api/jsonws/deltaplus-deltaweb-annualCheck-portlet.equipment/";
var liferaywsUserAdmin = "annualcheckserviceadmin";
var liferaywsPasswordAdmin = "annualcheckserviceadmin!789";

// app maintenance flag
var version_maintenance = true;
var version_detail = '1.7.1';

//global varity
var ifTagFound = false,
  ifEmpytyTag = false,
  isRead = true,
  isNfcEnable = false,
  hasViewMyPro = true,
  ifRegisteError = false,
  nfcData = [
    '', //product
    '', //serial
    '', //user
    '', //prod.
    '', //start
    '', //sav1
    '', //sav2
    '', //sav3
    '', //sav4
    '', //sav5
    '0' //if first use 0:new
  ],
  message,
  timeoutId,
  tagId,
  myAlert = function (key, param, callback) {
    var fun = callback ? callback : function () {
      },
      msg = window.i18n[window.localStorage['language']][key];
    if (!msg) {
      msg = key;
    }
    if (param) {
      for (var i in param) {
        if (window.i18n[window.localStorage['language']][param[i]])
          msg = msg.replace("{" + i + "}", window.i18n[window.localStorage['language']][param[i]]);
        else
          msg = msg.replace("{" + i + "}", param[i]);
      }
    }
    navigator.notification.alert(msg, fun, window.i18n[window.localStorage['language']]['alert'], window.i18n[window.localStorage['language']]['ok']);
  },
  myConfirm = function (key, param, callback) {
    var fun = callback ? callback : function () {
      },
      msg = window.i18n[window.localStorage['language']][key];
    if (param) {
      for (var i in param) {
        msg = msg.replace("{" + i + "}", param[i]);
      }
    }
    navigator.notification.confirm(msg, fun, window.i18n[window.localStorage['language']]['confirmMsg'], [window.i18n[window.localStorage['language']]['ok'], window.i18n[window.localStorage['language']]['cancel']]);
  },
  callBackGroup = {
    tagRead: {
      mimeCallBack: function (nfcEvent) {
        var tag = nfcEvent.tag,
          ndefMessage = tag.ndefMessage;
        tagId = nfc.bytesToHexString(tag.id);
        console.log(tagId);
        nfcData = nfc.bytesToString(ndefMessage[0].payload).split('~');
        if (nfcData.length != 11) {
          nfcData = [
            '', //product
            '', //serial
            '', //user
            '', //prod.
            '', //start
            '', //sav1
            '', //sav2
            '', //sav3
            '', //sav4
            '', //sav5
            '0' //if first use 0:new
          ];
          message = [
            ndef.mimeMediaRecord('mime/com.softtek.delta', nfc.stringToBytes(nfcData.join("~"))),
            ndef.uriRecord("http://www.deltaplus.eu")
          ];
          nfc.write(message, function () {

          }, function (error) {
            // todo there is some random error when saving data into card, eg. if you move card during writing process.
            myAlert('appError', error);
          });
          myAlert('dataFomatNotRight', [nfc.bytesToHexString(tag.id)]);
          return;
        }
        clearTimeout(timeoutId);
        scan_next(1, 4);
        if (nfcData[1] === "" || nfcData[1] == null) {
          ifEmpytyTag = true;
        } else {
          ifEmpytyTag = false;
        }
        setTimeout(function () {
          $('.scan_step2 input[name="product"]').val(nfcData[0]);
          $('.scan_step2 input[name="serial"]').val(nfcData[1]);
          $('.scan_step2 input[name="user"]').val(getStringFromCharCode(nfcData[2]));
          $('.scan_step2 input[name="prod"]').val(nfcData[3]);
          $('.scan_step2 input[name="start"]').val(nfcData[4]);
          $('.scan_step2 input[name="sav1"]').val(nfcData[5]);
          $('.scan_step2 input[name="sav2"]').val(nfcData[6]);
          $('.scan_step2 input[name="sav3"]').val(nfcData[7]);
          $('.scan_step2 input[name="sav4"]').val(nfcData[8]);
          $('.scan_step2 input[name="sav5"]').val(nfcData[9]);
          $('.scan_step2 input[name="product"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="serial"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="user"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="prod"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="start"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav1"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav2"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav3"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav4"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav5"]').attr('disabled', 'disabled');
          $(".scan_step2_btn").hide();
          $(".scan_read_btn").show();
          $.mobile.navigate('#scan_read');
          $('#scan_read').attr("class", "basic container");
          showClearReadInput();
        }, 2000);
        mimeCallBack = function () {
        };
        tagCallBack = function () {
        };
      },
      mimeSuccessCallBack: function () {

      },
      tagCallBack: function (nfcEvent) {
        clearTimeout(timeoutId);
        var tag = nfcEvent.tag;
        tagId = nfc.bytesToHexString(tag.id);
        if (!tag.ndefMessage) {
          nfcData = ['', '', '', '', '', '', '', '', '', '', '0'];
          scan_next(1, 4);
          ifEmpytyTag = true;
        }
        ;
        setTimeout(function () {
          $('.scan_step2 input[name="product"]').val(nfcData[0]);
          $('.scan_step2 input[name="serial"]').val(nfcData[1]);
          $('.scan_step2 input[name="user"]').val(getStringFromCharCode(nfcData[2]));
          $('.scan_step2 input[name="prod"]').val(nfcData[3]);
          $('.scan_step2 input[name="start"]').val(nfcData[4]);
          $('.scan_step2 input[name="sav1"]').val(nfcData[5]);
          $('.scan_step2 input[name="sav2"]').val(nfcData[6]);
          $('.scan_step2 input[name="sav3"]').val(nfcData[7]);
          $('.scan_step2 input[name="sav4"]').val(nfcData[8]);
          $('.scan_step2 input[name="sav5"]').val(nfcData[9]);
          $('.scan_step2 input[name="product"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="serial"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="user"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="prod"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="start"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav1"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav2"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav3"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav4"]').attr('disabled', 'disabled');
          $('.scan_step2 input[name="sav5"]').attr('disabled', 'disabled');
          $(".scan_step2_btn").hide();
          $(".scan_read_btn").show();
          $.mobile.navigate('#scan_read');
          showClearReadInput();
        }, 2000);
        mimeCallBack = function () {
        };
        tagCallBack = function () {
        };
      },
      tagSuccessCallBack: function () {

      }
    },
    tagWrite: {
      mimeCallBack: function (nfcEvent) {
        clearTimeout(timeoutId);
        var newTagId = nfc.bytesToHexString(nfcEvent.tag.id);
        if (tagId === newTagId) {
          nfc.write(message, function () {
            scan_next(3, 4);
            writeCardInforToDB();
            hasViewMyPro = false;
          }, function (error) {
            myAlert('appError', [error]);
            $.mobile.navigate('#scan');
          });
          mimeCallBack = function () {
          };
          tagCallBack = function () {
          };
        } else {
          isNfcEnable = false;
          scan_next(3, 3);
          myAlert('useSameIdCard');
        }
      },
      mimeSuccessCallBack: function () {

      },
      tagCallBack: function (nfcEvent) {
        clearTimeout(timeoutId);
        var newTagId = nfc.bytesToHexString(nfcEvent.tag.id);
        if (tagId === newTagId) {
          nfc.write(message, function () {
            scan_next(3, 4);
            writeCardInforToDB();
            hasViewMyPro = false;
          }, function (error) {
            myAlert('appError', [error]);
            $.mobile.navigate('#scan');
          });
          mimeCallBack = function () {
          };
          tagCallBack = function () {
          };
        } else {
          isNfcEnable = false;
          scan_next(3, 3);
          myAlert('useSameIdCard');
        }
      },
      tagSuccessCallBack: function () {

      }
    }
  },
  mimeCallBack = function (nfcEvent) {
    //alert("in mimeCallBack isNfcEnable = " + isNfcEnable + " isRead=" + isRead);
    if (isNfcEnable) {
      if (isRead) {
        callBackGroup.tagRead.mimeCallBack(nfcEvent);
      } else {
        callBackGroup.tagWrite.mimeCallBack(nfcEvent);
      }
      isNfcEnable = false;
    }
  },
  mimeSuccessCallBack = function () {
  },
  tagCallBack = function (nfcEvent) {
    if (isNfcEnable) {
      if (isRead) {
        callBackGroup.tagRead.tagCallBack(nfcEvent);
      } else {
        callBackGroup.tagWrite.tagCallBack(nfcEvent);
      }
      isNfcEnable = false;
    }
  },
  tagSuccessCallBack = function () {
  };
//go to next step in scan phase
function scan_next(stepId, subStepId) {
  'use strict';
  switch (stepId) {
    case 1:
      switch (subStepId) {
        case 1:
          $('.scan_step1_1').hide();
          $('.scan_step1_2').fadeIn();
          break;
        case 2:
          $('.scan_step1_2').hide();
          $('.scan_step1_3').fadeIn();
          break;
        case 3:
          $('.scan_step1_3').hide();
          $('.scan_step1_2').fadeIn();
          break;
        case 4:
          $('.scan_step1_2').hide();
          $('.scan_step1_4').fadeIn();
          break;
      }
      ;
      break;
    case 2:
      $('.scan_step1').hide();
      $('.scan_step1_3').hide();
      $('.scan_step1_4').hide();
      $('.scan_step2').fadeIn();
      break;
    case 3:
      switch (subStepId) {
        case 1:
          $(".scan_step2").hide();
          $(".scan_step3").show();
          $(".scan_step3_1").show();
          break;
        case 2:
          $(".scan_step3_3").hide();
          $(".scan_step3_2").fadeIn();
          break;
        case 3:
          $(".scan_step3_2").hide();
          $(".scan_step3_3").fadeIn();
          break;
        case 4:
          $(".scan_step3_2").hide();
          $(".scan_step3_4").fadeIn();
          break;
        case 5:
          $(".scan_step3_1").hide();
          $(".scan_step3_2").fadeIn();
          break;
      }
      ;
      break;
  }
}
//click to show detail
function showProductDetail(data) {
  $('.myproducts_detail_form input[name="product"]').val(data.product);
  $('.myproducts_detail_form input[name="serial"]').val(data.serial);
  $('.myproducts_detail_form input[name="user"]').val(data.user);
  $('.myproducts_detail_form input[name="prod"]').val(data.prod);
  $('.myproducts_detail_form input[name="start"]').val(data.start);
  $('.myproducts_detail_form input[name="sav1"]').val(data.sav1);
  $('.myproducts_detail_form input[name="sav2"]').val(data.sav2);
  $('.myproducts_detail_form input[name="sav3"]').val(data.sav3);
  $('.myproducts_detail_form input[name="sav4"]').val(data.sav4);
  $('.myproducts_detail_form input[name="sav5"]').val(data.sav5);
  $.mobile.navigate("#myproducts_detail");
}
//refresh local data
function refreshLocalData(cardInforList, ifShowUpdate) {
  var temp = [
      '<tr>',
      '<th width="10%" style="{color}">{id}.</th>',
      '<td width="40%" class="productList_bac">{product}</td>',
      '<td width="40%" class="productList_bac">{serial}</td>',
      '<td width="10%" class="productList_view" id="{serial}"><span class="glyphicon glyphicon-search"></span></td>',
      '</tr>'
    ],
    content = "";
  if (ifShowUpdate) {
    for (var i in cardInforList) {
      if (window.currentUpdatedRecordId === cardInforList[i].serial) {
        content = content + temp.join("").replace("{id}", parseInt(i) + 1).replace("{product}",
            cardInforList[i].product).replace(/{serial}/g, cardInforList[i].serial).replace("{color}", "color:red;");
      } else {
        content = content + temp.join("").replace("{id}", parseInt(i) + 1).replace("{product}",
            cardInforList[i].product).replace(/{serial}/g, cardInforList[i].serial);
      }
    }
  } else {
    for (var i in cardInforList) {
      content = content + temp.join("").replace("{id}", parseInt(i) + 1).replace("{product}",
          cardInforList[i].product).replace(/{serial}/g, cardInforList[i].serial);
    }
  }
  $(".productList tbody").html(content);
  $('.productList .productList_view').on('touchend', function () {
    readCradInforWithId($(this).attr('id'));
  });
  $.mobile.navigate('#myproducts');
}
//registe mime type listener
function registeMimeTypeListener(callback, success) {

  window.localStorage.clear();

  navigator.globalization.getPreferredLanguage(
    function (language) {
      //navigator.notification.alert('language 1: ' + language.value + '\n');
      var lang = language.value.split('-');
      // navigator.notification.alert('language 2: ' + lang[0] + '\n');
      if (lang != null && (lang[0] == 'en' || lang[0] == 'zh' || lang[0] == 'sp' || lang[0] == 'fr')) {
        window.localStorage['language'] = lang[0];
        //      navigator.notification.alert('language 3: ' + window.localStorage['language'] + '\n');
      }


      var language = window.localStorage['language'];
      //  navigator.notification.alert('language 4: ' + window.localStorage['language'] + '\n');

      language = language ? language : 'en';
      window.localStorage['language'] = language;
      //navigator.notification.alert('language 5: ' + window.localStorage['language'] + '\n');
      updateLanguage(language);

    },
    function () {
      window.localStorage['language'] = 'en';
      updateLanguage(language);
      //navigator.notification.alert('Error getting language\n');
    });


  nfc.addMimeTypeListener('mime/com.softtek.delta',
    callback,
    success,
    function (error) { // error callback
      ifRegisteError = true;
      var msg = JSON.stringify(error);
      if (msg === '"NFC_DISABLED"') {
        myAlert('nfcDisabled');
      } else {
        myAlert("initAppFailed", [JSON.stringify(error)]);
      }
    }
  );

}
//registe tag listener
function registeTagListener(callback, success) {
  if (!ifRegisteError) {
    nfc.addTagDiscoveredListener(
      callback,
      success,
      function (error) { // error callback
        // alert("Error adding TAG listener, reason: " + JSON.stringify(error));
        myAlert("appError", [JSON.stringify(error)]);
      }
    );
  }
}
//write database
function writeCardInforToDB(ifAddIdOnly) {
  nfcData[0] = $('.scan_step2 input[name="product"]').val();
  nfcData[1] = $('.scan_step2 input[name="serial"]').val();
  nfcData[2] = $('.scan_step2 input[name="user"]').val();
  nfcData[3] = $('.scan_step2 input[name="prod"]').val();
  nfcData[4] = $('.scan_step2 input[name="start"]').val();
  nfcData[5] = $('.scan_step2 input[name="sav1"]').val();
  nfcData[6] = $('.scan_step2 input[name="sav2"]').val();
  nfcData[7] = $('.scan_step2 input[name="sav3"]').val();
  nfcData[8] = $('.scan_step2 input[name="sav4"]').val();
  nfcData[9] = $('.scan_step2 input[name="sav5"]').val();
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS cardInfor(product,serial,user,prod,start,sav1,sav2,sav3,sav4,sav5,ifFirst,ifDelete,equipmentId)');
    tx.executeSql('SELECT * FROM cardInfor WHERE serial = ?', [nfcData[1]], function (tx, re) {
      if (re.rows.length == 0) {
        tx.executeSql('INSERT INTO cardInfor VALUES(?,?,?,?,?,?,?,?,?,?,?,"0",NULL)', nfcData);
      } else {
        tx.executeSql('UPDATE cardInfor SET product=?,user=?,prod=?,start=?,sav1=?,sav2=?,sav3=?,sav4=?,sav5=?,ifDelete="0" WHERE serial = ?', [nfcData[0], nfcData[2], nfcData[3], nfcData[4], nfcData[5], nfcData[6], nfcData[7], nfcData[8], nfcData[9], nfcData[1]]);
      }
    });
    if (ifAddIdOnly) {
      myAlert('addIdToMyProduct', null, function () {
        readCardInforListFromDB();
      });
    }
  });
}
//read database
function readCardInforListFromDB(ifShowUpdate) {
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024),
    result = [];
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS cardInfor(product,serial,user,prod,start,sav1,sav2,sav3,sav4,sav5,ifFirst,ifDelete,equipmentId)')
    tx.executeSql("SELECT * FROM cardInfor WHERE ifDelete ='0'", [], function (tx, re) {
      for (var i = 0; i < re.rows.length; i++) {
        result[i] = {};
        result[i].product = re.rows.item(i).product;
        result[i].serial = re.rows.item(i).serial;
      }
      refreshLocalData(result, ifShowUpdate);
    });
  });
}
//delete record
function deleteRecordFromDB(serial) {
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('UPDATE cardInfor SET ifDelete = "1" WHERE serial = ?', [serial], function (tx, re) {
      readCardInforListFromDB();
      //$.mobile.back();
    });
  });
}
//read database with id
function readCradInforWithId(id) {
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM cardInfor WHERE serial = ?', [id], function (tx, re) {
      showProductDetail(re.rows.item(0));
    });
  });
}
//update language
function updateLanguage(language) {
  if (window.i18n && window.i18n[language]) {
    for (var key in window.i18n[language]) {
      $('.i_' + key).html(window.i18n[language][key]);
    }
  }
}

function isAlphanumeric(obj) {
  reg = /[A-Za-z0-9/._-]+$/;
  if (!reg.test(obj)) {
    return false;
  }
  return true;
}

function isChinese(obj) {
  //reg=/^[\u4E00-\u9FA5]+$/;   // GBK
  reg = /^[\u3400-\u9FBF]+$/;     //UTF-8
  if (!reg.test(obj)) {
    return false;
  }
  return true;
}

//form validation
function validateForm() {
  var product = $('.scan_step2 input[name="product"]').val().replace(/ $/g, '').replace(/^ /g, ''),
    serial = $('.scan_step2 input[name="serial"]').val().replace(/ $/g, '').replace(/^ /g, ''),
    user = $('.scan_step2 input[name="user"]').val().replace(/ $/g, '').replace(/^ /g, ''),
    start = $('.scan_step2 input[name="start"]').val();

  $('.scan_step2 input[name="product"]').val(product);
  $('.scan_step2 input[name="serial"]').val(serial)
  $('.scan_step2 input[name="user"]').val(user)

  if (product === "") {
    myAlert('productFieldEmpty');
    return false;
  }
  if (product.length > 10) {
    myAlert('productMaxLength');
    $('.scan_step2 input[name="product"]').val("");
    $('.scan_step2 input[name="product"]').focus();
    return false;
  } else if (!isAlphanumeric(product)) {
    myAlert('invalidInput', ['Product']);
    $('.scan_step2 input[name="product"]').val("");
    $('.scan_step2 input[name="product"]').focus();
    return false;
  }
  if (serial === "") {
    myAlert('serialFieldEmpty');
    return false;
  }
  if (serial.length > 12) {
    myAlert('serialMaxLength');
    $('.scan_step2 input[name="serial"]').val("");
    $('.scan_step2 input[name="serial"]').focus();
    return false;
  } else if (!isAlphanumeric(serial)) {
    myAlert('invalidInput', ['ID']);
    $('.scan_step2 input[name="serial"]').val("");
    $('.scan_step2 input[name="serial"]').focus();
    return false;
  }
  if (user.length > 15) {
    myAlert('userMaxLength');
    $('.scan_step2 input[name="user"]').val("");
    $('.scan_step2 input[name="user"]').focus();
    return false;
  }
  if (start == "" && user != "") {
    myAlert('beforeAddFirstUseDate');
    return false;
  }

  if (!isAlphanumeric(user)) {
    if (!isChinese(user)) {
      myAlert('invalidInput', ['User']);
      $('.scan_step2 input[name="user"]').val("");
      $('.scan_step2 input[name="user"]').focus();
      return false;
    } else {
      if (user.length > 3) {
        myAlert('userMaxLength');
        $('.scan_step2 input[name="user"]').val("");
        $('.scan_step2 input[name="user"]').focus();
        return false;
      }
    }
  }


  return true;
}
//for language
function initLanguageSelection() {
  var language = window.localStorage['language'];
  console.log('current lang ' + language);
  language = language ? language : 'en';
  if (language == 'en') {
    $('input[name="changeLang"]:eq(0)')[0].checked = true;
  } else if (language == 'zh') {
    $('input[name="changeLang"]:eq(1)')[0].checked = true;
  } else if (language == 'fr') {
    $('input[name="changeLang"]:eq(2)')[0].checked = true;
  } else if (language == 'sp') {
    $('input[name="changeLang"]:eq(3)')[0].checked = true;
  }
  $('input[name="changeLang"]').checkboxradio("refresh");
}

function changeLanguage() {
  var index = $('input[name="changeLang"]').index($(this)),
    lang = '';
  console.log('language index = ', index);
  if (index == 0) {
    lang = 'en';
  } else if (index == 1) {
    lang = 'zh';
  } else if (index == 2) {
    lang = 'fr';
  } else if (index == 3) {
    lang = 'sp';
  }
  window.localStorage['language'] = lang;
  updateLanguage(lang);
}
//for synchronize

function make_base_auth(user, password) {
  var token = user + ":" + password;
  var hash = btoa(token);
  return "Basic " + hash;
}

function prepareSendingData() {
  var loader = showLoading('Loading'),
    db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024),
    result = [];
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
        console.log('equipmentId ' + result[i].equipmentId + ' serial id: ' + result[i].lotnumber)
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
                // myAlert('No equipment id returned !!!');
                //todo: handle failed equipment creation.
                // resultArray.push(error);
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
        if(err || resultArray.length > 0) {
          myAlert(JSON.stringify(resultArray));
        } else {
          myAlert('uploadSuccessfully');
        }
      });


      /*  for (var j = 0; j < result.length; j++) {
       //if(true) {

       // myAlert('equipmentId ' + result[j].equipmentId + ' serial id: ' + result[j].lotnumber);
       if (result[j].equipmentId == null || result[j].equipmentId == '') {
       var manufactureDate = getDateFromStr(result[j].manufacturingdate);
       var firstcommissioningdate = getDateFromStr(result[j].firstcommissioningdate);
       var controlDate1 = getDateFromStr(result[j].controlDate1);
       var controlDate2 = getDateFromStr(result[j].controlDate2);
       var controlDate3 = getDateFromStr(result[j].controlDate3);
       var controlDate4 = getDateFromStr(result[j].controlDate4);
       var controlDate5 = getDateFromStr(result[j].controlDate5);

       var parameters = 'reference=' + result[j].reference +
       '&brand=' + 'DELTAPLUS' +
       '&designation=' + 'DeltaPlus' +
       '&description' +
       '&lotNumber=' + result[j].lotnumber +
       '&userName=' + result[j].username +
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
       /!*
       tx.executeSql('UPDATE cardInfor SET equipmentId=? WHERE product=? AND serial=? ',
       [data.equipmentId,
       data.reference,
       data.lotnumber], transactionSuccess, errorHandler);
       *!/

       // Workaround for above issue, to re-open db connection
       db.transaction(function (tx) {
       tx.executeSql('UPDATE cardInfor_user SET equipmentId=? WHERE product=? AND serial=? ',
       [data.equipmentId,
       data.reference,
       data.lotnumber], transactionSuccess, errorHandler);
       });

       } else {
       // myAlert('No equipment id returned !!!');
       //todo: handle failed equipment creation.
       }
       },
       error: function (m1, m2, m3) {
       //myAlert("Error Web Services status " + m2 + " Exception "  + m3);
       myAlert("appError", [m3]);
       }
       });
       } else {
       var manufactureDate = getDateFromStr(result[j].manufacturingdate);
       var firstcommissioningdate = getDateFromStr(result[j].firstcommissioningdate);
       var controlDate1 = getDateFromStr(result[j].controlDate1);
       var controlDate2 = getDateFromStr(result[j].controlDate2);
       var controlDate3 = getDateFromStr(result[j].controlDate3);
       var controlDate4 = getDateFromStr(result[j].controlDate4);
       var controlDate5 = getDateFromStr(result[j].controlDate5);
       var deleteFlag = result[j].ifDelete == 1 ? true : false;

       var parameters = 'equipmentId=' + result[j].equipmentId +
       '&reference=' + result[j].reference +
       '&brand=' + 'DELTAPLUS' +
       '&designation=' + 'DeltaPlus' +
       '&description' +
       '&lotNumber=' + result[j].lotnumber +
       '&userName=' + result[j].username +
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
       } else {
       //todo: handle failed equipment creation.
       // myAlert('No success returns');
       }
       },
       error: function (m1, m2, m3) {
       myAlert("Error Web Services status " + m2 + " Exception " + m3);
       myAlert("appError", [m3]);
       }
       });
       }
       }
       */

    });

    /*remove the deleted records after sync from remote server*/
    tx.executeSql('DELETE FROM cardInfor WHERE ifDelete = ?', ["1"], function (tx, re) {
      console.log("delete row count is ", re.rows.length);
    });
  });
}

function transactionSuccess(transaction, results) {
  //todo handle DB transaction success
  // myAlert("successful DB transaction: ");
  console.log('update successfully')
}

function errorHandler(transaction, error) {
  console.log('update failed')
  // myAlert("failure DB transaction: " + JSON.stringify(error));
  // todo handler error message for DB transactions.
  if (error.code === 1) {
    // DB Table already exists
    // alert("Table already exists");
  } else {
    // Error is a human-readable string.
    // alert('Oops.  Error was '+error.message+' (Code '+ error.code +')');
  }
  return false;
}

function updateReceivingData(data) {
  try {
    var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
    db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS cardInfor(product,serial,user,prod,start,sav1,sav2,sav3,sav4,sav5,ifFirst,ifDelete,equipmentId)');
      for (var i in data) {

        console.log('equipmentId ' + data[i].equipmentId + ' serial id: ' + data[i].lotnumber);

        (function (item) {
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
                  ], transactionSuccess, errorHandler);
              } catch (err) {
                console.log(err);
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
                ], transactionSuccess, errorHandler);
            }
          });
        })(data[i]);
      }
      myAlert('importSuccessfully');
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}
/* get char code from string */
function getCharCodeFromString(str) {
  if (isChinese(str)) {
    var res = [];
    for (var i = 0; i < str.length; i++) {
      res.push(str.charCodeAt(i));
    }
    ;
    return res.join('.');
  } else {
    return str;
  }
}

function getStringFromCharCode(str) {
  var res = "",
    arr = str.split(".");
  for (var i = 0; i < arr.length; i++) {
    res = res + String.fromCharCode(arr[i]);
  }
  if (isChinese(res)) {
    return res;
  } else {
    return str;
  }

}
/*
 end
 */

function clearReadInput(e) {
  var obj = e.target;
  var element = $(obj).parent().find('input');
  var answer;
  if (element.val() != "") {
    /*
     if (myConfirm('ifDelete')) {
     element.val('');
     }*/
    myConfirm('ifDelete', null, function (index) {
      //alert("comfirmation choose:" + index);
      if (index == 1) {
        element.val('');
      }
    });
  }
}

/**
 * show clear read input for scan_read
 */
function showClearReadInput() {
  var clearBtns = $(".scan_step2 form").find("span");
  clearBtns.each(function () {
    var input = $(this).parent().find('input');
    if (!input[0].disabled) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}
/**
 * for date picker
 */
function confirmToSelectDate() {
  var selectedMonth = parseInt($("select[name='month_tobe_selected']").val()),
    selectedYear = parseInt($("select[name='year_tobe_selected']").val());

  // todo: have to append 15 as date, otherwise, the remote will give error.
  // var value = "15/" + selectedMonth + "/" + selectedYear;
  var value = selectedMonth + "/" + selectedYear;
  //alert("confirmToSelectDate" + value);
  if (window.currentDateName === "start") {
    var proDate = $('.scan_step2 input[name="prod"]').val().split("/");
    if (selectedYear < parseInt(proDate[1]) || (selectedYear == parseInt(proDate[1]) && selectedMonth < parseInt(proDate[0]))) {
      myAlert('beforeProductDate');
      return false;
    }
    if (myConfirm('addFirstUseDate')) {
      $(".scan_step2 input[name='" + window.currentDateName + "']").val(value);
      $("#date_picker").popup('close');
    }
    ;
  }

  //alert("selected date = " + value);
  $(".scan_step2 input[name='" + window.currentDateName + "']").val(value);
  $("#date_picker").popup('close');
}

function cancelSelectDate(e) {
  console.log('->>>>>>>>>>>>> cancelSelectDate')
  $("#date_picker").popup('close');

/*  if(e.event == 'click')
    $("#date_picker").popup('close');
  else
    console.log('---> event: ' + e.event);*/
}

/**
 * for date picker to cancel / close the date picker
 */
$(".btn_confirmSelectDate").on('click', confirmToSelectDate);
$(".btn_cancelSelectDate").on('touchend', function(e) {
  console.log('event type = ' + e.type);
  cancelSelectDate(e)
});
$(".btn_cancelSelectDate").on('touchstart', function(e) {
  console.log('event type = ' + e.type);
  // cancelSelectDate(e)
});

$(".glyphicon-remove").on('click', function (e) {
  clearReadInput(e);
});

$('input[name="changeLang"]').change(changeLanguage);
//initialize position
var bodyHeight = $('body').height(),
  baseCount = bodyHeight / 640;
$('body').css('font-size', 0.8 * baseCount * 100 + '%');
$('.productList').css('height', bodyHeight * 0.45); //myproducts height
$('.scan_step1_2_instruction').css('height', bodyHeight * 0.25);
$('.productList_table').css('height', bodyHeight * 0.55);
$('.btn_back,.btn_home,.btn_set').css('font-size', bodyHeight * 0.08);
$('.btn_webhome').css('height', bodyHeight * 0.1).css('margin-left', bodyHeight * 0.02)
  .css('margin-top', bodyHeight * 0.02);
$('.form-control,.form-control[disabled]').css('height', bodyHeight * 0.04);
$('.little,.little[disabled]').css('height', bodyHeight * 0.04);
$('.user_login_form').css('height', bodyHeight * 0.2);
$('.scan_step3_1,.scan_step3_2,.scan_step3_3,.scan_step3_4').css('top', bodyHeight * 0.25);
//initialize date picker
//$(".scan_step2 .dateInput").val('').mobiscroll().date({
//    preset: 'date',
//    theme: 'android',
//    mode: 'clickpick',
//    display: 'modal',
//    lang: '',
//    dateOrder: 'mmy',
//    dateFormat: 'mm/yy',
//    onClose: function(val, type, inst) {
//        if (type === "cancel") {
//            return true;
//        } else {
//            if (this.name == "start") {
//                var proDate = $('.scan_step2 input[name="prod"]').val();
//                if (proDate === "") {
//                    navigator.notification.alert('Start Date cannot be selected if Production Date is empty', function() {}, window.i18n[window.localStorage['language']]['alert'],window.i18n[window.localStorage['language']]['ok']);
//                    return false;
//                }
//                if (val < proDate) {
//                    navigator.notification.alert(window.i18n[window.localStorage['language']]['beforeProductDate'], function() {}, window.i18n[window.localStorage['language']]['alert'],window.i18n[window.localStorage['language']]['ok']);
//                    return false;
//                }
//                return confirm(window.i18n[window.localStorage['language']]['addFirstUseDate']);
//            }
//            if(this.name==="sav1"||this.name==="sav2"||this.name==="sav3"||this.name==="sav4"||this.name==="sav5"){
//                if($('.scan_step2 input[name="prod"]').val()===""){
//                    navigator.notification.alert('Please fill production date first!', function() {}, window.i18n[window.localStorage['language']]['alert'],window.i18n[window.localStorage['language']]['ok']);
//                    return false;
//                }
//            }
//        }
//        return true;
//    }
//
//});

$(".scan_step2 .dateInput").val("").on('touchend', function (e) {
  var t = e.currentTarget;
  if (!t.disabled) {
    window.currentDateName = t.name;
    if (t.name == "start") {
      var proDate = $('.scan_step2 input[name="prod"]').val();
      if (proDate === "") {
        myAlert('startDateNotSelect');
        return false;
      }
    }
    if (t.name === "sav1" || t.name === "sav2" || t.name === "sav3" || t.name === "sav4" || t.name === "sav5") {
      if ($('.scan_step2 input[name="prod"]').val() === "") {
        myAlert('fillProductionDate');
        return false;
      }
    }
    $("#date_picker").popup('open');
  }
});
(function () {//initialize date picker year list
  var curYear = new Date().getFullYear(),
    options = [],
    curMonth = new Date().getMonth() + 1;
  for (var i = (curYear - 5); i <= (curYear + 5); i++) {
    options.push("<option value='" + i + "'>" + i + "</option>");
  }
  $("select[name='year_tobe_selected']").html(options).val(curYear);
  $("select[name='month_tobe_selected']").val(curMonth);

})();
//navigator
$(window).on('navigate', function (e, data) {
  //alert("navigate - " + data.state.direction + " - " + data.state.hash);
  if (data.state.direction == null && data.state.hash === "#scan") { //when back to #scan page
    $(".scan_step1_1").show(20);
    $(".scan_step1_2").hide(20);
    $(".scan_step1_3").hide(20);
    $(".scan_step1_4").hide(20);
    clearTimeout(timeoutId);
  }
  if (data.state.direction == null && data.state.hash === "#scan_sync") { //when back to #scan_sync page
    $(".scan_step3_1").show(20);
    $(".scan_step3_2").hide(20);
    $(".scan_step3_3").hide(20);
    $(".scan_step3_4").hide(20);
    clearTimeout(timeoutId);
  }
});
//initialize event
$('.generic_btn').on('touchstart', function () {
  $(this).addClass('generic_btn_click');
});
$('.generic_btn').on('touchend', function () {
  $(this).removeClass('generic_btn_click');
});
$('.generic_btn_scan').on('touchstart', function () {
  $(this).addClass('generic_btn_scan_click');
});
$('.generic_btn_scan').on('touchend', function () {
  $(this).removeClass('generic_btn_scan_click');
});
$('.btn_home').on('touchstart', function () {
  $(this).css('color', 'yellow');
});
$('.btn_home').on('touchend', function () {
  $(this).css('color', 'white');
  $.mobile.navigate("#home");
});
$('.btn_set').on('touchstart', function () {
  $(this).css('color', 'yellow');
});
$('.btn_set').on('touchend', function () {
  $(this).css('color', 'white');
  $.mobile.navigate("#setting");
});
$('.btn_back').on('touchstart', function () {
  $(this).css('color', 'yellow');
});
$('.btn_back').on('touchend', function () {
  $(this).css('color', 'white');
  if (window.location.hash == "#scan_read") {
    //alert("goto scan_read");
    if (!$('.scan_step2 input[name="user"]')[0].disabled) {
      $('.scan_step2 input[name="product"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="serial"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="user"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="prod"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="start"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="sav1"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="sav2"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="sav3"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="sav4"]').attr('disabled', 'disabled');
      $('.scan_step2 input[name="sav5"]').attr('disabled', 'disabled');
      $(".scan_step2_btn").hide();
      $(".scan_read_btn").show();
      showClearReadInput();
    } else {
      $.mobile.navigate("#scan");
      $('.scan_step1_1').show();
      $('.scan_step1_2').hide();
      $('.scan_step1_3').hide();
      $('.scan_step1_4').hide();
    }
  } else if (window.location.hash == "#myproducts") {
    if (hasViewMyPro) {
      $.mobile.back();
    } else {
      $('.scan_step1_1').show();
      $('.scan_step1_2').hide();
      $('.scan_step1_3').hide();
      $('.scan_step1_4').hide();
      $.mobile.navigate('#scan');
      hasViewMyPro = true;
    }
  } else if (window.location.hash === "#scan") {
    if ($(".scan_step1_1")[0].hidden) {
      $(".scan_step1_1").show();
      $(".scan_step1_2").hide();
      $(".scan_step1_3").hide();
      $(".scan_step1_4").hide();
    } else {
      $.mobile.back();
    }
  } else if (window.location.hash === "#scan_sync") {
    $.mobile.back();
    $(".scan_step2_btn").hide();
    $(".scan_read_btn").show();
    showClearReadInput();
  } else {
    $.mobile.back();
  }
});
$('.btn_webhome').on('touchend', function () {
  window.open('http://www.deltaplus.eu', '_system', 'location=yes');
});
$('.website').on('touchend', function () {
  window.open('http://www.deltaplus.eu', '_system', 'location=yes');
});
$(".menu_scan").on('touchend', function () {
  $('.scan_step1_1').show();
  $('.scan_step1_2').hide();
  $('.scan_step1_3').hide();
  $('.scan_step1_4').hide();
  $.mobile.navigate('#scan');
  // $.mobile.navigate('#scan_read');

  //window.history.pushState({}, '', '#scan');
});
$(".menu_view").on('touchend', function () {
  readCardInforListFromDB();
  $.mobile.navigate("#myproducts");
});
$(".menu_product").on('touchend', function () {

  //window.localStorage['userId'] = 11748068;
  //window.localStorage.clear();

  if (window.localStorage['userId']) {
    $.mobile.navigate('#product_manager_center');
  } else {
    $.mobile.navigate("#product_manager");
  }
});
$('.scan_step1_1_btn').on('touchstart', function () {
  $(this).toggleClass('scan_step1_1_btn_click');
});
$('.scan_step1_1_btn').on('touchend', function () {
  $(this).toggleClass('scan_step1_1_btn_click');
  scan_next(1, 1);
  isRead = true;
  isNfcEnable = true;
  timeoutId = setTimeout(function () {
    if (!ifTagFound) {
      isNfcEnable = false;
      scan_next(1, 2);
    } else {
      ifTagFound = false;
    }
  }, 20000);
});
$('.scan_step1_3_instruction').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.scan_step1_3_instruction').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  scan_next(1, 1);
  $('.scan_step1_3').hide();
  isRead = true;
  isNfcEnable = true;
  timeoutId = setTimeout(function () {
    if (!ifTagFound) {
      isNfcEnable = false;
      scan_next(1, 2);
    } else {
      ifTagFound = false;
    }
  }, 20000);
});
$('.scan_step1_4_instruction').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.scan_step1_4_instruction').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  $('.scan_step2 input[name="product"]').val(nfcData[0]);
  $('.scan_step2 input[name="serial"]').val(nfcData[1]);
  $('.scan_step2 input[name="user"]').val(getStringFromCharCode(nfcData[2]));
  $('.scan_step2 input[name="prod"]').val(nfcData[3]);
  $('.scan_step2 input[name="start"]').val(nfcData[4]);
  $('.scan_step2 input[name="sav1"]').val(nfcData[5]);
  $('.scan_step2 input[name="sav2"]').val(nfcData[6]);
  $('.scan_step2 input[name="sav3"]').val(nfcData[7]);
  $('.scan_step2 input[name="sav4"]').val(nfcData[8]);
  $('.scan_step2 input[name="sav5"]').val(nfcData[9]);
  $('.scan_step2 input[name="product"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="serial"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="user"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="prod"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="start"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="sav1"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="sav2"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="sav3"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="sav4"]').attr('disabled', 'disabled');
  $('.scan_step2 input[name="sav5"]').attr('disabled', 'disabled');
  $(".scan_step2_btn").hide();
  $(".scan_read_btn").show();
  $.mobile.navigate('#scan_read');
});

//new button for add id to my product only
$(".scan_add_to_myproduct").on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$(".scan_add_to_myproduct").on('touchend', function () {
  console.log('scanned records serila is ', $('.scan_step2 input[name="serial"]').val());
  if ($('.scan_step2 input[name="serial"]').val() === '') {
    myAlert('emptyCardFound');
    return;
  }
  // validate data before add to my product.
  var db = openDatabase('deltaplus', '1.0', 'deltaplus', 5 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS cardInfor(product,serial,user,prod,start,sav1,sav2,sav3,sav4,sav5,ifFirst,ifDelete,equipmentId)');
    tx.executeSql('SELECT serial FROM cardInfor WHERE serial = ?', [nfcData[1]], function (tx, re) {
      if (re.rows.length == 0) {
        writeCardInforToDB(true);
      } else {
        myAlert('productCantAdd', [nfcData[1]]);
      }
    });
  });
});

$(".scan_step2_btn").on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$(".scan_step2_btn").on('touchend', function () {
  // validate data before save into card
  if (validateForm()) {
    $.mobile.navigate('#scan_sync');
    $('.scan_step2 input[name="product"]').textinput('disable');
    $('.scan_step2 input[name="serial"]').textinput('disable');
    $('.scan_step2 input[name="user"]').textinput('disable');
    $('.scan_step2 input[name="prod"]').textinput('disable');
    $('.scan_step2 input[name="start"]').textinput('disable');
    $('.scan_step2 input[name="sav1"]').textinput('disable');
    $('.scan_step2 input[name="sav2"]').textinput('disable');
    $('.scan_step2 input[name="sav3"]').textinput('disable');
    $('.scan_step2 input[name="sav4"]').textinput('disable');
    $('.scan_step2 input[name="sav5"]').textinput('disable');
    showClearReadInput();
  }
  // $(this).toggleClass('general_btn_click').html('EDIT DATA');
});
$(".scan_step2_btn2").on("touchend", function () {
  $(".scan_read_btn").hide();
  $(".scan_step2_btn").show();
  if (version_maintenance) {
    $('.scan_step2 input[name="product"]').textinput('enable');
    $('.scan_step2 input[name="serial"]').textinput('enable');
    $('.scan_step2 input[name="user"]').textinput('enable');
    $('.scan_step2 input[name="prod"]').textinput('enable');
    $('.scan_step2 input[name="start"]').textinput('enable');
    $('.scan_step2 input[name="sav1"]').textinput('enable');
    $('.scan_step2 input[name="sav2"]').textinput('enable');
    $('.scan_step2 input[name="sav3"]').textinput('enable');
    $('.scan_step2 input[name="sav4"]').textinput('enable');
    $('.scan_step2 input[name="sav5"]').textinput('enable');
  }
  else if (ifEmpytyTag) {
    $('.scan_step2 input[name="product"]').textinput('enable');
    $('.scan_step2 input[name="serial"]').textinput('enable');
    $('.scan_step2 input[name="user"]').textinput('enable');
    $('.scan_step2 input[name="prod"]').textinput('enable');
    $('.scan_step2 input[name="start"]').textinput('enable');
  } else if (nfcData[10] == "0" || nfcData[10] == null) {
    $('.scan_step2 input[name="user"]').textinput('enable');
    $('.scan_step2 input[name="start"]').textinput('enable');
    nfcData[10] = '1';
  } else {
    $('.scan_step2 input[name="user"]').textinput('enable');
  }
  showClearReadInput();
  $('.scan_step3_1').show();
  $('.scan_step3_2').hide();
  $('.scan_step3_3').hide();
  $('.scan_step3_4').hide();
});
$(".scan_step3_1_btn").on('touchstart', function () {
  $(this).toggleClass('scan_step3_1_btn_click');
});
//register listener for syncronize functionality
$(".scan_step3_1_btn").on('touchend', function () {
  $(this).toggleClass('scan_step3_1_btn_click');
  nfcData[0] = $('.scan_step2 input[name="product"]').val();
  nfcData[1] = $('.scan_step2 input[name="serial"]').val();
  nfcData[2] = getCharCodeFromString($('.scan_step2 input[name="user"]').val());
  nfcData[3] = $('.scan_step2 input[name="prod"]').val();
  nfcData[4] = $('.scan_step2 input[name="start"]').val();
  nfcData[5] = $('.scan_step2 input[name="sav1"]').val();
  nfcData[6] = $('.scan_step2 input[name="sav2"]').val();
  nfcData[7] = $('.scan_step2 input[name="sav3"]').val();
  nfcData[8] = $('.scan_step2 input[name="sav4"]').val();
  nfcData[9] = $('.scan_step2 input[name="sav5"]').val();
  window.currentUpdatedRecordId = nfcData[1];//keep serial number for showing which one has been updated
  message = [
    ndef.mimeMediaRecord('mime/com.softtek.delta', nfc.stringToBytes(nfcData.join("~"))),
    ndef.uriRecord("http://www.deltaplus.eu")
  ];
  scan_next(3, 5);
  isRead = false;
  isNfcEnable = true;
  timeoutId = setTimeout(function () {
    if (!ifTagFound) {
      isNfcEnable = false;
      scan_next(3, 3);
    } else {
      ifTagFound = false;
    }
  }, 20000);
});
$(".scan_step3_3_instruction").on('touchstart', function () {
  $(this).toggleClass('scan_step3_1_btn_click');
});
$(".scan_step3_3_instruction").on('touchend', function () {
  $(this).toggleClass('scan_step3_1_btn_click');
  message = [
    ndef.mimeMediaRecord('mime/com.softtek.delta', nfc.stringToBytes(nfcData.join("~"))),
    ndef.uriRecord("http://www.deltaplus.eu")
  ];
  scan_next(3, 2);
  isRead = false;
  isNfcEnable = true;
  timeoutId = setTimeout(function () {
    if (!ifTagFound) {
      isNfcEnable = false;
      scan_next(3, 3);
    } else {
      ifTagFound = false;
    }
  }, 20000);
});
$(".scan_step3_4_instruction").on('touchend', function () {
  readCardInforListFromDB(true);//set true if need to show which one has been updated
});
$(".backToViewMyProducts").on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$(".backToViewMyProducts").on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  myConfirm('confirmToDeleteRecord', null, function (index) {
    if (index == 1) {
      deleteRecordFromDB($(".myproducts_detail_form input[name='serial']").val());
    }
  });
});
//setting
$('.menu_language').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.menu_language').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  initLanguageSelection();
  $("#language_setting").popup('open');
});
$('.menu_use').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.menu_use').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  // window.open('http://www.deltaplus.eu', '_blank', 'location=yes');
  window.open(web_index, '_system', 'location=yes');
});
$('.menu_update').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.menu_update').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  if (window.localStorage['userId']) {
    $.mobile.navigate('#product_manager_center');
  } else {
    $.mobile.navigate("#product_manager");
  }
});
$('.menu_about').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.menu_about').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  myAlert('version', [version_detail]);
});
//setting end
//product manager
$(".product_manager").on('touchend', function () {
  if (window.localStorage['userId']) {
    $.mobile.navigate('#product_manager_center');
  } else {
    $.mobile.navigate("#product_manager");
  }
});
$('.access_my').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.access_my').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  // window.open('http://www.deltaplus.eu', '_blank', 'location=yes');
  window.open(web_index + "?userId=" + window.localStorage['userId'], '_system', 'location=yes');
});
$('.upload_my').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.upload_my').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  prepareSendingData();
});
$('.backup_my').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.backup_my').on('touchend', function () {
  $(this).toggleClass('general_btn_click');

  var login = window.localStorage['username'];
  var password = window.localStorage['password'];
  var loader = showLoading('Loading');
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
      loader.hide();
      if (data) {
        updateReceivingData(data);
      } else {
        myAlert('noDataFound');
      }
    },
    error: function (jqXHR, status, throwerror) {
      loader.hide();
      myAlert("appError", [throwerror]);

    }
  });
});
$('.status_my').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.status_my').on('touchend', function () {
  $(this).toggleClass('general_btn_click');
  $.mobile.navigate('#ppe_status');
});


$('.signout').on('touchstart', function () {
  $(this).toggleClass('general_btn_click');
});
$('.signout').on('touchend', function () {
  $(this).toggleClass('general_btn_click');

  window.localStorage['userId'] = '';
  window.localStorage['username'] = '';
  window.localStorage['password'] = '';

  $.mobile.navigate('#home');
});

$("input[name='login']").change(function () {
  $(this).val($(this).val().toLowerCase());
});

//product manager end
//user login and registion
$(".validate_login").on('touchend', function () {

  if (!checkConnection()) {
    return;
  }

  var login = $("#product_manager input[name='login']").val(),
    password = $("#product_manager input[name='password']").val();

  if (isNull(login)) {
    myAlert('invalidInput', ['user']);
  } else if (isNull(password)) {
    myAlert('invalidInput', ['password']);
  } else {
    var loader = showLoading('Loading');
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
        xhr.setRequestHeader("Authorization", make_base_auth(login, password));
      },
      success: function (data, status) {
        loader.hide();
        if (typeof data.userId !== 'undefined') {
          window.localStorage['userId'] = data.userId;
          window.localStorage['username'] = login;
          window.localStorage['password'] = password;
          $("#product_manager input[name='login']").val("");
          $("#product_manager input[name='password']").val("");
          $.mobile.navigate('#product_manager_center');
        } else {
          myAlert('loginfailed');
          $("#product_manager input[name='password']").val("");
          $("#product_manager input[name='password']").focus();
        }
      },
      error: function (jqXHR, status, throwerror) {
        loader.hide();
        myAlert("appError", [throwerror]);
      }
    });
  }
});

$("#user_registion #email").change(function () {
  $(this).val($(this).val().toLowerCase());
});

$(".validate_registion").on('touchend', function () {
  var firstName = $("#user_registion #firstName").val(),
    lastName = $("#user_registion #lastName").val(),
    company = $("#user_registion #company").val(),
    phone = $("#user_registion #phone").val(),
    email = $("#user_registion #email").val(),
    password = $("#user_registion #password").val(),
    confirm = $("#user_registion #passwordConfirm").val();

  var emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  //Delta Type for Maintenance version
  var deltaType = 0;

  if (firstName == "" || lastName == "" || company == "" || phone == "" || email == "" || password == "" || confirm == "") {
    myAlert('creationMsgMissing');
  } else if (!emailRegEx.test(email.toLowerCase())) {
    myAlert('wrongEmail');
    $("#user_registion #email").val("");
    $("#user_registion #email").focus();
  } else if (password != confirm) {
    myAlert('confPassword');
    $("#user_registion #password").val("");
    $("#user_registion #passwordConfirm").val("");
    $("#user_registion #password").focus();
  } else if (password.length < 6) {
    myAlert('passworminlength');
    $("#user_registion #password").val("");
    $("#user_registion #passwordConfirm").val("");
    $("#user_registion #password").focus();
  } else {
    var loader = showLoading('Loading...');

    $.ajax({
      type: "GET",
      url: web_server_delta + "create-annual-check-account",
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json',
      data: {
        emailAddress: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        jobTitle: null,
        company: company,
        street1: null,
        zip: null,
        city: null,
        country: null,
        phoneNumber: phone,
        phoneExtension: null,
        faxNumber: null,
        faxExtension: null,
        companyActivity: null,
        companyWorkforce: null,
        companyTurnover: null,
        comment: null,
        contactWish: 'Mail',
        languageCode: 'en'
      },
      beforeSend: function (xhr, status) {
        //xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", make_base_auth(liferaywsUserAdmin, liferaywsPasswordAdmin));
      },
      success: function (data, status) {
        loader.hide();
        // fix error of https://github.com/stkwx-phabricator/nfc_deltacard/issues/5
        if (typeof data !== 'undefined' && typeof data.exception == 'undefined') {
          myAlert('accountCreated');
          $("#user_registion #firstName").val("");
          $("#user_registion #lastName").val("");
          $("#user_registion #email").val("");
          $("#user_registion #phone").val("");
          $("#user_registion #company").val("");
          $("#user_registion #password").val("");
          $("#user_registion #passwordConfirm").val("");
          $.mobile.navigate("#product_manager");
        } else {
          loader.hide();
          myAlert('noAccountCreate');
        }
      },
      error: function (jqXHR, status, throwerror) {
        loader.hide();
        myAlert("appError", [throwerror]);
      }
    });
  }
});

/**
 * Remember password Function binding.
 */

/*$(".nav_lost_password").on('click', function () {
 $.mobile.navigate('#remember_password');
 });*/

$('.nav_lost_password').on('touchend', function () {
  window.open(web_index, '_system', 'location=yes');
});

$(".nav_new_user_registration").on('click', function () {
  $.mobile.navigate('#user_registion');
});

$('.nav_about_product_manager').on('touchend', function () {
  window.open(web_index, '_system', 'location=yes');
});

$(".remember_password_step1_nextstep").on('click', function () {

  var login = $('#rp_step1_login').val();
  if (isNull(login)) {
    myAlert('invalidInput', ['user']);
    $('#rp_step1_login').focus();
    return;
  } else {
    if (!checkConnection()) {
      return;
    }
    var loader = showLoading('Loading...');
    $.post(web_server + "/restm.php", {
        type: 'findAccount',
        email: login
      }, function (data) {
        loader.hide();
        if (data && data.length != 0) {
          $('#rp_step2_email').val(data[0].email);
          $(".remember_password_step1").hide();
          $(".remember_password_step2").show();
          $('#rp_step1_login').val('');
        } else {
          myAlert('invalidInput', ['user']);
          $('#rp_step1_login').focus();
        }
      },
      'JSON').error(function () {
      loader.hide();
      myAlert('noConnect');
    });

  }
});
$(".remember_password_step2_nextstep").on('click', function () {
  var secCode = $('#rp_step2_secCode').val();
  if (isNull(secCode)) {
    myAlert('invalidInput', ['secCode']);
    $('#rp_step2_secCode').focus();
    return;
  } else {
    var loader = showLoading('Loading...');
    $.post(web_server + "/restm.php", {
        type: 'validateSecCode',
        secCode: secCode
      }, function (data) {
        loader.hide();
        //if (data && data.status == 'success') {
        if (window.localStorage['secCode'] == secCode) {
          $(".remember_password_step2").hide();
          $(".remember_password_step3").show();
          $('#rp_step2_secCode').val('')
          window.localStorage['secCode'] = '';

        } else {
          myAlert('invalidInput', ['secCode']);
          $('#rp_step2_secCode').focus();
        }
      },
      'JSON').error(function () {
      loader.hide();
      myAlert('noConnect');
    });
  }
});
$(".remember_password_step2_sendcode").on('click', function () {
  var email = $('#rp_step2_email').val();
  var loader = showLoading('Loading...');
  $.post(web_server + "/sendmail.php", {
      resource: 'mobile',
      email: email
    }, function (data) {
      loader.hide();
      if (data) {
        if (!isNull(data.secCode)) {
          myAlert('emailSendSuccess', [email]);
          window.localStorage['secCode'] = data.secCode;
        } else {
          myAlert('emailsendFail', [email]);
        }
      } else {
        myAlert('noConnect');
        $('#rp_step1_login').focus();
        return;
      }
    },
    'JSON').error(function (error) {
    loader.hide();
    myAlert('noConnect');
  });
});
$(".remember_password_step3_save").on('click', function () {
  var login = $('#rp_step2_email').val();
  var psw1 = $('#rp_step3_password1').val();
  var psw2 = $('#rp_step3_password2').val();
  if (!psw1 || !psw2 || psw1 == '' || psw2 == '') {
    myAlert('invalidInput', ['password']);
    return;
  }
  if (psw1 != psw2) {
    myAlert('confPassword');
    return;
  }
  if (psw1.length < 6) {
    myAlert('passworminlength');
    return;
  }
  var loader = showLoading('Loading...');
  $.post(web_server + "/restm.php", {
      type: 'resetPassword',
      login: login,
      password: psw1
    }, function (data) {
      loader.hide();
      myAlert('rp_step3_succes');
      $(".remember_password_step3").hide();
      $(".remember_password_step1").show();
      $.mobile.navigate('#product_manager');
      window.localStorage['secCode'] = '';
      $('#rp_step3_password1').val('');
      $('#rp_step3_password2').val('');

    },
    'JSON').error(function (error) {
    loader.hide();
    myAlert('noConnect');
  });

});

$(".remember_password_cancel").on('click', function () {
  $.mobile.navigate('#product_manager');
  $('#rp_step1_login').val('');
  return;
});


// valudate form input
function isNull(obj) {
  if (!obj || obj == '') {
    return true;
  }
  return false;
}

function showLoading(msg) {
  var uploadLoader = $.mobile.loading("show", {
    text: "foo",
    textVisible: true,
    theme: "z",
    html: '<span class="ui-bar ui-shadow ui-overlay-d ui-corner-all" style="background-color:white;"><span class="ui-icon-loading"></span><span style="font-size:2em;">' + msg + '</span></span>'
  });
  uploadLoader.show();
  return uploadLoader;
}

// check network available
function checkConnection() {
  var networkState = navigator.connection.type;

  /* var states = {};
   states[Connection.UNKNOWN]  = 'Unknown connection';
   states[Connection.ETHERNET] = 'Ethernet connection';
   states[Connection.WIFI]     = 'WiFi connection';
   states[Connection.CELL_2G]  = 'Cell 2G connection';
   states[Connection.CELL_3G]  = 'Cell 3G connection';
   states[Connection.CELL_4G]  = 'Cell 4G connection';
   states[Connection.CELL]     = 'Cell generic connection';
   states[Connection.NONE]     = 'No network connection';
   navigator.notification.alert('Connection type: ' + states[networkState]);*/
  var connected = networkState == Connection.NONE ? false : true;
  if (!connected) {
    myAlert('nonetwork');
  }
  return connected;
}

/*function checkLanguage() {
 navigator.globalization.getPreferredLanguage(
 function (language) {
 navigator.notification.alert('language 1: ' + language.value + '\n');
 var lang = language.value.split('-');
 navigator.notification.alert('language 2: ' + lang[0] + '\n');
 if(lang != null && (lang[0] == 'en' || lang[0] == 'zh' || lang[0] == 'sp' || lang[0] == 'fr') ) {
 window.localStorage['language'] = lang[0];
 }
 },
 function () {
 window.localStorage['language'] =  'en';
 //navigator.notification.alert('Error getting language\n');
 } );
 }*/

//end
//navigate
var app = {
  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    // console.log(device.cordova);
    // console.log(device.model);
    // console.log(device.name);
    // console.log(device.platform);
    // console.log(device.uuid);
    // console.log(device.version);
    navigator.splashscreen.hide();
    registeMimeTypeListener(mimeCallBack, mimeSuccessCallBack);
    registeTagListener(tagCallBack, tagSuccessCallBack);


  }
};
