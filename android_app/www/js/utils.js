
"use strict"

function getDateFromStr(str) {
  if(str != null  && str != "") {
    return new Date(str)
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

    return month + "/" + day + "/" + year;
  } else {
    return ""
  }
}


