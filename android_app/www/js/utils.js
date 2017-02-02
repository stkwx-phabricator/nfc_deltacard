
"use strict"

/**
 *
 * @param str eg. '15/12/2016'
 * @returns {*}
 */
function getDateFromStr(strDate) {
  // Note: by default, user only choose month/year in front-end, so have to prefix 15 as day.
  if(strDate != null  && strDate != "") {
    var str = strDate;
    if(strDate.length < 10) {
      str = '15/' + strDate;
    }
    console.log(str.substr(0, str.indexOf('/')))
    console.log(str.substr(str.indexOf('/')+1, str.indexOf('/', str.indexOf('/')+1) - str.indexOf('/') - 1 ))
    console.log(str.substr(str.indexOf('/', str.indexOf('/')+1)+1, str.length +1))

    var day = str.substr(0, str.indexOf('/'));
    var month = str.substr(str.indexOf('/')+1, str.indexOf('/', str.indexOf('/') + 1) - str.indexOf('/') - 1 );
    var year = str.substr(str.indexOf('/', str.indexOf('/') + 1) + 1, str.length + 1);
    var date = month + '/' + day + '/' + year;

    return new Date(date)
  }
  return null;
}

function getEmptyValue(val) {
  if(val != null) {
    return val;
  }
  return ""
}

/**
 *
 * @param date
 * @returns {*}
 */
function getYear(date) {
  if(date != null) {
    return date.getFullYear();
  }
  return 0;
}


function getMonth(date) {
  if(date != null) {
    return date.getMonth() + 1;
  }
  return 0;
}


function getDate(date) {
  if(date != null) {
    return date.getDate();
  }
  return 0;
}

/**
 *
 * @param ms
 * @returns {*}
 */
function getFullDate(ms) {
  if(ms != null) {
    var date =  new Date(ms);
    var month = date.getMonth() +1;
    var year = date.getFullYear();
    var day = date.getDate();

    // TODO: remove the day
    // return day + "/" + month + "/" + year;
    return month + "/" + year;
  } else {
    return ""
  }
}


var str = '21/12/2016'
console.log(getDateFromStr(str));

console.log(str.indexOf('/'))
console.log(str.indexOf('/', str.indexOf('/')+1))

console.log(str.substr(0, str.indexOf('/')))
console.log(str.substr(str.indexOf('/')+1, str.indexOf('/', str.indexOf('/')+1) - str.indexOf('/') - 1 ))
console.log(str.substr(str.indexOf('/', str.indexOf('/')+1)+1, str.length +1))

// console.log(str.)