var CryptoJS = require("crypto-js");
var secretkey = 'fe70272e29334860a781257dce7e1969';

exports.getChecksumString = function(data) {
  var checksumstring = "";
  var checksumsequence = ["amount","bankid","buyerAddress",
        "buyerCity","buyerCountry","buyerEmail","buyerFirstName","buyerLastName","buyerPhoneNumber","buyerPincode",
        "buyerState","currency","debitorcredit","merchantIdentifier","merchantIpAddress","mode","orderId",
        "product1Description","product2Description","product3Description","product4Description",
        "productDescription","productInfo","purpose","returnUrl","shipToAddress","shipToCity","shipToCountry",
        "shipToFirstname","shipToLastname","shipToPhoneNumber","shipToPincode","shipToState","showMobile","txnDate",
        "txnType","zpPayOption"];
  for (var seq in checksumsequence) {
    for (var key in data) {
      if((key.toString()) === checksumsequence[seq]) {
        if(data[key].toString() !== "") {
          checksumstring += key+"="+data[key].toString()+"&";
        }
      }
    }
  }
  return checksumstring;
}

exports.getResponseChecksumString = function(data) {
  var checksumstring = "";
  var checksumsequence = ["amount","bank","bankid","cardId",
        "cardScheme","cardToken","cardhashid","doRedirect","orderId",
        "paymentMethod","paymentMode","responseCode","responseDescription",
        "productDescription","product1Description","product2Description",
        "product3Description","product4Description","pgTransId","pgTransTime"];

  for (var seq in checksumsequence) {
    for (var key in data) {
      if((key.toString()) === checksumsequence[seq]) {
        checksumstring += key+"="+data[key].toString()+"&";
      }
    }
  }
  return checksumstring;
}

exports.getCheckAndUpdateChecksumString = function(data) {
  var checksumstring = "";
  for (var key in data) {
    checksumstring += "'"+data[key]+"'";
  }
  return checksumstring;
}

exports.calculateChecksum = function(checksumstring) {
  return CryptoJS.HmacSHA256(checksumstring,secretkey);
}