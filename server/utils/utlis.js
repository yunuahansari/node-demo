"use strict";

let Utils = {
  /**
   * Generate random string
   */
  generateRandomString: () => {
    let chars, token;
    (chars =
      "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"),
      (token = new Date().getTime() + "_");
    for (let x = 0; x < 16; x++) {
      let i = Math.floor(Math.random() * 62);
      token += chars.charAt(i);
    }
    return token;
  },

  /**
   * Generate random integer
   */
  generateRandomInteger() {
    return Math.floor(1000 + Math.random() * 9000);
  },

  /**
   * Generate code
   * @param {Object} model
   */
  generateCode(model) {
    return new Promise((resolve, reject) => {
      let createCode = () => {
        let code = Utils.generateRandomInteger();
        model
          .findOne({ where: { verify_token: code }, attributes: ["id"] })
          .then(data => {
            let existingUser = data ? data.get() : null;
            if (existingUser) {
              createCode();
            } else {
              resolve(code);
            }
          })
          .catch(error => {
            reject(error);
          });
      };
      createCode();
    });
  },

  /**
   * Generate access token
   * @param {Object} model
   */
  generateAccessToken(model) {
    return new Promise((resolve, reject) => {
      let createCode = () => {
        let code = Utils.generateRandomString();
        model
          .findOne({ where: { access_token: code }, attributes: ["id"] })
          .then(data => {
            let existingUser = data ? data.get() : null;
            if (existingUser) {
              createCode();
            } else {
              resolve(code);
            }
          })
          .catch(error => {
            reject(error);
          });
      };
      createCode();
    });
  },

  /**
   * Generate six digit referral code string
   */
  generateReferralCodeString: () => { 
    let chars, temp = '';
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    for (let x = 0; x < 6; x++) {  
        let i = Math.floor(Math.random() * 62);
        temp += chars.charAt(i);
    }
    temp = temp.toUpperCase();
    return temp;
  },

  /**
   * Check the uniquness of a referral code
   */
  generateReferralCode(customer, driver) {
    return new Promise((resolve, reject) => {
      let createCode = () => {
        let code = Utils.generateReferralCodeString();
        customer
          .findOne({ where: { referral_code: code }, attributes: ["id"] })
          .then(data => {
            let customerObj = data ? data.get() : null;
            if (customerObj) {
              createCode();
            } else {
              driver
                .findOne({ where: { referral_code: code }, attributes: ["id"] })
                .then(data => {
                  let driverObj = data ? data.get() : null;
                  if (driverObj) {
                    createCode(); 
                  }
                  else {
                    resolve(code);      
                  }  
              })
              .catch(error => {
                reject(error);
              });  
            }
          })
          .catch(error => {
            reject(error);
          });
      };
      createCode();
    });
  },

  /**
   * Get today date
   */
  getTodayDate() {
    let today = new Date();
    let date = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
  },

  /**
   *
   * @param {Date} date
   * @param {String} interval
   * @param {Number} units
   */
  dateAdd(date, interval, units) {
    let ret = new Date(date);
    let checkRollover = function() {
      if (ret.getDate() != date.getDate()) ret.setDate(0);
    };
    switch (interval.toLowerCase()) {
      case "year":
        ret.setFullYear(ret.getFullYear() + units);
        checkRollover();
        break;
      case "quarter":
        ret.setMonth(ret.getMonth() + 3 * units);
        checkRollover();
        break;
      case "month":
        ret.setMonth(ret.getMonth() + units);
        checkRollover();
        break;
      case "week":
        ret.setDate(ret.getDate() + 7 * units);
        break;
      case "day":
        ret.setDate(ret.getDate() + units);
        break;
      case "hour":
        ret.setTime(ret.getTime() + units * 3600000);
        break;
      case "minute":
        ret.setTime(ret.getTime() + units * 60000);
        break;
      case "second":
        ret.setTime(ret.getTime() + units * 1000);
        break;
      default:
        ret = undefined;
        break;
    }
    return ret;
  },

  /**
   *
   * @param {Date} date
   * @param {String} interval
   * @param {Number} units
   */
  dateMinus(date, interval, units) {
    let ret = new Date(date);
    let checkRollover = function() {
      if (ret.getDate() != date.getDate()) ret.setDate(0);
    };
    switch (interval.toLowerCase()) {
      case "year":
        ret.setFullYear(ret.getFullYear() - units);
        checkRollover();
        break;
      case "quarter":
        ret.setMonth(ret.getMonth() - 3 * units);
        checkRollover();
        break;
      case "month":
        ret.setMonth(ret.getMonth() - units);
        checkRollover();
        break;
      case "week":
        ret.setDate(ret.getDate() - 7 * units);
        break;
      case "day":
        ret.setDate(ret.getDate() - units);
        break;
      case "hour":
        ret.setTime(ret.getTime() - units * 3600000);
        break;
      case "minute":
        ret.setTime(ret.getTime() - units * 60000);
        break;
      case "second":
        ret.setTime(ret.getTime() - units * 1000);
        break;
      default:
        ret = undefined;
        break;
    }
    return ret;
  },

  /**
   * Get date difference
   * @param {Date} date
   * @param {String} interval
   * @param {Number} units
   */
  dateDifference(date1, date2) {
    let one_day = 1000 * 60 * 60 * 24;
    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();
    
    let difference_ms = date2_ms - date1_ms;    
    difference_ms = difference_ms / 1000;
    let seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    let minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    let hours = Math.floor(difference_ms % 24);

    return (
      hours +
      "h " +
      minutes +
      "m " +
      seconds +
      "s" 
    );
  },

  getImageNameFromUrl(url){
    let index = url.lastIndexOf("/") + 1;
    let filename = url.substr(index);
    return filename;
  }   
};

export default Utils;
