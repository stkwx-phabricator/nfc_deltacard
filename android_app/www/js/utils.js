
"use strict"

function getDateFromStr(str) {
  if(str != null ) {
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
  return null;
}


function getMonth(date) {
  if(date != null) {
    return date.getMonth() + 1;
  }
  return null;
}


function getDate(date) {
  if(date != null) {
    return date.getDate();
  }
  return null;
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


