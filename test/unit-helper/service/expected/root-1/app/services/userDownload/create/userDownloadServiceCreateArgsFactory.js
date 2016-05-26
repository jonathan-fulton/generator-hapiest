'use strict';

const _ = require('lodash');
const UserDownloadServiceCreateArgs = require('./userDownloadServiceCreateArgs');

class UserDownloadServiceCreateArgsFactory {

   /**
    * @param {object} obj
    * @param {string} obj.firstName
    * @param {string} obj.lastName
    * @param {string} obj.email
    * @param {int} obj.numSignupAttempts
    *
    * @returns {UserDownloadServiceCreateArgs}
    */
    static createFromJsObj(obj) {
       const newArgs = _.cloneDeep(obj);
       return new UserDownloadServiceCreateArgs(newArgs);
    }

}

module.exports = UserDownloadServiceCreateArgsFactory;